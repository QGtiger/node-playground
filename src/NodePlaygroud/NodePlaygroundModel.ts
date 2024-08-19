import { useMount } from "ahooks";
import { createCustomModel } from "../common/createModel";
import { WebContainer } from "@webcontainer/api";
import { defaultEntryFileName, EditorFiles, initfiles } from "./files";
import type { FileSystemTree } from "@webcontainer/api";
import { useState } from "react";

export const NodePlaygroundModel = createCustomModel(function () {
  const [files, setFiles] = useState<EditorFiles>(initfiles);
  const [currFileName, setCurrFileName] = useState(defaultEntryFileName);

  useMount(async () => {
    const webContainerIns = await WebContainer.boot();
    const fileSystemTree: FileSystemTree = Object.keys(files).reduce(
      (acc, key) => {
        acc[key] = {
          file: {
            contents: files[key].value,
          },
        };
        return acc;
      },
      {} as FileSystemTree
    );
    webContainerIns.mount(fileSystemTree);
    webContainerIns.fs.readFile("index.js", "utf-8").then((res) => {
      console.log(res);
    });
  });

  return {
    currFileName,
    currFile: files[currFileName],
    files,
    setCurrFileName,
    setFiles,
  };
});
