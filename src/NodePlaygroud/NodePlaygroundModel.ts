import { useMount } from "ahooks";
import { createCustomModel } from "../common/createModel";
import { WebContainer } from "@webcontainer/api";
import { defaultEntryFileName, EditorFiles, initfiles } from "./files";
import type { FileSystemTree } from "@webcontainer/api";
import { useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";

async function installDependencies(
  webcontainerIns: WebContainer,
  terminal: Terminal
) {
  // Install dependencies
  const installProcess = await webcontainerIns.spawn("npm", ["install"]);
  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );
  // Wait for install command to exit
  return installProcess.exit;
}

export const NodePlaygroundModel = createCustomModel(function () {
  const [files, setFiles] = useState<EditorFiles>(initfiles);
  const [currFileName, setCurrFileName] = useState(defaultEntryFileName);
  const [devUrl, setDevUrl] = useState("");
  const webContainerInsRef = useRef<WebContainer | null>(null);
  const terminalRef = useRef<Terminal | null>(null);

  useMount(async () => {
    if (webContainerInsRef.current) return;

    if (terminalRef.current) return;
    const terminalIns = (terminalRef.current = new Terminal({
      convertEol: true, // 设置为 true 的原因是强制光标始终从下一行的开头开始
    }));
    terminalIns.open(document.getElementById("terminal-container")!);

    const webContainerIns = (webContainerInsRef.current =
      await WebContainer.boot());
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
    terminalIns.write(
      `Mounting file system...\n${JSON.stringify(fileSystemTree, null, 2)}\n`
    );
    await webContainerIns.mount(fileSystemTree);

    terminalIns.write("Installing dependencies...\n");
    await installDependencies(webContainerIns, terminalIns);

    terminalIns.write("Starting dev server...\n");
    // await runDevServer(webContainerIns, terminalIns);
    const devProcess = await webContainerIns.spawn("npm", ["run", "start"]);
    devProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminalIns.write(data);
        },
      })
    );

    // Wait for `server-ready` event
    webContainerIns.on("server-ready", (_, url) => {
      console.log(_);
      setDevUrl(url);
    });
  });

  const setFileValue = (fileName: string, value: string) => {
    setFiles((prev) => {
      prev[fileName].value = value;
      return { ...prev };
    });
    webContainerInsRef.current?.fs.writeFile(fileName, value);
  };

  return {
    currFileName,
    currFile: files[currFileName],
    files,
    setCurrFileName,
    setFiles,
    devUrl,
    setFileValue,
  };
});
