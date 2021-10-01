import * as React from "react";
import { createSizedStyledPanel } from "../../common-ui/PanelStyles";
import styles from "styled-components";
import { CSSProperties, useEffect, useState } from "react";
import CommandIconButton from "../context-menu/CommandIconButton";
import { isCommandGroup, isKliveCommand, MenuItem } from "@shared/command/commands";
import { getContextMenuService } from "@abstractions/service-helpers";
import { Activity } from "@abstractions/activity";
import { commandStatusChanged } from "@abstractions/command-registry";

type Props = {
  activity: Activity;
};

export default function SideBarPanelHeader({ activity }: Props) {
  return (
    <Root>
      <Caption>
        <Text>{activity.title.toUpperCase()}</Text>
        <CommandBar commands={activity.commands} />
      </Caption>
    </Root>
  );
}

const Caption = createSizedStyledPanel({
  splitsVertical: false,
  others: {
    "align-items": "center",
    "padding-left": "4px",
  },
});

// --- Component helper tags
const Root = createSizedStyledPanel({
  height: 35,
  fitToClient: false,
  background: "transparent",
});

const Text = styles.span`
  color: var(--sidebar-header-color);
  font-size: 0.8em;
  font-weight: 400;
  padding-left: 20px;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;`;

type CommandBarProps = {
  commands?: MenuItem[];
};

function CommandBar({ commands }: CommandBarProps) {
  const [refreshCount, setRefreshCount] = useState(0);

  // --- Take care to update command status
  const onCommandStatusChanged = () => {
    setRefreshCount(refreshCount + 1);
  }

  // --- Mount/unmount component
  useEffect(() => {
    commandStatusChanged.on(onCommandStatusChanged);
    return () => {
      commandStatusChanged.off(onCommandStatusChanged);
    }
  });

  const style: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexGrow: 0,
    flexShrink: 0,
    height: "100%",
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "6px",
    paddingRight: "6px",
    background: "var(--commandbar-background-color)",
  };

  const buttons: JSX.Element[] = [];
  if (commands) {
    commands.forEach((cmd, index) => {
      if (typeof cmd === "string") {
        return;
      } else if (isCommandGroup(cmd)) {
        buttons.push(
          <CommandIconButton
            key={index}
            doNotPropagate={true}
            iconName="ellipsis"
            title={cmd.text}
            enabled={cmd.enabled}
            clicked={async (e: React.MouseEvent) => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              await getContextMenuService().openMenu(
                cmd.items,
                rect.y + 20,
                rect.x,
                e.target as HTMLElement
              );
            }}
          />
        );
      } else if (isKliveCommand(cmd)) {
        buttons.push(
          <CommandIconButton
            key={index}
            doNotPropagate={true}
            commandId={cmd.commandId}
          />
        );
      } else {
        buttons.push(
          <CommandIconButton
            key={index}
            doNotPropagate={true}
            iconName={cmd.iconName ?? "question"}
            enabled={cmd.enabled}
            title={cmd.text}
            clicked={cmd.execute}
          />
        );
      }
    });
  }

  return <div style={style}>{buttons}</div>;
}
