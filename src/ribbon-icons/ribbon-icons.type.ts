import type { Plugin } from "obsidian";

export type RibbonIconMethod = Parameters<Plugin["addRibbonIcon"]>
export type RibbonIconIcon = RibbonIconMethod[0]
export type RibbonIconTitle = RibbonIconMethod[1]
export type RibbonIconCallback = RibbonIconMethod[2]

export interface RibbonIcon {
  icon: RibbonIconIcon;
  title: RibbonIconTitle;
  execute: RibbonIconCallback;
}