import classNames from "classnames";
import { useRef, useState } from "react";
import { NodePlaygroundModel } from "../../../NodePlaygroundModel";
import { EditorFile } from "../../../files";

export default function FileNameItem(
  props: EditorFile & {
    name: string;
  }
) {
  const { currFileName, setCurrFileName } = NodePlaygroundModel.useModel();
  const { name, buildIn } = props;
  const [isEdit, setIsEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onEdit = () => {
    if (!buildIn) {
      setIsEdit(true);

      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current!.value = name;
      });
    }
  };

  const onBlur = () => {
    setIsEdit(false);
    alert("暂不支持");
    // updateFile(id, {
    //   name: inputRef.current?.value,
    // });
  };

  return (
    <div
      className={classNames(
        " text-[13px] px-[10px] pt-[8px] pb-[6px]  border-b-[3px] border-[transparent] flex gap-2 items-center",
        { " border-b-[skyblue]": currFileName === name }
      )}
      onDoubleClick={onEdit}
    >
      {isEdit ? (
        <input
          className=" border-none w-[120px] outline-none"
          ref={inputRef}
          onBlur={onBlur}
        />
      ) : (
        <>
          <span
            className="cursor-pointer"
            onClick={() => {
              setCurrFileName(name);
            }}
          >
            {name}
          </span>
          {!buildIn && (
            <span
              className=" text-gray-400 px-1 cursor-pointer"
              onClick={() => {
                if (confirm("确认删除?")) {
                  alert("暂不支持");
                }
              }}
            >
              ×
            </span>
          )}
        </>
      )}
    </div>
  );
}
