import ignore from "ignore";

export const filter = (items: string[], patterns: string[]): string[] => {
  return ignore().add(patterns).filter(items);
};