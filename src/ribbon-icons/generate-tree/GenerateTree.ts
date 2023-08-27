import { Notice } from "obsidian";
import type { RibbonIcon, RibbonIconIcon, RibbonIconTitle } from "../ribbon-icons.type";
import FileTreeGenerator from "#/FileTreeGenerator";
import { GenerateTree as GenerateTreeModal } from "#/modals/generate-tree";

export class GenerateTree implements RibbonIcon {

  public readonly icon: RibbonIconIcon = "folder-tree";

  public readonly title: RibbonIconTitle = "Generate file tree";

  public execute = (): void => {
    const activeEditor = FileTreeGenerator.getInstance().getActiveEditor();

    if (!activeEditor) {
      new Notice("❌ Can only be used during editing");
      return;
    }

    const viewType = activeEditor.currentMode.type;

    if (viewType !== "source") {
      new Notice("❌ Can only be used during editing");
      return;
    }

    const editor = activeEditor.editor;

    if (!editor) {
      new Notice("❌ Can only be used during editing");
      return;
    }

    new GenerateTreeModal(FileTreeGenerator.getInstance().app, editor).open();
  };

}