import type { Ignore } from "ignore";
import ignore from "ignore";

export const filter = (items: string[], patterns: string[]): string[] => {
  return ignore().add(patterns).filter(items);
};

export const getFilter = (patterns: string[]): Ignore => {
  const filter = ignore().add(patterns);
  return filter;
};