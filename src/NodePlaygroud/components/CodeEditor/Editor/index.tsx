import MonacoEditor, { EditorProps, OnMount } from "@monaco-editor/react";
import { createATA } from "./ata";
import { useEffect, useRef } from "react";
import { EditorFile } from "../../../files";

type MonacoEditorInfer = Parameters<OnMount>[0];

export default function Editor({
  file,
  onChange,
  readOnly,
  language,
  path,
}: {
  file: EditorFile;
  onChange?: EditorProps["onChange"];
  readOnly?: boolean;
  language?: string;
  path?: string;
}) {
  const editorRef = useRef<MonacoEditorInfer>();

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    const compilerOptions =
      monaco.languages.typescript.javascriptDefaults.getCompilerOptions();
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...compilerOptions,
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true, // 默认加上 default
      // moduleResolution: "nodenext",
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`
      );
    });

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });

    ata(editor.getValue());
  };

  useEffect(() => {
    editorRef.current?.updateOptions({
      readOnly: readOnly || false,
    });
  }, [readOnly]);

  console.log(language, path);

  return (
    <MonacoEditor
      height="100%"
      language={language}
      path={path}
      options={{
        fontSize: 12,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        tabSize: 2,
        lineNumbersMinChars: 3,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
      onMount={handleMount}
      value={file.value}
      onChange={onChange}
    />
  );
}
