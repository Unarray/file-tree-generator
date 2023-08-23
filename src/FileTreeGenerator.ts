import { GenerateTree } from "#/commands/GenerateTree";
import type { Command } from "obsidian";
import { Plugin } from "obsidian";

export default class FileTreeGenerator extends Plugin {

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