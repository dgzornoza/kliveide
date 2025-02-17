import * as React from "react";
import { CSSProperties } from "react";
import { useSelector } from "react-redux";

import { AppState } from "@state/AppState";
import { ExecutionStateOverlay } from "./ExecutionStateOverlay";
import { useEffect, useRef, useState } from "react";
import { ICpu } from "@modules-core/abstract-cpu";
import { VirtualMachineCoreBase } from "@modules-core/abstract-vm";
import { getVmEngineService } from "@modules-core/vm-engine-service";
import { useResizeObserver } from "@components/useResizeObserver";

/**
 * Represents the display panel of the emulator
 */
export const EmulatorPanel: React.VFC = () => {
  const hostRectangle = useRef<DOMRect>();
  const screenRectangle = useRef<DOMRect>();

  // --- State variables
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);

  // --- App state selectors
  const executionState = useSelector(
    (s: AppState) => s.emulatorPanel.executionState
  );
  const runsInDebug = useSelector((s: AppState) => s.emulatorPanel.runsInDebug);

  // --- Element dimensions
  let shadowCanvasWidth = 0;
  let shadowCanvasHeight = 0;
  let calcCount = 0;

  // --- Element references
  const hostElement = React.useRef<HTMLDivElement>();
  const screenElement = React.useRef<HTMLCanvasElement>();
  const shadowScreenElement = React.useRef<HTMLCanvasElement>();

  let imageBuffer: ArrayBuffer;
  let imageBuffer8: Uint8Array;
  let pixelData: Uint32Array;

  let pressedKeys: Record<string, boolean> = {};

  // --- Prepare the virtual machine engine
  let engine: VirtualMachineCoreBase<ICpu> | null = null;

  // --- Respond to resizing the main container
  useResizeObserver(hostElement, () => calculateDimensions());

  useEffect(() => {
    // --- Take care that keys reach the engine
    window.addEventListener("keydown", (e) => handleKey(e, true));
    window.addEventListener("keyup", (e) => handleKey(e, false));

    // --- Respond to exngine changes
    const vmEngineService = getVmEngineService();
    vmEngineService.vmEngineChanged.on(vmChange);

    // --- Set up the virtual machine's view according to its
    // --- execution state and current hw config
    calculateDimensions();
    if (vmEngineService.hasEngine) {
      engine = vmEngineService.getEngine();
      vmEngineService.screenRefreshed.on(displayScreenData);
      calculateDimensions();
      configureScreen();
      let overlay = "";
      switch (executionState) {
        case 0:
          overlay =
            "Not yet started. Press F5 to start or Ctrl+F5 to debug machine.";
          break;
        case 1:
          overlay = runsInDebug ? "Debug mode" : "";
          break;
        case 3:
          overlay = "Paused";
          const state = engine.getMachineState();
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

    return () => {
      // --- Unmount
      if (engine) {
        vmEngineService.screenRefreshed.off(displayScreenData);
        vmEngineService.vmEngineChanged.off(vmChange);
      }
      window.removeEventListener("keydown", (e) => handleKey(e, true));
      window.removeEventListener("keyup", (e) => handleKey(e, false));
    };
  });

  return (
    <div style={rootStyle} ref={hostElement} tabIndex={-1}>
      <div
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          backgroundColor: "#404040",
        }}
        onClick={() => setShowOverlay(true)}
      >
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
      </div>
    </div>
  );

  function vmChange(): void {
    const vmEngineService = getVmEngineService();
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
  }

  // --- Calculate the dimensions so that the virtual machine display fits the screen
  function calculateDimensions(): void {
    const vmEngineService = getVmEngineService();
    if (
      !hostElement?.current ||
      !screenElement?.current ||
      !vmEngineService.hasEngine
    ) {
      return;
    }
    hostRectangle.current = hostElement.current.getBoundingClientRect();
    screenRectangle.current = screenElement.current.getBoundingClientRect();
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
    calcCount = calcCount + 1;
    if (shadowScreenElement.current) {
      shadowScreenElement.current.width = width;
      shadowScreenElement.current.height = height;
    }
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
};

// --- Helper component tags
const rootStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
  flexShrink: 0,
  flexGrow: 0,
  height: "100%",
  width: "100%",
  backgroundColor: "var(--emulator-background-color)",
  boxSizing: "border-box",
  justifyContent: "center",
  alignItems: "center",
  outline: "none",
};
