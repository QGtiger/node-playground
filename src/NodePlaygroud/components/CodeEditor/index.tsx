import { useEffect } from "react";
import Editor from "./Editor";
import FileList from "./FileList";
import { useDebounceFn } from "ahooks";
import { NodePlaygroundModel } from "../../NodePlaygroundModel";
import { getLanguageByFileName } from "../../utils";

export default function CodeEditor() {
  const { currFile, currFileName, setFileValue } =
    NodePlaygroundModel.useModel();

  const { run: onEditorChange, cancel } = useDebounceFn(
    (value: string) => {
      if (value !== currFile.value) {
        setFileValue(currFileName, value);
      }
    },
    {
      wait: 500,
    }
  );

  useEffect(() => {
    cancel();
  }, [currFileName, cancel]);

  return (
    <div className="h-full flex flex-col">
      <FileList />
      <Editor
        file={currFile}
        onChange={(v) => {
          onEditorChange(v!);
        }}
        path={currFileName}
        language={getLanguageByFileName(currFileName)}
      />
    </div>
  );
}
