// ============================================================================
// The startup file of the main Electron process
// ============================================================================

import { BrowserWindow, app, ipcMain } from "electron";

import { forwardRendererState } from "./main-state/main-store";
import { ForwardActionRequest } from "@core/messaging/message-types";
import {
  setupMenu,
  startStateChangeProcessing,
  stopStateChangeProcessing,
} from "./app/app-menu";
import {
  appConfiguration,
  appSettings,
} from "./main-state/klive-configuration";
import { __WIN32__ } from "./utils/electron-utils";
import { setWindowsAction } from "@state/is-windows-reducer";
import { processIdeRequest } from "./communication/process-ide-requests";
import { processEmulatorRequest } from "./communication/process-emulator-requests";
import { registerSite } from "@abstractions/process-site";
import { sendFromMainToEmu } from "@core/messaging/message-sending";
import {
  executeKliveCommand,
  registerCommonCommands,
} from "@abstractions/common-commands";
import { Z80CompilerService } from "./z80-compiler/z80-compiler-service";
import {
  dispatch,
  registerService,
  SETTINGS_SERVICE,
  Z80_COMPILER_SERVICE,
} from "@core/service-registry";
import { emuWindow, setupEmuWindow } from "./app/emu-window";
import { ideWindow, setupIdeWindow } from "./app/ide-window";
import {
  registerCompiler,
  registerCompilerExtension,
} from "@abstractions/compiler-registry";
import { Z80Compiler } from "./z80-compiler/Z80Compiler";
import { ZxBasicCompiler } from "./zxbasic-compiler/ZxBasicCompiler";
import { MainSettingsService } from "./app/settings-service";

// --- Register services used by the main process
registerService(Z80_COMPILER_SERVICE, new Z80CompilerService());
registerService(SETTINGS_SERVICE, new MainSettingsService());

// --- Sign that this process is the main process
registerSite("main");
registerCommonCommands();

// --- Register compilers and extensions
const z80Compiler = new Z80Compiler();
registerCompiler(z80Compiler);
registerCompilerExtension(z80Compiler.id, ".kz80.asm");
const zxBasicCompiler = new ZxBasicCompiler();
registerCompiler(zxBasicCompiler);
registerCompilerExtension(zxBasicCompiler.id, ".zxbas");

// --- This method will be called when Electron has finished
// --- initialization and is ready to create browser windows.
// --- Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  await doSetup();
  dispatch(setWindowsAction(__WIN32__));

  // --- Set up application state according to saved settings
  if (appSettings) {
    const viewOptions = appSettings.viewOptions;
    if (viewOptions) {
      executeKliveCommand(
        viewOptions.showToolbar ? "showToolbar" : "hideToolbar"
      );
      executeKliveCommand(
        viewOptions.showStatusbar ? "showStatusBar" : "hideStatusBar"
      );
      executeKliveCommand(
        viewOptions.showFrameInfo ? "showFrameInfo" : "hideFrameInfo"
      );
      executeKliveCommand(
        viewOptions.showKeyboard ? "showKeyboard" : "hideKeyboard"
      );
      executeKliveCommand(
        viewOptions.showSidebar ? "showSidebar" : "hideSidebar"
      );
    }
  }

  // --- Make sure that application configuration is sent to renderers
  sendFromMainToEmu({
    type: "ForwardAppConfig",
    config: appConfiguration,
  });

  // --- Create the machine and set its state according to the saved settings
  const initialMachineType =
    appSettings?.machineType ?? appConfiguration?.machineType ?? "sp48";
  const settings = appSettings?.machineSpecific?.[initialMachineType];
  await emuWindow.requestMachineType(initialMachineType, undefined, settings);
});

// --- Quit when all windows are closed.
app.on("window-all-closed", () => {
  // --- On OS X it is common for applications and their menu bar
  // --- to stay active until the user quits explicitly with Cmd + Q
  stopStateChangeProcessing();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// --- Set up windows before the first activation
app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await doSetup();
  }
});

// --- Make sure the application settings are saved
app.on("before-quit", () => {
  emuWindow.saveAppSettings();
  ideWindow.allowClose = true;
});

// --- This channel forwards renderer state (Emu or IDE) to the other renderer (IDE or Emu)
ipcMain.on("MainStateRequest", (_ev, msg: ForwardActionRequest) => {
  forwardRendererState(msg);
});

// --- This channel processes requests arriving from the Emu process
ipcMain.on("EmuToMainRequest", async (_ev, msg: ForwardActionRequest) => {
  const response = await processEmulatorRequest(msg);
  response.correlationId = msg.correlationId;
  if (emuWindow?.window.isDestroyed() === false) {
    emuWindow.window.webContents.send("EmuToMainResponse", response);
  }
});

// --- This channel processes requests arriving from the Emu process
ipcMain.on("IdeToEmuMainRequest", async (_ev, msg: ForwardActionRequest) => {
  const response = await processIdeRequest(msg);
  response.correlationId = msg.correlationId;
  if (ideWindow?.window.isDestroyed() === false) {
    ideWindow.window.webContents.send("IdeToEmuMainResponse", response);
  }
});

/**
 * Helper function to carry out the setup
 */
async function doSetup(): Promise<void> {
  await setupEmuWindow();
  await setupIdeWindow();
  startStateChangeProcessing();
  setupMenu();
}
