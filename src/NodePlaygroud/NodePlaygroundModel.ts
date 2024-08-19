import { useMount } from "ahooks";
import { createCustomModel } from "../common/createModel";
import { WebContainer } from "@webcontainer/api";
import { files } from "./files";

export const NodePlaygroundModel = createCustomModel(function () {
  useMount(async () => {
    const webContainerIns = await WebContainer.boot();
    webContainerIns.mount(files);
    webContainerIns.fs.readFile("index.js", "utf-8").then((res) => {
      console.log(res);
    });
  });
});
