import * as fs from "fs";

import { dialog, Menu, MenuItemConstructorOptions } from "electron";
import { LinkDescriptor, MachineContextProviderBase } from "./machine-context";
import { AppState } from "@state/AppState";
import { BinaryReader } from "@core/utils/BinaryReader";
import {
  spectrumFastLoadAction,
  spectrumTapeContentsAction,
} from "@state/spectrum-specific-reducer";
import {
  emuSetClockMultiplierAction,
  emuSetKeyboardLayoutAction,
} from "@state/emulator-panel-reducer";
import { ExtraMachineFeatures } from "@abstractions/machine-specfic";
import { setSoundLevel, setSoundLevelMenu } from "../../main/app/app-menu";
import { MachineCreationOptions } from "../abstractions/vm-core-types";
import { dispatch, getState } from "@core/service-registry";
import { emuWindow } from "../../main/app/emu-window";
import { checkTapeFile } from "@modules/vm-zx-spectrum/readers";
import { Sp3EConstructionOptions } from "@modules/vm-zx-spectrum/sp3e-specific";
import {
  machineIdFromMenuId,
  menuIdFromMachineId,
} from "../../main/utils/electron-utils";

// --- Menu identifier contants
const TOGGLE_FAST_LOAD = "sp_toggle_fast_load";
const SET_TAPE_FILE = "sp_set_tape_file";
const DISK_MENU = "sp3e_disk_menu";
const CREATE_VIRTUAL_DISK = "sp3e_create_virtual_disk";
const FLOPPY_MENU = "sp3e_floppies";
const NO_FLOPPY_LABEL = "floppy0";
const ONE_FLOPPY_LABEL = "floppy1";
const TWO_FLOPPIES_LABEL = "floppy2";
const NO_FLOPPY = "spP3e_" + NO_FLOPPY_LABEL;
const ONE_FLOPPY = "spP3e_" + ONE_FLOPPY_LABEL;
const TWO_FLOPPY = "spP3e_" + TWO_FLOPPIES_LABEL;
const INSERT_DISK_A = "spP3e_insert_disk_A";
const INSERT_DISK_B = "spP3e_insert_disk_B";
const EJECT_DISK_A = "spP3e_eject_disk_A";
const EJECT_DISK_B = "spP3e_eject_disk_B";

// --- Other constants
const FLOPPY_FOLDER = "floppy";

// --- ZX Spectrum-specific menu items
const zxSpectrumLinks: LinkDescriptor[] = [
  {
    label: "ZX Spectrum 48 BASIC",
    uri: "https://dotneteer.github.io/kliveide/spectrum/basic-toc.html",
  },
];

/**
 * Context provider for ZX Spectrum machine types
 */
export abstract class ZxSpectrumContextProviderBase extends MachineContextProviderBase {
  // --- The last used tape file
  protected _lastTapeFile: string | null = null;

  /**
   * Constructs the provider with the specified options
   * @param options
   */
  constructor(options?: Record<string, any>) {
    super(options);
    dispatch(emuSetKeyboardLayoutAction(""));
  }

  /**
   * Firmware sizes accected by the virtual machine
   */
  readonly acceptedFirmwareSizes: number[] | null = [0x4000];

  /**
   * Items to add to the machine menu
   */
  provideMachineMenuItems(): MenuItemConstructorOptions[] | null {
    return [
      {
        id: TOGGLE_FAST_LOAD,
        label: "Fast load from tape",
        type: "checkbox",
        checked: true,
        click: (mi) => {
          dispatch(spectrumFastLoadAction(mi.checked));
          emuWindow.saveKliveProject();
        },
      },
      {
        id: SET_TAPE_FILE,
        label: "Set tape file...",
        click: async () => {
          await this.selectTapeFile();
          emuWindow.saveKliveProject();
        },
      },
    ];
  }

  /**
   * When the application state changes, you can update the menus
   */
  updateMenuStatus(state: AppState): void {
    const menu = Menu.getApplicationMenu();
    const toggleFastLoad = menu.getMenuItemById(TOGGLE_FAST_LOAD);
    if (toggleFastLoad) {
      toggleFastLoad.checked = !!state.spectrumSpecific?.fastLoad;
      emuWindow.saveKliveProject();
    }
  }

  /**
   * Items to add to the Help menu
   */
  provideHelpMenuItems(): MenuItemConstructorOptions[] | null {
    return this.getHyperlinkItems(zxSpectrumLinks);
  }

  /**
   * The normal CPU frequency of the machine
   */
  abstract getNormalCpuFrequency(): number;

  /**
   * Override this method to get the machine-specific settings
   */
  getMachineSpecificSettings(): Record<string, any> {
    const state = getState();
    const spectrum = state.spectrumSpecific;
    return {
      fastLoad: !!spectrum?.fastLoad,
      lastTapeFile: this._lastTapeFile,
      clockMultiplier: state.emulatorPanel?.clockMultiplier ?? 1,
      soundLevel: state.emulatorPanel?.soundLevel ?? 1.0,
      muted: state.emulatorPanel?.muted ?? false,
    };
  }

  /**
   * Override this method to set the machine-specific settings
   */
  async setMachineSpecificSettings(
    settings: Record<string, any>
  ): Promise<MachineCreationOptions | null> {
    if (settings.clockMultiplier) {
      dispatch(emuSetClockMultiplierAction(settings.clockMultiplier));
    }
    if (settings.soundLevel) {
      setSoundLevel(settings.soundLevel);
      setSoundLevelMenu(settings.muted, settings.soundLevel);
    }
    dispatch(spectrumFastLoadAction(!!settings.fastLoad));
    this._lastTapeFile = settings.lastTapeFile;
    if (settings.lastTapeFile) {
      try {
        const contents = fs.readFileSync(settings.lastTapeFile);
        if (checkTapeFile(new BinaryReader(contents))) {
          dispatch(spectrumTapeContentsAction(contents));
        }
      } catch {
        // --- This error is intentionally ignored
      }
    } else {
      dispatch(spectrumTapeContentsAction(new Uint8Array(0)));
    }
    return null;
  }

  /**
   * Get the list of machine features supported
   */
  getExtraMachineFeatures(): ExtraMachineFeatures[] {
    return ["UlaDebug", "Sound", "Tape"];
  }

  /**
   * Select a tape file to use with the ZX Spectrum
   */
  private async selectTapeFile(): Promise<void> {
    const window = emuWindow.window;
    const result = await dialog.showOpenDialog(window, {
      title: "Open tape file",
      filters: [
        { name: "Tape files", extensions: ["tzx", "tap"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });
    let tapeFile: string = "";
    if (!result.canceled) {
      try {
        tapeFile = result.filePaths[0];
        const contents = fs.readFileSync(tapeFile);
        if (checkTapeFile(new BinaryReader(contents))) {
          dispatch(spectrumTapeContentsAction(contents));
          this._lastTapeFile = tapeFile;
          await dialog.showMessageBox(window, {
            title: `Tape file loaded`,
            message: `Tape file ${tapeFile} successfully loaded.`,
            type: "info",
          });
        } else {
          throw new Error("Could not process the contenst of tape file.");
        }
      } catch (err) {
        // --- This error is intentionally ignored
        await dialog.showMessageBox(window, {
          title: `Error processing the tape file ${tapeFile}`,
          message: err.toString(),
          type: "error",
          detail:
            "Please check if you have the appropriate access rights to read the files contents " +
            "and the file is a valid .tap or .tzx file (note: 'dsk' format is not supported, yet).",
        });
      }
    }
  }
}

/**
 * Context provider for the ZX Spectrum 48 machine model
 */
export class ZxSpectrum48ContextProvider extends ZxSpectrumContextProviderBase {
  /**
   * Constructs the provider with the specified options
   * @param options
   */
  constructor(options?: Record<string, any>) {
    super(options);
  }

  /**
   * Gets the names of firmware files
   */
  readonly firmwareFiles: string[] = ["sp48.rom"];

  /**
   * The normal CPU frequency of the machine
   */
  getNormalCpuFrequency(): number {
    return 3_500_000;
  }

  /**
   * Context description for ZX Spectrum 48
   */
  getMachineContextDescription(): string {
    return `Screen: 256x192, ROM: sp48.rom (16KB), RAM: 48KB`;
  }
}

/**
 * Context provider for the ZX Spectrum 128 machine model
 */
export class ZxSpectrum128ContextProvider extends ZxSpectrumContextProviderBase {
  /**
   * Constructs the provider with the specified options
   * @param options
   */
  constructor(options?: Record<string, any>) {
    super(options);
  }

  /**
   * Gets the names of firmware files
   */
  readonly firmwareFiles: string[] = ["sp128-0.rom", "sp128-1.rom"];

  /**
   * The normal CPU frequency of the machine
   */
  getNormalCpuFrequency(): number {
    return 3_546_900;
  }

  /**
   * Context description for ZX Spectrum 48
   */
  getMachineContextDescription(): string {
    return `Screen: 256x192, ROM: sp128.rom (32KB), RAM: 128KB`;
  }
}

// ----------------------------------------------------------------------------
// Configuration we use to instantiate the ZX Spectrum +3E machine

let recentOptions: MachineCreationOptions & Sp3EConstructionOptions = {
  baseClockFrequency: 0,
  tactsInFrame: 0,
  floppyPresent: false,
  driveBPresent: false,
};
let recentFloppy = "floppy0";

/**
 * Context provider for the ZX Spectrum 128 machine model
 */
export class ZxSpectrumP3ContextProvider extends ZxSpectrumContextProviderBase {
  /**
   * Constructs the provider with the specified options
   * @param options
   */
  constructor(options?: Record<string, any>) {
    super(options);
  }

  /**
   * Gets the names of firmware files
   */
  readonly firmwareFiles: string[] = [
    "spP3e-0.rom",
    "spP3e-1.rom",
    "spP3e-2.rom",
    "spP3e-3.rom",
  ];

  /**
   * Items to add to the machine menu
   */
  provideMachineMenuItems(): MenuItemConstructorOptions[] | null {
    return [
      ...super.provideMachineMenuItems(),
      { type: "separator" },
      {
        id: DISK_MENU,
        label: "Floppy disks",
        type: "submenu",
        submenu: [
          {
            id: FLOPPY_MENU,
            label: "Floppy configuration",
            type: "submenu",
            submenu: [
              {
                id: NO_FLOPPY,
                label: "No floppy drive",
                type: "radio",
                click: async () =>
                  await this.setFloppy(NO_FLOPPY, false, false),
              },
              {
                id: ONE_FLOPPY,
                label: "One floppy drive",
                type: "radio",
                click: async () =>
                  await this.setFloppy(ONE_FLOPPY, true, false),
              },
              {
                id: TWO_FLOPPY,
                label: "Two floppy drives",
                type: "radio",
                click: async () => await this.setFloppy(TWO_FLOPPY, true, true),
              },
            ],
          },
          {
            id: CREATE_VIRTUAL_DISK,
            label: "Create virtual disk...",
            click: async () => {},
          },
          { type: "separator" },
          {
            id: INSERT_DISK_A,
            label: "Insert floppy into A:",
            click: async () => {},
          },
          {
            id: EJECT_DISK_A,
            label: "Eject A:",
            click: async () => {},
          },
          {
            id: INSERT_DISK_B,
            label: "Insert floppy into B:",
            click: async () => {},
          },
          {
            id: EJECT_DISK_B,
            label: "Eject B:",
            click: async () => {},
          },
        ],
      },
    ];
  }

  /**
   * When the application state changes, you can update the menus
   */
  updateMenuStatus(state: AppState): void {
    const menu = Menu.getApplicationMenu();
    const insertAMenu = menu.getMenuItemById(INSERT_DISK_A);
    if (insertAMenu) {
      insertAMenu.visible =
        !!state.spectrumSpecific?.diskAFile &&
        !state.spectrumSpecific?.diskBFile;
    }
    const ejectAMenu = menu.getMenuItemById(EJECT_DISK_A);
    if (ejectAMenu) {
      ejectAMenu.visible =
        !!state.spectrumSpecific?.diskAFile &&
        !!state.spectrumSpecific?.diskBFile;
    }
    const insertBMenu = menu.getMenuItemById(INSERT_DISK_B);
    if (insertBMenu) {
      insertBMenu.visible =
        !!state.spectrumSpecific?.diskBEnabled &&
        !state.spectrumSpecific?.diskBInserted;
    }
    const ejectBMenu = menu.getMenuItemById(EJECT_DISK_B);
    if (ejectBMenu) {
      ejectBMenu.visible =
        !!state.spectrumSpecific?.diskBEnabled &&
        !!state.spectrumSpecific?.diskBInserted;
    }

    // --- Select the current floppy type
    const floppyType = menu.getMenuItemById(`spP3e_${recentFloppy}`);
    if (floppyType) {
      floppyType.checked = true;
    }

    emuWindow.saveKliveProject();
  }

  /**
   * Override this method to get the machine-specific settings
   */
  getMachineSpecificSettings(): Record<string, any> {
    const state = getState();
    const spectrum = state.spectrumSpecific;
    return {
      fastLoad: !!spectrum?.fastLoad,
      lastTapeFile: this._lastTapeFile,
      clockMultiplier: state.emulatorPanel?.clockMultiplier ?? 1,
      soundLevel: state.emulatorPanel?.soundLevel ?? 1.0,
      muted: state.emulatorPanel?.muted ?? false,
      floppy: recentFloppy,
    };
  }

  /**
   * Override this method to set the machine-specific settings
   */
  async setMachineSpecificSettings(
    settings: Record<string, any>
  ): Promise<MachineCreationOptions | null> {
    await super.setMachineSpecificSettings(settings);
    if (settings.floppy) {
      switch (settings.floppy) {
        case NO_FLOPPY_LABEL:
          await this.setFloppy(NO_FLOPPY, false, false);
          break;
        case ONE_FLOPPY_LABEL:
          await this.setFloppy(ONE_FLOPPY, true, false);
          break;
        case TWO_FLOPPIES_LABEL:
          await this.setFloppy(TWO_FLOPPY, true, true);
          break;
      }
    }
    return recentOptions;
  }

  /**
   * The normal CPU frequency of the machine
   */
  getNormalCpuFrequency(): number {
    return 3_546_900;
  }

  /**
   * Context description for ZX Spectrum 48
   */
  getMachineContextDescription(): string {
    return `Screen: 256x192, ROM: spP3E.rom (64KB), RAM: 128KB`;
  }

  /**
   * Sets the Z88 LCD mode
   * @param menuId LCD menu id
   * @param label LCD label
   * @param scw LCD width
   * @param sch LCD height
   */
  private async setFloppy(
    menuId: string,
    floppyPresent: boolean,
    driveBPresent: boolean
  ): Promise<void> {
    recentFloppy = machineIdFromMenuId(menuId);
    recentOptions = { ...recentOptions, floppyPresent, driveBPresent };
    await this.requestMachine();
    emuWindow.saveKliveProject();
  }

  /**
   * Sets the Z88 with the specified LCD type
   * @param typeId Machine type with LCD size specification
   */
  private async requestMachine(): Promise<void> {
    const typeId = "spP3e";
    await emuWindow.requestMachineType(typeId, recentOptions);
  }
}
