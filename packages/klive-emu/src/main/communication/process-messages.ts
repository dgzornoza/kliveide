import * as fs from "fs";
import { dialog } from "electron";
import { getRegisteredMachines } from "../../extensibility/main/machine-registry";
import {
  CreateFileResponse,
  CreateFolderResponse,
  CreateKliveProjectResponse,
  DefaultResponse,
  EmuOpenFileDialogResponse,
  FileExistsResponse,
  GetFolderContentsResponse,
  GetFolderDialogResponse,
  GetRegisteredMachinesResponse,
  RequestMessage,
  ResponseMessage,
} from "../../shared/messaging/message-types";
import { emuForwarder, emuWindow } from "../app/app-menu";
import {
  createKliveProject,
  openProjectFolder,
  selectFolder,
} from "../project/project-utils";
import { getFolderContents } from "../utils/file-utils";

/**
 * Processes the requests arriving from the emulator process
 * @param message to process
 * @returns Message response
 */
export async function processEmulatorRequest(
  message: RequestMessage
): Promise<ResponseMessage> {
  switch (message.type) {
    case "EmuOpenFileDialog":
      const result = await dialog.showOpenDialog(emuWindow.window, {
        title: message.title,
        filters: message.filters,
      });
      return <EmuOpenFileDialogResponse>{
        type: "EmuOpenFileDialogResponse",
        filename: result.canceled ? undefined : result.filePaths[0],
      };

    case "ManageZ88Cards":
      const manageCardsStub = (emuWindow.machineContextProvider as any)?.[
        "insertOrRemoveCards"
      ].bind(emuWindow.machineContextProvider);
      if (manageCardsStub) {
        await manageCardsStub();
      }
      return <DefaultResponse>{ type: "Ack" };

    default:
      return <DefaultResponse>{ type: "Ack" };
  }
}

/**
 * Processes the requests arriving from the IDE process
 * @param message to process
 * @returns Message response
 */
export async function processIdeRequest(
  message: RequestMessage
): Promise<ResponseMessage> {
  switch (message.type) {
    case "GetRegisteredMachines":
      return <GetRegisteredMachinesResponse>{
        type: "GetRegisteredMachinesResponse",
        machines: getRegisteredMachines(),
      };

    case "CreateKliveProject":
      const operation = await createKliveProject(
        message.machineType,
        message.rootFolder,
        message.projectFolder
      );
      return <CreateKliveProjectResponse>{
        type: "CreateKliveProjectResponse",
        error: operation.error,
        targetFolder: operation.targetFolder,
      };

    case "OpenProjectFolder":
      await openProjectFolder();
      return <DefaultResponse>{
        type: "Ack",
      };

    case "GetFolderDialog":
      const folder = await selectFolder(message.title, message.root);
      return <GetFolderDialogResponse>{
        type: "GetFolderDialogResponse",
        filename: folder,
      };

    case "FileExists":
      return <FileExistsResponse>{
        type: "FileExistsResponse",
        exists: fs.existsSync(message.name),
      };

    case "GetFolderContents":
      return <GetFolderContentsResponse>{
        type: "GetFolderContentsResponse",
        contents: await getFolderContents(message.name),
      };

    case "CreateFolder":
      let folderError: string | undefined;
      if (fs.existsSync(message.name)) {
        folderError = `Folder ${message.name} already exists`;
      } else {
        try {
          fs.mkdirSync(message.name, { recursive: true });
        } catch (err) {
          folderError = `Cannot create folder: ${err}`;
        }
      }
      if (folderError) {
        dialog.showErrorBox("Error creating folder", folderError);
      }
      return <CreateFolderResponse>{
        type: "CreateFolderResponse",
        error: folderError,
      };

    case "CreateFile":
      let fileError: string | undefined;
      if (fs.existsSync(message.name)) {
        fileError = `File ${message.name} already exists`;
      } else {
        try {
          fs.writeFileSync(message.name, "");
        } catch (err) {
          fileError = `Cannot create file: ${err}`;
        }
      }
      if (fileError) {
        dialog.showErrorBox("Error creating file", fileError);
      }
      return <CreateFileResponse>{
        type: "CreateFileResponse",
        error: fileError,
      };

    default:
      // --- If the main does not recofnize a request, it forwards it to Emu
      return await emuForwarder.sendMessage(message);
  }
}
