import type { FileSystemTree } from "@webcontainer/api";
import IndexJsRaw from "./template/index.js?raw";
import PackageJsonRaw from "./template/package.json?raw";

export const files: FileSystemTree = {
  "index.js": {
    file: {
      contents: IndexJsRaw,
    },
  },
  "package.json": {
    file: {
      contents: PackageJsonRaw,
    },
  },
};
