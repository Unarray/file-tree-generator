import type { SettingTab, MarkdownViewModeType } from "obsidian";

/**
 * THIS FILE IS REFERENCE TO UNDOCUMENTED API FONCTIONNALITY
 * THIS FONCTIONNALITY CAN CHANGE AT ANY TIME
 */

declare module "obsidian" {
  interface App {
    setting: {
      open: () => void;
      openTabById: (id: string) => null | SettingTab;
    };
  }

  interface MarkdownFileInfo {
    currentMode: {
      type: MarkdownViewModeType;
    };
  }
}