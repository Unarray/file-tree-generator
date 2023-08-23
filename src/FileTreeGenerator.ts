import { GenerateTree } from "#/commands/GenerateTree";
import type { App, Command, PluginManifest } from "obsidian";
import { Plugin } from "obsidian";

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


  onload(): void {
    this.addCommands(
      new GenerateTree()
    );
  }

  public addCommands = (...commands: Command[]): void => {
    for (const command of commands) {
      this.addCommand(command);
    }
  };

}