import * as React from "react";
import {
  IModalDialogDescriptor,
  modalDialogService,
} from "../../common-ui/modal-service";
import { useState } from "react";
import { CSSProperties } from "styled-components";
import { ideStore } from "../ideStore";
import { NewFileData } from "../../../shared/messaging/dto";
import { Store } from "redux";
import {
  ErrorLabel,
  Field,
  FieldRow,
  HintLabel,
  Label,
} from "../../common-ui/FormElements";
import { ideToEmuMessenger } from "../IdeToEmuMessenger";
import { FileExistsResponse } from "../../../shared/messaging/message-types";

export const NEW_FOLDER_DIALOG_ID = "NewFolderDialog";

const SPECIFY_MSG = "(Specify!)";
const EXISTS_MSG = "(Folder already exists)";

class NewFolderDialogDescriptor implements IModalDialogDescriptor {
  private _result: NewFileData;

  title = "Add New Folder";
  width = 480;
  height = "auto";

  button2Text = "Cancel";
  button2Clicked = () => true;

  button3Text = "Ok";
  button3Clicked = () => {
    const folder = this._result as NewFileData;
    if (!folder.error) {
      modalDialogService.hide(ideStore as Store, this._result);
    }
  };

  primaryButtonIndex = 3;

  /**
   * Creates a node that represents the contents of a side bar panel
   */
  createContentElement(args?: NewFileData): React.ReactNode {
    this._result = { ...args };
    return <NewFolderDialog newFolderData={this._result} />;
  }
}

type Props = {
  newFolderData: NewFileData;
};

const NewFolderDialog: React.FC<Props> = ({ newFolderData }: Props) => {
  const [folderName, setFolderName] = useState(newFolderData.name);
  const [nameError, setNameError] = useState(SPECIFY_MSG);
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  const onNameChanged = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(ev.target.value);
    newFolderData.name = ev.target.value;
    newFolderData.error = false;
    if (!newFolderData.name) {
      setNameError(SPECIFY_MSG);
      newFolderData.error = true;
    } else {
      const response =
        await ideToEmuMessenger.sendMessage<FileExistsResponse>({
          type: "FileExists",
          name: `${newFolderData.root}/${newFolderData.name}`,
        });
      newFolderData.error = response.exists;
      setNameError(response.exists ? EXISTS_MSG : "");
    }
  }

  return (
    <div style={containerStyle}>
      <FieldRow>
        <Label>Root folder:</Label>
        <HintLabel>{newFolderData.root}</HintLabel>
      </FieldRow>
      <FieldRow>
        <Label>New folder name</Label>
        <ErrorLabel>{nameError}</ErrorLabel>
      </FieldRow>
      <Field>
        <input
          type="text"
          style={{ width: "100%" }}
          spellCheck={false}
          value={folderName}
          onChange={async (ev) => await onNameChanged(ev)}
        />
      </Field>
    </div>
  );
};

/**
 * The singleton instance of the dialog
 */
export const newFolderDialog = new NewFolderDialogDescriptor();
