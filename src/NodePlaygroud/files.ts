import IndexJsRaw from "./template/index.js?raw";
import PackageJsonRaw from "./template/package.json?raw";

export type EditorFile = {
  value: string;
  buildIn?: boolean;
};

export interface EditorFiles {
  [x: string]: EditorFile;
}

export const defaultEntryFileName = "index.js";

export const initfiles: EditorFiles = {
  [defaultEntryFileName]: {
    value: IndexJsRaw,
    buildIn: true,
  },
  "package.json": {
    value: PackageJsonRaw,
    buildIn: true,
  },
};
