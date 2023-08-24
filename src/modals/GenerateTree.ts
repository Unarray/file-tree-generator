import { explorerEntityToCallout, filesToExplorerEntity } from "#/utils/parser";
import { getFiles } from "#/utils/path";
import { beginningString } from "#/utils/regex";
import { dialog } from "@electron/remote";
import type { App, Editor, TextAreaComponent } from "obsidian";
import { Modal, Notice, Platform, Setting } from "obsidian";
import { sep as separator } from "path";

export class GenerateTree extends Modal {

  private editor: Editor;

  private useIgnore = true;

  private filesInput = "";

  constructor(app: App, editor: Editor) {
    super(app);
    this.editor = editor;
  }

  public onOpen = (): void => {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Generate file tree" });

    new Setting(contentEl)
      .setName("Use ignore config")
      .setDesc("filter entries with the ingore configuration in settings")
      .addExtraButton(
        (button) => button
          .setTooltip("Open plugin settings")
          .onClick(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            this.app.setting.open();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            this.app.setting.openTabById("file-tree-generator");
          })
      )
      .addToggle(
        (toggle) => toggle
          .setValue(this.useIgnore)
          .onChange((value) => {
            this.useIgnore = value;
          })
      );

    let textArea: TextAreaComponent;
    const filesField = new Setting(contentEl)
      .addText(
        (text) => text
          .setPlaceholder(`Default: ${separator}`)
      )
      .addTextArea(
        (text) => {
          textArea = text;
          return text
            .setPlaceholder("my-folder/toto/titi/hey.md\nmy-folder/tutu/my-video.mp4")
            .onChange((value) => {
              this.filesInput = value;
              console.log("CHANGED!");
            });
        }
      );

    if (Platform.isDesktop) {
      filesField.addExtraButton(
        (button) => button
          .setIcon("upload")
          .setTooltip("Import files from folder")
          .onClick(async() => {
            const dialogResponse = await dialog.showOpenDialog({
              properties: ["openDirectory"]
            });

            if (dialogResponse.canceled) return;

            const selectedPath = dialogResponse.filePaths[0];
            const removePath = selectedPath.substring(0, selectedPath.lastIndexOf(separator) + separator.length);
            const regex = beginningString(removePath);
            const files = (await getFiles(selectedPath)).map(file => file.replace(regex, ""));

            this.filesInput = files.join("\n");
            textArea.setValue(this.filesInput);
          })
      );
    }

    new Setting(contentEl)
      .addButton((btn) => btn
        .setButtonText("Generate")
        .setCta()
        .onClick(() => {
          if (this.filesInput.trim() === "") {
            new Notice("❌ no path has been entered");
            return;
          }

          const structure = filesToExplorerEntity(this.filesInput.split("\n"));
          const callouts = explorerEntityToCallout(structure);
          const cursorLine = this.editor.getCursor("head").line;

          this.editor.setLine(
            cursorLine,
            `${this.editor.getLine(cursorLine)}\n${callouts}`
          );
          this.close();
        }));
  };

  public onClose = (): void => {
    const { contentEl } = this;
    contentEl.empty();
  };

}