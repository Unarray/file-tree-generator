import type { Command, Editor } from "obsidian";
import { GenerateTree as GenerateTreeModal } from "#/modals";
import FileTreeGenerator from "#/FileTreeGenerator";

export class GenerateTree implements Command {

  public readonly id = "generate-tree";

  public readonly name = "generate a file tree";

  public editorCallback = (editor: Editor): void => {
    new GenerateTreeModal(FileTreeGenerator.getInstance().app, editor).open();
  };

}