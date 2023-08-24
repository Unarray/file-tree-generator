import type FileTreeGenerator from "#/FileTreeGenerator";
import type { PluginSettings } from "./settings.type";
import { PluginSettingTab, Setting } from "obsidian";

export class SettingsTab extends PluginSettingTab {

  public static DEFAULT_SETTINGS: PluginSettings = {
    ignore: [".git", "node_modules"]
  };

  public settings!: PluginSettings;

  private plugin: FileTreeGenerator;

  constructor(plugin: FileTreeGenerator) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  public loadSettings = async(): Promise<void> => {
    this.settings = Object.assign({}, SettingsTab.DEFAULT_SETTINGS, (await this.plugin.loadData()) as PluginSettings);
  };

  public saveSettings = async(): Promise<void> => {
    await this.plugin.saveData(this.settings);
  };

  public display = (): void => {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Ignore patterns")
      .setDesc("This will skip this pattern when generating the tree")
      .addTextArea(
        (text) => text
          .setPlaceholder("filters according to .gitignore spec 2.22.1")
          .setValue(this.settings.ignore.join("\n"))
          .onChange(async(value) => {
            this.settings.ignore = value.split("\n");
            await this.saveSettings();
          })
      );
  };

}