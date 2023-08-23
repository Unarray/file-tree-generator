import type { ExplorerEntity } from "./parser.type";

export const haveChilds = (explorerEntity: ExplorerEntity): boolean => {
  return Object.keys(explorerEntity).length === 0;
};