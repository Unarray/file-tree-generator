import { readdir, stat } from "fs/promises";
import { sep as separator } from "path";

export const getFiles = async(path: string, filter: string[] = [], files: string[] = []): Promise<string[]> => {
  const fileList = await readdir(path);

  for (const file of fileList) {
    const name = `${path}${separator}${file}`;
    const entityStat = await stat(name);

    if (entityStat.isDirectory()) {
      await getFiles(name, filter, files);
    } else {
      files.push(name);
    }
  }

  return files;
};