import type { Command, Editor } from "obsidian";
import { dialog } from "@electron/remote";
import { getFiles } from "#/utils/path";
import { explorerEntityToCallout, filesToExplorerEntity } from "#/utils/parser";
import { beginningString } from "#/utils/regex";
import { sep as separator } from "path";

export class GenerateTree implements Command {

  public readonly id = "generate-tree";

  public readonly name = "generate a file tree";

  public editorCallback = async(editor: Editor): Promise<void> => {
    const dialogResponse = await dialog.showOpenDialog({
      properties: ["openDirectory"]
    });

    if (dialogResponse.canceled) return;

    const selectedPath = dialogResponse.filePaths[0];
    const removePath = selectedPath.substring(0, selectedPath.lastIndexOf(separator) + separator.length);
    const regex = beginningString(removePath);
    const files = (await getFiles(selectedPath)).map(file => file.replace(regex, ""));
    const structure = filesToExplorerEntity(files);
    const callouts = explorerEntityToCallout(structure);
    const cursorLine = editor.getCursor("head").line;

    editor.setLine(
      cursorLine,
      `${editor.getLine(cursorLine)}\n${callouts}`
    );
  };

}