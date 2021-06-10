import * as React from "react";
import { useSelector } from "react-redux";
import ReactResizeDetector from "react-resize-detector";
import { AppState } from "../../shared/state/AppState";
import { VirtualMachineCoreBase } from "../machines/VirtualMachineCoreBase";
import {
  vmEngineService,
  VmStateChangedArgs,
} from "../machines/vm-engine-service";
import BeamOverlay from "./BeamOverlay";
import ExecutionStateOverlay from "./ExecutionStateOverlay";
import styles from "styled-components";
import { useEffect, useState } from "react";

const TURNED_OFF_MESSAGE =
  "Not yet started. Press F5 to start or Ctrl+F5 to debug machine.";

/**
 * Represents the display panel of the emulator
 */
export default function EmulatorPanel() {
  // --- State variables
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [overlay, setOverlay] = useState(TURNED_OFF_MESSAGE);
  const [showOverlay, setShowOverlay] = useState(true);
  const [tactToDisplay, setTactToDisplay] = useState(0);

  // --- App state selectors
  const executionState = useSelector(
    (s: AppState) => s.emulatorPanel.executionState
  );
  const showBeam = useSelector(
    (s: AppState) => s?.spectrumSpecific?.showBeamPosition
  );

  // --- Element dimensions
  let shadowCanvasWidth = 0;
  let shadowCanvasHeight = 0;
  let calcCount = 0;
  let hostRectangle: DOMRect;
  let screenRectangle: DOMRect;

  // --- Element references
  const hostElement: React.RefObject<HTMLDivElement> = React.createRef();
  const screenElement: React.RefObject<HTMLCanvasElement> = React.createRef();
  const shadowScreenElement: React.RefObject<HTMLCanvasElement> =
    React.createRef();

  let imageBuffer: ArrayBuffer;
  let imageBuffer8: Uint8Array;
  let pixelData: Uint32Array;

  let pressedKeys: Record<string, boolean> = {};

  // --- Prepare the virtual machine engine
  let engine: VirtualMachineCoreBase | null = null;

  useEffect(() => {
    // --- Mount
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    vmEngineService.vmEngineChanged.on(vmChange);
    vmEngineService.executionStateChanged.on(executionStateChange);
    calculateDimensions();
    if (vmEngineService.hasEngine) {
      engine = vmEngineService.getEngine();
      vmEngineService.screenRefreshed.on(displayScreenData);
      calculateDimensions();
      configureScreen();
    }

    return () => {
      // --- Unmount
      if (engine) {
        vmEngineService.screenRefreshed.off(displayScreenData);
        vmEngineService.vmEngineChanged.off(vmChange);
        vmEngineService.executionStateChanged.on(executionStateChange);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  return (
    <Root ref={hostElement} tabIndex={-1}>
      <Screen
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
        }}
        onClick={() => setShowOverlay(true)}
      >
        {executionState === 3 && showBeam && (
          <BeamOverlay
            key={calcCount}
            panelRectangle={hostRectangle}
            screenRectangle={screenRectangle}
            width={windowWidth}
            height={windowHeight}
            tactToDisplay={tactToDisplay}
          />
        )}
        {showOverlay && (
          <ExecutionStateOverlay
            text={overlay}
            clicked={() => {
              setShowOverlay(false);
            }}
          />
        )}
        <canvas ref={screenElement} width={canvasWidth} height={canvasHeight} />
        <canvas
          ref={shadowScreenElement}
          style={{ display: "none" }}
          width={shadowCanvasWidth}
          height={shadowCanvasHeight}
        />
      </Screen>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={calculateDimensions}
      />
    </Root>
  );

  function vmChange(): void {
    if (engine) {
      vmEngineService.screenRefreshed.off(displayScreenData);
    }
    engine = vmEngineService.getEngine();
    if (engine) {
      vmEngineService.screenRefreshed.on(displayScreenData);
    }
    calculateDimensions();
    configureScreen();
    hideDisplayData();
    setOverlay(TURNED_OFF_MESSAGE);
  }

  function executionStateChange(args: VmStateChangedArgs): void {
    calculateDimensions();
    let overlay = "";
    switch (args.newState) {
      case 1:
        overlay = args.isDebug ? "Debug mode" : "";
        break;
      case 3:
        overlay = "Paused";
        const state = engine.getMachineState();
        setTactToDisplay(state.lastRenderedFrameTact % state.tactsInFrame);
        displayScreenData();
        break;
      case 5:
        overlay = "Stopped";
        break;
      default:
        overlay = "";
        break;
    }
    setOverlay(overlay);
  }

  function handleKeyDown(e: KeyboardEvent): void {
    handleKey(e, true);
  }

  function handleKeyUp(e: KeyboardEvent): void {
    handleKey(e, false);
  }

  // --- Calculate the dimensions so that the virtual machine display fits the screen
  function calculateDimensions(): void {
    if (!hostElement?.current || !vmEngineService.hasEngine) {
      return;
    }
    hostRectangle = hostElement.current.getBoundingClientRect();
    screenRectangle = screenElement.current.getBoundingClientRect();
    const clientWidth = hostElement.current.offsetWidth;
    const clientHeight = hostElement.current.offsetHeight;
    const width = vmEngineService.getEngine().screenWidth;
    const height = vmEngineService.getEngine().screenHeight;
    let widthRatio = Math.floor((clientWidth - 8) / width);
    if (widthRatio < 1) widthRatio = 1;
    let heightRatio = Math.floor((clientHeight - 8) / height);
    if (heightRatio < 1) heightRatio = 1;
    const ratio = Math.min(widthRatio, heightRatio);
    setCanvasWidth(width * ratio);
    setCanvasHeight(height * ratio);
    shadowCanvasWidth = width;
    shadowCanvasHeight = height;
    setWindowWidth(hostRectangle.width);
    setWindowHeight(hostRectangle.height);
    calcCount = calcCount + 1;
    shadowScreenElement.current.width = width;
    shadowScreenElement.current.height = height;
  }

  // --- Setup the screen buffers
  function configureScreen(): void {
    const dataLen = shadowCanvasWidth * shadowCanvasHeight * 4;
    imageBuffer = new ArrayBuffer(dataLen);
    imageBuffer8 = new Uint8Array(imageBuffer);
    pixelData = new Uint32Array(imageBuffer);
  }

  // --- Displays the screen
  function displayScreenData(): void {
    const screenEl = screenElement.current;
    const shadowScreenEl = shadowScreenElement.current;
    if (!screenEl || !shadowScreenEl) {
      return;
    }

    const shadowCtx = shadowScreenEl.getContext("2d");
    if (!shadowCtx) return;

    shadowCtx.imageSmoothingEnabled = false;
    const shadowImageData = shadowCtx.getImageData(
      0,
      0,
      shadowScreenEl.width,
      shadowScreenEl.height
    );
    const screenCtx = screenEl.getContext("2d");
    let j = 0;

    const screenData = engine.getScreenData();
    for (let i = 0; i < shadowCanvasWidth * shadowCanvasHeight; i++) {
      pixelData[j++] = screenData[i];
    }
    shadowImageData.data.set(imageBuffer8);
    shadowCtx.putImageData(shadowImageData, 0, 0);
    if (screenCtx) {
      screenCtx.imageSmoothingEnabled = false;
      screenCtx.drawImage(shadowScreenEl, 0, 0, canvasWidth, canvasHeight);
    }
  }

  // --- Hide the display
  function hideDisplayData(): void {
    const screenEl = screenElement.current;
    if (!screenEl) return;

    const screenCtx = screenEl.getContext("2d");
    if (screenCtx) {
      screenCtx.clearRect(0, 0, screenEl.width, screenEl.height);
    }
  }

  function handleKey(e: KeyboardEvent, isDown: boolean): void {
    if (!e || executionState !== 1) return;

    // --- Special key: both Shift released
    if (
      (e.code === "ShiftLeft" || e.code === "ShiftRight") &&
      e.shiftKey === false &&
      !isDown
    ) {
      handleMappedKey("ShiftLeft", false);
      handleMappedKey("ShiftRight", false);
    } else {
      handleMappedKey(e.code, isDown);
    }
    if (isDown) {
      pressedKeys[e.code.toString()] = true;
    } else {
      delete pressedKeys[e.code.toString()];
    }
  }

  function handleMappedKey(code: string, isDown: boolean): void {
    if (engine) {
      engine.handlePhysicalKey(code, isDown);
    }
  }
}

// --- Helper component tags
const Root = styles.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  width: 100%;
  background-color: var(--emulator-background-color);
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  outline: none;
`;

const Screen = styles.div`
  background-color: #404040;
`;
