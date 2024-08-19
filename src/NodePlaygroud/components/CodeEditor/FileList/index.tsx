import { useMemo } from "react";
import FileNameItem from "./FileNameItem";
import { NodePlaygroundModel } from "../../../NodePlaygroundModel";

export default function FileList() {
  const { files } = NodePlaygroundModel.useModel();

  const keys = useMemo(() => {
    return Object.keys(files);
  }, [files]);

  return (
    <div className="flex items-center gap-1 whitespace-nowrap overflow-y-hidden overflow-x-auto scroll-bar-hidden">
      <div className="flex">
        {keys.map((k) => {
          return <FileNameItem key={k} {...files[k]} name={k} />;
        })}
      </div>
      <div
        className="add text-[skyblue] cursor-pointer border-b-[2px] border-[transparent]"
        onClick={() => {
          alert("暂不支持");
        }}
      >
        +
      </div>
    </div>
  );
}
