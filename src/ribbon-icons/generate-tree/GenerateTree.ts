import { Notice } from "obsidian";
import type { RibbonIcon, RibbonIconIcon, RibbonIconTitle } from "../ribbon-icons.type";
import FileTreeGenerator from "#/FileTreeGenerator";
import { GenerateTree as GenerateTreeModal } from "#/modals/generate-tree";

export class GenerateTree implements RibbonIcon {

  public readonly icon: RibbonIconIcon = "folder-tree";

  public readonly title: RibbonIconTitle = "Generate file tree";

  public execute = (): void => {
    const editor = FileTreeGenerator.getInstance().getEditor();

    if (!editor) {
      new Notice("❌ Can only be used during editing");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const viewType = FileTreeGenerator.getInstance().app.workspace.activeEditor.currentMode.type as string;

    if (viewType !== "source") {
      new Notice("❌ Can only be used during editing");
      return;
    }

    new GenerateTreeModal(FileTreeGenerator.getInstance().app, editor).open();
  };

}