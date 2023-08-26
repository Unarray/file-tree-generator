import { SettingsTab } from "./SettingsTab";
import { GenerateTree as GenerateTreeCommand } from "#/commands/generate-tree";
import type { App, Command, Editor, PluginManifest } from "obsidian";
import { Plugin } from "obsidian";
import type { RibbonIcon } from "#/ribbon-icons";
import { GenerateTree as GenerateTreeIcon } from "#/ribbon-icons/generate-tree";

export default class FileTreeGenerator extends Plugin {

  private static instance: FileTreeGenerator;

  private static setInstance = (instance: FileTreeGenerator): void => {
    FileTreeGenerator.instance = instance;
  };

  public static getInstance = (): FileTreeGenerator => {
    return FileTreeGenerator.instance;
  };

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    FileTreeGenerator.setInstance(this);
  }


  onload = async(): Promise<void> => {
    this.addCommands(
      new GenerateTreeCommand()
    );

    this.addRibbonIconObject(new GenerateTreeIcon());


    const settingsTab = new SettingsTab(this);

    await settingsTab.loadSettings();
    this.addSettingTab(settingsTab);
  };

  public addCommands = (...commands: Command[]): void => {
    for (const command of commands) {
      this.addCommand(command);
    }
  };

  public addRibbonIconObject = (ribbonIcon: RibbonIcon): HTMLElement => {
    return this.addRibbonIcon(ribbonIcon.icon, ribbonIcon.title, ribbonIcon.execute);
  };

  public getEditor = (): Editor | null => {
    const editor = this.app.workspace.activeEditor?.editor;

    return editor ? editor : null;
  };

}