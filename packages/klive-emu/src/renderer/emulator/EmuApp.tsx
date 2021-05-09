import * as React from "react";
import { StateAwareObject } from "../../shared/state/StateAwareObject";
import { AppState, EmuViewOptions } from "../../shared/state/AppState";
import { AppStateContext } from "../common/AppStateContext";
import { emuStore } from "./emuStore";
import { themeService } from "../themes/theme-service";
import { IThemeProperties } from "../themes/IThemeProperties";
import { connect } from "react-redux";
import Toolbar from "./Toolbar";
import MainPanel from "./MainPanel";
import EmuStatusbar from "./EmuStatusbar";
import { emuLoadUiAction } from "../../shared/state/emu-loaded-reducer";
import "./emu-message-processor";
import { AudioRenderer } from "../machines/AudioRenderer";
import { ZxSpectrumStateManager } from "../machines/spectrum/ZxSpectrumStateManager";
import { CambridgeZ88StateManager } from "../machines/cz88/CambridgeZ88BaseStateManager";
import { setEngineDependencies } from "../machines/vm-engine-dependencies";

interface Props {
  emuViewOptions: EmuViewOptions;
}

interface State {
  themeStyle: Record<string, string>;
  themeClass: string;
}

// --- Set up the virual machine engine service with the 
setEngineDependencies({
  waModuleLoader: async (moduleFile: string) => {
    const response = await fetch("./wasm/" + moduleFile);
    return await response.arrayBuffer();
  },
  sampleRateGetter: () => new AudioContext().sampleRate,
  audioRendererFactory: (s: number) => new AudioRenderer(s),
  spectrumStateManager: new ZxSpectrumStateManager(),
  cz88StateManager: new CambridgeZ88StateManager(),
})

/**
 * Represents the emulator app's root component
 */
class EmuApp extends React.Component<Props, State> {
  // --- Keep track of theme changes
  private _themeAware: StateAwareObject<string>;

  // --- Use the application state as a context
  static contextType = AppStateContext;

  constructor(props: any) {
    super(props);
    this.state = {
      themeStyle: {},
      themeClass: "",
    };
  }

  componentDidMount() {
    // --- The emulator window is ready to set up the virtual machine
    emuStore.dispatch(emuLoadUiAction());

    // --- Handle theme updates
    this.updateThemeState();
    this._themeAware = new StateAwareObject(emuStore, "theme");
    this._themeAware.stateChanged.on((theme) => {
      themeService.setTheme(theme);
      this.updateThemeState();
    });
  }

  componentWillUnmount() {
    this._themeAware.dispose();
  }

  render() {
    return (
      <div style={this.state.themeStyle} className={this.state.themeClass}>
        {this.props.emuViewOptions.showToolbar && <Toolbar></Toolbar>}
        <MainPanel />
        {this.props.emuViewOptions.showStatusBar && <EmuStatusbar></EmuStatusbar>}
      </div>
    );
  }

  private updateThemeState(): void {
    const theme = themeService.getActiveTheme();
    if (!theme) {
      return;
    }
    let themeStyle: Record<string, string> = {};
    for (const key in theme.properties) {
      themeStyle[key] = theme.properties[key as keyof IThemeProperties];
    }
    this.setState({
      themeStyle,
      themeClass: `app-container ${theme.name}-theme`,
    });
  }
}

export default connect((state: AppState) => {
  return { emuViewOptions: state.emuViewOptions };
}, null)(EmuApp);
