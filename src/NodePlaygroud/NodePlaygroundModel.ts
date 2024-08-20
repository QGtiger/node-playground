import { useMount } from "ahooks";
import { createCustomModel } from "../common/createModel";
import { WebContainer } from "@webcontainer/api";
import { defaultEntryFileName, EditorFiles, initfiles } from "./files";
import type { FileSystemTree, WebContainerProcess } from "@webcontainer/api";
import { useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

// async function installDependencies(
//   webcontainerIns: WebContainer,
//   terminal: Terminal
// ) {
//   // Install dependencies
//   const installProcess = await webcontainerIns.spawn("npm", ["install"]);
//   installProcess.output.pipeTo(
//     new WritableStream({
//       write(data) {
//         terminal.write(data);
//       },
//     })
//   );
//   // Wait for install command to exit
//   return installProcess.exit;
// }

/**
 * @param {Terminal} terminal
 */
async function startShell(webcontainerIns: WebContainer, terminal: Terminal) {
  const shellProcess = await webcontainerIns.spawn("jsh", {
    terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
  });
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );

  const input = shellProcess.input.getWriter();
  terminal.onData((data) => {
    input.write(data);
  });
  return shellProcess;
}

export const NodePlaygroundModel = createCustomModel(function () {
  const [files, setFiles] = useState<EditorFiles>(initfiles);
  const [currFileName, setCurrFileName] = useState(defaultEntryFileName);
  const [devUrl, setDevUrl] = useState("");
  const webContainerInsRef = useRef<WebContainer | null>(null);
  const terminalInsRef = useRef<Terminal | null>(null);
  const terminalFitAddonRef = useRef<FitAddon | null>(null);
  const terminalShellProcessRef = useRef<WebContainerProcess | null>(null);

  useMount(async () => {
    if (webContainerInsRef.current) return;

    if (terminalInsRef.current) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
    const fitAddon = (terminalFitAddonRef.current = new FitAddon());
    const terminalIns = (terminalInsRef.current = new Terminal({
      convertEol: true, // 设置为 true 的原因是强制光标始终从下一行的开头开始
      fontSize: 12,
      theme: {
        background: "#f5f5f5",
        foreground: "#333",
        cursor: "#333",
      },
    }));
    console.log(document.getElementById("terminal-container")!.offsetHeight);
    terminalIns.loadAddon(fitAddon);
    terminalIns.open(document.getElementById("terminal-container")!);

    fitAddon.fit();

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

    const directoryToWatch = "/";
    webContainerIns.fs.watch(directoryToWatch, async (event, filename) => {
      if (filename && typeof filename === "string") {
        const filePath = directoryToWatch + filename;
        if (event === "change") {
          setFileValue(
            filename,
            await webContainerIns.fs.readFile(filePath, "utf-8"),
            false
          );
        }
      }
    });

    // terminalIns.write("Installing dependencies...\n");
    // await installDependencies(webContainerIns, terminalIns);

    // terminalIns.write("Starting dev server...\n");
    // // await runDevServer(webContainerIns, terminalIns);
    // const devProcess = await webContainerIns.spawn("npm", ["run", "start"]);
    // devProcess.output.pipeTo(
    //   new WritableStream({
    //     write(data) {
    //       terminalIns.write(data);
    //     },
    //   })
    // );

    // Wait for `server-ready` event
    webContainerIns.on("server-ready", (_, url) => {
      setDevUrl(url);
    });

    terminalShellProcessRef.current = await startShell(
      webContainerIns,
      terminalIns
    );
  });

  const terminalResizeCallback = () => {
    const _terminalInsRef = terminalInsRef.current!;
    terminalFitAddonRef.current?.fit();
    terminalShellProcessRef.current?.resize({
      cols: _terminalInsRef.cols,
      rows: _terminalInsRef.rows,
    });
  };

  const setFileValue = (
    fileName: string,
    value: string,
    fsWrite: boolean = true
  ) => {
    setFiles((prev) => {
      if (!prev[fileName]) {
        prev[fileName] = {
          value,
          buildIn: false,
        };
      }
      prev[fileName].value = value;
      return { ...prev };
    });
    if (fsWrite) {
      webContainerInsRef.current?.fs.writeFile(fileName, value);
    }
  };

  return {
    currFileName,
    currFile: files[currFileName],
    files,
    setCurrFileName,
    setFiles,
    devUrl,
    setFileValue,
    terminalResizeCallback,
  };
});
