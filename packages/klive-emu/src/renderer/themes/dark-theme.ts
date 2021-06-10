import { ITheme } from "./theme-core";

/**
 * This constant value defins the propertief of the 'dark' theme.
 */
export const darkTheme: ITheme = {
  name: "dark",
  properties: {
    "--shell-canvas-background-color": "#1E1E1E",
    "--panel-separator-border": "#8080805a",

    "--toolbar-active-background-color": "#252525",
    "--toolbar-inactive-background-color": "#383838",
    "--toolbar-button-fill": "white",
    "--toolbar-button-disabled-fill": "#585858",
    "--toolbar-separator": "2px solid #686868",
    "--toolbar-selected-border-color": "#007acc",

    "--statusbar-background-color": "#007acc",
    "--statusbar-foreground-color": "white",

    "--icon-default-size": "14",

    "--emulator-background-color": "#808080",
    "--keyboard-background-color": "#202020",

    "--key-background-color": "#808080",
    "--key-main-color": "white",
    "--key-keyboard-color": "white",
    "--key-symbol-color": "#c00000",
    "--key-above-color": "#00a000",
    "--key-below-color": "#d02000",
    "--key-highlight-color": "#0048c0",

     "--key-cz88-background-color": "#404040",
     "--key-cz88-stroke-color": "#a0a0a0",
     "--key-cz88-main-color": "white",
     "--key-cz88-highlight-color": "#0088e0",

     "--activity-bar-background-color": "#333333",
     "--activity-icon-color": "#ffffff66",
     "--activity-current-icon-color": "#ffffff",
     "--activity-current-background-color": "#505050",

     "--sidebar-background-color": "#252526",
     "--sidebar-header-color": "white",

     "--splitter-hover-color": "#007acc",
    },
};
