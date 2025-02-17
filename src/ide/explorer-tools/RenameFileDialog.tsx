import * as React from "react";
import { useRef, useState, CSSProperties } from "react";

import { getModalDialogService } from "@core/service-registry";
import { IModalDialogDescriptor } from "@abstractions/modal-dialog-service";
import {
  ErrorLabel,
  Field,
  FieldRow,
  HintLabel,
  Label,
} from "@components/FormElements";
import { FileExistsResponse } from "@core/messaging/message-types";
import { sendFromIdeToEmu } from "@core/messaging/message-sending";
import { NewFileData } from "./NewFileData";

export const RENAME_FILE_DIALOG_ID = "RenameFileDialog";

const SPECIFY_MSG = "(Specify!)";
const EXISTS_MSG = "(File already exists)";

class RenameFileDialogDescriptor implements IModalDialogDescriptor {
  private _result: NewFileData;

  title = "Rename File";
  width = 480;
  height = "auto";

  button2Text = "Cancel";
  button2Clicked = () => true;

  button3Text = "Ok";
  button3Clicked = () => {
    const file = this._result as NewFileData;
    if (!file.error) {
      getModalDialogService().hide(this._result);
    }
  };

  primaryButtonIndex = 3;

  /**
   * Creates a node that represents the contents of a side bar panel
   */
  createContentElement(args?: NewFileData): React.ReactNode {
    this._result = { ...args };
    return <RenameFileDialog fileData={this._result} />;
  }
}

type Props = {
  fileData: NewFileData;
};

const RenameFileDialog: React.VFC<Props> = ({ fileData }) => {
  const [filename, setFilename] = useState(fileData.name);
  const [nameError, setNameError] = useState(EXISTS_MSG);
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };
  const oldName = useRef(`${fileData.root}/${fileData.name}`);

  const onNameChanged = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFilename(ev.target.value);
    fileData.name = ev.target.value;
    fileData.error = false;
    if (!fileData.name) {
      setNameError(SPECIFY_MSG);
      fileData.error = true;
    } else {
      const response = await sendFromIdeToEmu<FileExistsResponse>({
        type: "FileExists",
        name: `${fileData.root}/${fileData.name}`,
      });
      fileData.error = response.exists;
      setNameError(response.exists ? EXISTS_MSG : "");
    }
  };

  return (
    <div style={containerStyle}>
      <FieldRow>
        <Label>Current name:</Label>
        <HintLabel>{oldName.current}</HintLabel>
      </FieldRow>
      <FieldRow>
        <Label>New file name</Label>
        <ErrorLabel>{nameError}</ErrorLabel>
      </FieldRow>
      <Field>
        <input
          type="text"
          style={{ width: "100%" }}
          spellCheck={false}
          value={filename}
          onChange={async (ev) => await onNameChanged(ev)}
        />
      </Field>
    </div>
  );
};

/**
 * The singleton instance of the dialog
 */
export const renameFileDialog = new RenameFileDialogDescriptor();
