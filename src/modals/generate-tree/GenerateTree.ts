import { SettingsTab } from "#/SettingsTab";
import { filter } from "#/utils/filter";
import { explorerEntityToCallout, filesToExplorerEntity } from "#/utils/parser";
import { getFiles } from "#/utils/path";
import { beginningString } from "#/utils/regex";
import { dialog } from "@electron/remote";
import type { App, Editor } from "obsidian";
import type { TextAreaComponent } from "obsidian";
import { Modal, Notice, Platform, Setting } from "obsidian";
import { sep } from "path";

export class GenerateTree extends Modal {

  private editor: Editor;

  private useIgnore = true;

  private defaultSeparator = sep ? sep : "/";

  private separator = "";

  private filesInput = "";

  private filesTextArea!: TextAreaComponent;

  constructor(app: App, editor: Editor) {
    super(app);
    this.editor = editor;
    this.titleEl.textContent = "Generate file tree";
  }

  public onOpen = (): void => {
    const { contentEl } = this;

    this.loadConfigSection(contentEl);
    this.loadSeparatorSection(contentEl);
    this.loadFilesSection(contentEl);
    this.loadGenerateSection(contentEl);
  };


  private loadConfigSection = (contentEl: HTMLElement): void => {
    new Setting(contentEl)
      .setHeading()
      .setName("Use ignore config")
      .setDesc("filter entries with the ingore configuration in settings")
      .addExtraButton(
        (button) => button
          .setTooltip("Open plugin settings")
          .onClick(() => {
            this.app.setting.open();
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
  };

  private loadSeparatorSection = (contentEl: HTMLElement): void => {
    new Setting(contentEl)
      .setName("Files/Folders separator")
      .addText(
        (text) => text
          .setPlaceholder(`Default: ${this.defaultSeparator}`)
          .onChange((value) => {
            this.separator = value;
          })
      );
  };

  private loadFilesSection = (contentEl: HTMLElement): void => {
    const filesField = new Setting(contentEl);
    filesField.infoEl.style.flexGrow = "0";

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

            const notice = new Notice("", 0);
            let showNotice = true;

            void (async() => {
              let dotCount = 0;

              while (showNotice) {
                notice.setMessage(`🔎 Loading${".".repeat(dotCount)}`);
                await sleep(400);

                dotCount++;
                dotCount = dotCount % 4;
              }
            })();

            const selectedPath = dialogResponse.filePaths[0];
            const removePath = selectedPath.substring(0, selectedPath.lastIndexOf(sep) + sep.length);
            const regex = beginningString(removePath);
            let rowFiles: string[];

            try {
              rowFiles = (await getFiles(selectedPath)).map(file => file.replace(regex, ""));
            } catch (error) {
              showNotice = false;
              notice.hide();

              if (!(error instanceof Error)) {
                new Notice("❌ error while scanning directory");
                return;
              }

              new Notice(`❌ error while scanning directory:\n${error.message}}`);
              return;
            }

            let files: string[];

            if (this.useIgnore) {
              files = filter(rowFiles, SettingsTab.getInstance().settings.ignore);
            } else {
              files = rowFiles;
            }

            showNotice = false;
            notice.hide();
            this.filesInput = files.join("\n");
            this.filesTextArea.setValue(this.filesInput);
          })
      );
    }

    filesField
      .setName("Files paths")
      .addTextArea(
        (text) => {
          this.filesTextArea = text;
          text.inputEl.rows = 8;
          text.inputEl.style.width = "100%";

          return text
            .setPlaceholder("my-folder/toto/titi/hey.md\nmy-folder/tutu/my-video.mp4")
            .onChange((value) => {
              this.filesInput = value;
            });
        }
      );
  };

  private loadGenerateSection = (contentEl: HTMLElement): void => {
    new Setting(contentEl)
      .setHeading()
      .addButton((btn) => btn
        .setButtonText("⚙ Generate")
        .setCta()
        .onClick(() => {
          if (this.filesInput.trim() === "") {
            new Notice("❌ no path has been entered");
            return;
          }

          const separator = this.separator ? this.separator : this.defaultSeparator;
          let files: string[];

          if (this.useIgnore) {
            files = filter(this.filesInput.split("\n"), SettingsTab.getInstance().settings.ignore);
          } else {
            files = this.filesInput.split("\n");
          }

          const structure = filesToExplorerEntity(files, separator);
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