import path from "path";
import type { ExplorerEntity } from "./parser.type";
import { escapeString } from "#/utils/regex";
import { haveChilds } from "./parser.util";

export const filesToExplorerEntity = (files: string[], removeBasePath = "", separator: string | null = null): ExplorerEntity => {
  separator = separator ?? path.sep;
  const regex = new RegExp(`^${escapeString(removeBasePath)}`);
  const structure: ExplorerEntity = {};

  for (const file of files) {
    const parts = file.replace(regex, "").split(separator);
    let current = structure;

    for (const part of parts) {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
  }

  return structure;
};

export const explorerEntityToCallout = (explorerEntity: ExplorerEntity, depth = 0): string => {
  const folders = Object.entries(explorerEntity).filter(([_, value]) => !haveChilds(value)).sort();
  const files = Object.entries(explorerEntity).filter(([_, value]) => haveChilds(value)).sort();
  const title = depth % 2 ? "folder-2" : "folder-1";
  let result = "";

  for (const [key, value] of folders) {
    result += `${"> ".repeat(depth + 1)}[!${title}]- ${key}\n`
           + `${explorerEntityToCallout(value, depth + 1)}`
           + `${"> ".repeat(depth)}\n`;
  }

  for (const [key, _] of files) {
    result += `${"> ".repeat(depth)}📄 ${key}\n`;
  }

  return result;
};