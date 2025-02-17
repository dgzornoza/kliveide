import * as path from "path";
import { promises as fs } from "fs";
import { __WIN32__ } from "./electron-utils";
import { DirectoryContent } from "@state/AppState";
import { mainProcLogger } from "./MainProcLogger";

/**
 * Gets the contents of the specified folder
 * @param folder Folder to query
 * @returns
 */
export async function getFolderContents(
  folder: string
): Promise<DirectoryContent> {
  // --- Contents of folders already queried
  const foldersRead = new Map<string, DirectoryContent>();
  const root = await readFolders(folder);
  root.name = folder;
  return root;

  // --- Carries out reading the folder contents
  async function readFolders(
    name: string,
    depth = 0
  ): Promise<DirectoryContent> {
    const cached = foldersRead.get(name);
    if (cached) {
      return { ...cached };
    }

    const result: DirectoryContent = {
      name: path.basename(name),
      folders: [],
      files: [],
    };

    // --- Read folders
    try {
      const entries = await fs.readdir(name, { withFileTypes: true });
      for (var entry of entries) {
        if (entry.isDirectory()) {
          result.folders.push({
            name: entry.name,
            folders: [],
            files: [],
          });
        } else {
          result.files.push(entry.name);
        }
      }
    } catch (err) {
      mainProcLogger.logError(`Cannot read the contents of ${name}`, err)
    }

    // --- Now, recursively read folders
    for (var subfolder of result.folders) {
      const subcontents = await readFolders(
        path.join(name, subfolder.name),
        depth + 1
      );
      subfolder.folders = subcontents.folders;
      subfolder.files = subcontents.files;
    }
    return result;
  }
}

