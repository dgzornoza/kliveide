import * as React from "react";
import { CSSProperties, useRef, useState } from "react";

import {
  getContextMenuService,
  getToolAreaService,
} from "@core/service-registry";

import { IToolPanel } from "@abstractions/tool-area-service";
import { MenuItem } from "@abstractions/command-definitions";

type Props = {
  title: string;
  active: boolean;
  index: number;
  isLast: boolean;
  tool: IToolPanel;
  clicked?: () => void;
}

/**
 * Represents the statusbar of the emulator
 */
export const ToolTab: React.VFC<Props> = ({
  title,
  active,
  index,
  isLast,
  tool,
  clicked,
}) => {
  const [pointed, setPointed] = useState(false);
  const hostElement = useRef<HTMLDivElement>();

  const style: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexGrow: 0,
    flexShrink: 0,
    height: "100%",
    background: "var(--document-tab-active-background-color)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "16px",
    marginRight: "16px",
    cursor: "pointer",
    fontSize: "0.8em",
    color:
      active || pointed
        ? "var(--document-tab-active-color)"
        : "var(--document-tab-color)",
    borderBottom: `1px solid ${
      active ? "var(--document-tab-active-color)" : "transparent"
    }`,
  };

  // --- Create menu items
  const toolAreaService = getToolAreaService();
  const menuItems: MenuItem[] = [
    {
      id: "moveLeft",
      text: "Move Panel Left",
      enabled: index > 0,
      execute: () => {
        toolAreaService.moveLeft(tool);
      },
    },
    {
      id: "moveRight",
      text: "Move Panel Right",
      enabled: !isLast,
      execute: () => {
        toolAreaService.moveRight(tool);
      },
    },
  ];

  return (
    <div
      ref={hostElement}
      style={style}
      onMouseDown={async (e: React.MouseEvent) => {
        if (e.button === 0) {
          clicked?.();
        } else if (e.button === 2) {
          await getContextMenuService().openMenu(
            menuItems,
            e.clientY,
            e.clientX,
            hostElement.current
          );
        }
      }}
      onMouseEnter={() => setPointed(true)}
      onMouseLeave={() => setPointed(false)}
    >
      <span>{title.toUpperCase()}</span>
    </div>
  );
}
