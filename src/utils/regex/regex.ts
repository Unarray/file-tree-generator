import { escapeString } from "./regex.util";


export const beginningString = (string: string): RegExp => {
  return new RegExp(`^${escapeString(string)}`);
};