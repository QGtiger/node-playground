import { useMount } from "ahooks";
import { createCustomModel } from "../common/createModel";
import { WebContainer } from "@webcontainer/api";
import { defaultEntryFileName, EditorFiles, initfiles } from "./files";
import type { FileSystemTree } from "@webcontainer/api";
import { useState } from "react";

export const NodePlaygroundModel = createCustomModel(function () {
  const [files, setFiles] = useState<EditorFiles>(initfiles);
  const [currFileName, setCurrFileName] = useState(defaultEntryFileName);
  const [devUrl, setDevUrl] = useState("");

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
    await webContainerIns.mount(fileSystemTree);

    async function installDependencies() {
      // Install dependencies
      const installProcess = await webContainerIns.spawn("npm", ["install"]);
      // Wait for install command to exit
      return installProcess.exit;
    }

    const exitCode = await installDependencies();
    console.log("=====exitCode=====", exitCode);
    // installProcess.output.pipeTo(
    //   new WritableStream({
    //     write(data) {
    //       console.log(data);
    //     },
    //   })
    // );
    const devProcess = await webContainerIns.spawn("npm", ["run", "start"]);
    devProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    // Wait for `server-ready` event
    webContainerIns.on("server-ready", (port, url) => {
      setDevUrl(url);
    });
  });

  return {
    currFileName,
    currFile: files[currFileName],
    files,
    setCurrFileName,
    setFiles,
    devUrl,
  };
});
