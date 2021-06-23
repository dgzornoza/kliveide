import * as React from "react";
import {
  PaneDirective,
  PanesDirective,
  SplitterComponent,
} from "@syncfusion/ej2-react-layouts";

import { createSizedStyledPanel } from "../common/PanelStyles";
import IdeDocumentsFrame from "./document-area/IdeDocumentsFrame";
import OutputFrame from "./output-area/OutputFrame";

/**
 * Represents the main canvas of the IDE
 */
export default function IdeDesk() {
  return (
    <Root>
      <SplitterComponent orientation="Vertical" separatorSize={2}>
        <PanesDirective>
          <PaneDirective
            cssClass="splitter-panel"
            content={() => <IdeDocumentsFrame />}
            size="90%"
            min="80px"
            max="95%"
          />
          <PaneDirective
            cssClass="splitter-panel"
            content={() => <OutputFrame />}
            size="10%"
            min="5%"
            max="95%"
          />
        </PanesDirective>
      </SplitterComponent>
    </Root>
  );
}

// --- Helper component tags
const Root = createSizedStyledPanel({
  fitToClient: true,
  background: "var(--emulator-background-color)",
});
