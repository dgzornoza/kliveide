/**
 * Available action types
 */
export interface ActionTypes {
  // --- Aliased action
  ALIASED: null;

  // --- App focus actions
  APP_GOT_FOCUS: null;
  APP_LOST_FOCUS: null;

  // --- Emulator panel actions
  EMULATOR_SET_SIZE: null;
  EMULATOR_INITIALIZED: null;
  EMULATOR_SET_EXEC_STATE: null;
  EMULATOR_SET_TAPE_CONTENTS: null;
  EMULATOR_LOAD_TAPE: null;
  EMULATOR_SHOW_KEYBOARD: null;
  EMULATOR_HIDE_KEYBOARD: null;
  EMULATOR_TOGGLE_KEYBOARD: null;
  EMULATOR_SHOW_SHADOW_SCREEN: null;
  EMULATOR_HIDE_SHADOW_SCREEN: null;
  EMULATOR_TOGGLE_SHADOW_SCREEN: null;
  EMULATOR_SHOW_BEAM_POSITION: null;
  EMULATOR_HIDE_BEAM_POSITION: null;
  EMULATOR_TOGGLE_BEAM_POSITION: null;
  EMULATOR_ENABLE_FAST_LOAD: null;
  EMULATOR_DISABLE_FAST_LOAD: null;
  EMULATOR_TOGGLE_FAST_LOAD: null;
  EMULATOR_SET_FRAME_ID: null;
  EMULATOR_MUTE: null;
  EMULATOR_UNMUTE: null;
  EMULATOR_SET_DEBUG: null;
  EMULATOR_SET_SAVED_DATA: null;
  EMULATOR_REQUEST_TYPE: null;
  EMULATOR_SETUP_TYPE: null;
  EMULATOR_SELECT_ROM: null;
  EMULATOR_SELECT_BANK: null;
  EMULATOR_LOAD_MODE: null;
  EMULATOR_SET_MESSAGE: null;
  EMULATOR_SET_SOUND_LEVEL: null;
  EMULATOR_SHOW_STATUSBAR: null;
  EMULATOR_HIDE_STATUSBAR: null;
  EMULATOR_SET_INTERNAL_STATE: null;
  EMULATOR_SET_CLOCK_MULTIPLIER: null;

  // --- Machine specific commands
  MACHINE_COMMAND: null;
  
  // --- VM information actions
  VM_SET_REGISTERS: null;

  // --- IDE configuration actions
  IDE_CONFIG_SET: null;

  // --- IDE connection actions
  IDE_CONNECTS: null;
  IDE_DISCONNECTS: null;

  // --- Main window state actions
  MAXIMIZE_APP_WINDOW: null;
  MINIMIZE_APP_WINDOW: null;
  RESTORE_APP_WINDOW: null;
}
