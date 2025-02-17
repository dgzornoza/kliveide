import * as React from "react";
import { CSSProperties } from "react";

import { dispatch, getState, getStore } from "@core/service-registry";
import { Z80CpuState } from "@modules/cpu-z80/z80-cpu";
import { Z80Disassembler } from "@modules/cpu-z80/z80-disassembler";
import {
  DisassemblyItem,
  DisassemblyOutput,
  MemorySection,
} from "@modules/cpu-z80/disassembly-helper";
import { Icon } from "@components/Icon";
import { VirtualizedSideBarPanelBase } from "@ide/VirtualizedSideBarPanelBase";
import { virtualMachineToolsService } from "@modules-core/virtual-machine-tool";
import { getEngineProxyService } from "@services/engine-proxy";
import { BinaryBreakpoint } from "@abstractions/code-runner-service";
import {
  addBreakpointAction,
  removeBreakpointAction,
} from "@core/state/debugger-reducer";
import {
  CUSTOM_Z80_DISASSEMBLY_TOOL,
  ICustomDisassembler,
} from "@modules/cpu-z80/custom-disassembly";
import { SideBarProps, SideBarState } from "@components/SideBarPanelBase";
import { SideBarPanelDescriptorBase } from "@services/SideBarService";

const TITLE = "Z80 Disassembly";
const DISASS_LENGTH = 1024;

type State = {
  output?: DisassemblyOutput;
  isRunning: boolean;
};

/**
 * Z80 disassembly panel
 */
export default class Z80DisassemblyPanel extends VirtualizedSideBarPanelBase<
  SideBarProps<{}>,
  SideBarState<State>
> {
  private _breakpointMap = new Map<number, BinaryBreakpoint>();
  private _refreshBreakpoints: () => void;

  width = "fit-content";
  noMacineLine2 = "to see the disassembly";

  /**
   * Defines the message to show, if there are no items to render
   */
  get noItemsMessage(): string {
    return "Pause the machine to see the disassembly.";
  }

  /**
   * Initialize with the current breakpoints
   * @param props
   */
  constructor(props: SideBarProps<{}>) {
    super(props);
    this._refreshBreakpoints = () => this.refreshBreakpoints();
    this.state = {
      isRunning: false,
      selectedIndex: -1
    };
  }

  // --- Listen to run events
  async componentDidMount(): Promise<void> {
    super.componentDidMount();
    const store = getStore();
    store.breakpointsChanged.on(this._refreshBreakpoints);
    store.resolvedBreakpointsChanged.on(this._refreshBreakpoints);
    await new Promise((r) => setTimeout(r, 100));
    this.refreshBreakpoints();
  }

  // --- Stop listening to run events
  componentWillUnmount(): void {
    const store = getStore();
    store.breakpointsChanged.off(this._refreshBreakpoints);
    store.resolvedBreakpointsChanged.off(this._refreshBreakpoints);
    super.componentWillUnmount();
  }

  /**
   * Override to get the number of items
   */
  getItemsCount(): number {
    return this.state.output && !this.state.isRunning
      ? this.state.output.outputItems.length
      : 0;
  }

  /**
   * Renders an item of the list
   * @param index Index of the item
   * @param style Style to provide
   * @param item Item data
   */
  renderItem(index: number, style: CSSProperties) {
    const item = this.state.output.outputItems[index];
    const itemStyle: CSSProperties = {
      ...style,
      display: "flex",
      flexDirection: "row",
      flexShrink: 0,
      flexGrow: 0,
      alignItems: "center",
      fontFamily: "var(--console-font)",
      width: "100%",
      background:
        index === this.state.selectedIndex
          ? this.state.focused
            ? "var(--selected-background-color)"
            : "var(--list-selected-background-color)"
          : undefined,
      border:
        index === this.state.selectedIndex
          ? this.state.focused
            ? "1px solid var(--selected-border-color)"
            : "1px solid transparent"
          : "1px solid transparent",
      whiteSpace: "nowrap",
    };
    const hasBreakpoint = this._breakpointMap.has(item.address);
    const addressLabel =
      item?.address != undefined
        ? `${item.address.toString(16).padStart(4, "0").toUpperCase()}`
        : "";
    return (
      <div
        className="listlike"
        key={index}
        style={{ ...itemStyle }}
        onClick={() => {
          this.setState({ selectedIndex: index });
          this.listApi.forceRefresh();
        }}
      >
        {!item?.prefixComment && (
          <>
            <div
              style={{
                marginLeft: 4,
                width: 30,
                color: item?.hasLabel
                  ? "var(--console-ansi-bright-magenta)"
                  : "var(--console-ansi-bright-blue)",
                fontWeight: item?.hasLabel ? 600 : 100,
                flexShrink: 0,
                flexGrow: 0,
              }}
            >
              {addressLabel}
            </div>
            <div
              title={
                this.executionState === 3
                  ? hasBreakpoint
                    ? `Click to remove breakpoint at $${addressLabel}`
                    : `Click to add a new breakpoint at $${addressLabel}`
                  : ""
              }
              style={{
                width: 20,
                height: 16,
                display: "flex",
                flexShrink: 0,
                flexGrow: 0,
                alignItems: "center",
                cursor: this.executionState === 3 ? "pointer" : "default",
              }}
              onClick={() => {
                if (this.executionState === 3) {
                  const bp: BinaryBreakpoint = {
                    type: "binary",
                    location: item.address,
                  };
                  if (hasBreakpoint) {
                    dispatch(removeBreakpointAction(bp));
                  } else {
                    dispatch(addBreakpointAction(bp));
                  }
                }
              }}
            >
              {hasBreakpoint && (
                <Icon
                  iconName="circle-filled"
                  width={16}
                  height={16}
                  fill="--debug-bp-color"
                  style={{ marginLeft: 4 }}
                />
              )}
            </div>
            {index === 0 ? (
              <Icon
                iconName={hasBreakpoint ? "debug-current" : "chevron-right"}
                fill={
                  hasBreakpoint
                    ? "--console-ansi-yellow"
                    : "--console-ansi-green"
                }
                style={{ marginRight: 4, flexShrink: 0, flexGrow: 0 }}
              />
            ) : (
              <div style={{ width: 18, flexShrink: 0, flexGrow: 0 }} />
            )}
            <div style={{ width: 100, flexShrink: 0, flexGrow: 0 }}>
              {item.opCodes}
            </div>
            <div
              style={{
                width: "auto",
                color: "var(--console-ansi-bright-cyan)",
                fontWeight: 600,
              }}
            >
              {item.instruction}
            </div>
          </>
        )}
        {item?.prefixComment && (
          <div style={{ marginLeft: 4, color: "var(--console-ansi-green)" }}>
            -- End of disassembly
          </div>
        )}
      </div>
    );
  }

  /**
   * Refresh the disassembly screen
   */
  protected async onRunEvent(): Promise<void> {
    if (this.executionState === 3 || this.executionState === 5) {
      this.setState({ isRunning: false });
    } else if (this.executionState === 1) {
      await new Promise((r) => setTimeout(r, 50));
      this.setState({ isRunning: this.executionState === 1 });
    }
    const engineProxy = getEngineProxyService();
    const cpuState = (await engineProxy.getCachedCpuState()) as Z80CpuState;
    const memory = await engineProxy.getCachedMemoryContents();
    const pcValue = cpuState._pc;

    // --- Create the disassebler
    const disassembler = new Z80Disassembler(
      [new MemorySection(pcValue, pcValue + DISASS_LENGTH)],
      memory
    );

    // --- Set up custom disassembler, if available
    const customZ80Disassembler = virtualMachineToolsService.getTool(
      getState().machineType,
      CUSTOM_Z80_DISASSEMBLY_TOOL
    ) as unknown as ICustomDisassembler;
    if (customZ80Disassembler) {
      disassembler.setCustomDisassembler(customZ80Disassembler);
    }

    // --- Now, create the disassembly
    const disassemblyOutput = await disassembler.disassemble(
      pcValue,
      pcValue + DISASS_LENGTH
    );
    disassemblyOutput.addItem({
      prefixComment: "Placeholder",
    } as DisassemblyItem);
    this.setState({
      output: disassemblyOutput,
    });
    this.listApi?.forceRefresh(0);
  }

  /**
   * Respond to breakpoint changes
   * @param breakpoints
   */
  refreshBreakpoints(): void {
    // --- Get the current binary breakpoints
    const state = getState();
    const breakpoints = (state?.debugger?.breakpoints ?? []).filter(
      (bp) => bp.location != undefined
    ) as BinaryBreakpoint[];
    this._breakpointMap.clear();

    // --- Store them in a map
    breakpoints.forEach((bp) => this._breakpointMap.set(bp.location, bp));
    this.listApi?.forceRefresh(0);
  }
}

/**
 * Descriptor for the sample side bar panel
 */
export class Z80DisassemblyPanelDescriptor extends SideBarPanelDescriptorBase {
  /**
   * Panel title
   */
  get title(): string {
    return TITLE;
  }

  /**
   * Creates a node that represents the contents of a side bar panel
   */
  createContentElement(): React.ReactNode {
    return <Z80DisassemblyPanel descriptor={this} />;
  }
}
