import { beginningString } from "#/utils/regex";
import { readdir, stat } from "fs/promises";
import type { Ignore } from "ignore";
import { sep as separator } from "path";

export const getFiles = async(
  path: string,
  filter: Ignore | null = null,
  removeRootPath: string | null = null,
  files: string[] = []
): Promise<string[]> => {
  const fileList = await readdir(path);
  const regex = beginningString(removeRootPath ?? "");

  for (const file of fileList) {
    const fullName = `${path}${separator}${file}`;
    const name = `${path}${separator}${file}`.replace(regex, "");
    const entityStat = await stat(fullName);

    if (filter?.ignores(name)) continue;

    if (entityStat.isDirectory()) {
      await getFiles(fullName, filter, removeRootPath, files);
    } else {
      files.push(name);
    }
  }

  return files;
};