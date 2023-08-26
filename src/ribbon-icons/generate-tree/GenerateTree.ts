import { Notice } from "obsidian";
import type { RibbonIcon, RibbonIconIcon, RibbonIconTitle } from "../ribbon-icons.type";
import FileTreeGenerator from "#/FileTreeGenerator";
import { GenerateTree as GenerateTreeModal } from "#/modals/generate-tree";

export class GenerateTree implements RibbonIcon {

  public readonly icon: RibbonIconIcon = "folder-tree";

  public readonly title: RibbonIconTitle = "Generate tree folder";

  public execute = (): void => {
    const editor = FileTreeGenerator.getInstance().getEditor();
    if (!editor) {
      new Notice("❌ Can only be used during editing");
      return;
    }

    new GenerateTreeModal(FileTreeGenerator.getInstance().app, editor).open();
  };

}