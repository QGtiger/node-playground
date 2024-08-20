import { Allotment } from "allotment";
import Header from "./components/Header";

import "allotment/dist/style.css";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";
import TerminalConsole from "./components/Terminal";
import { NodePlaygroundModel } from "./NodePlaygroundModel";

export default function NodePlayground() {
  const { terminalResizeCallback } = NodePlaygroundModel.useModel();
  return (
    <div className="h-[100vh] flex flex-col">
      <Header />
      <Allotment
        vertical
        onChange={() => {
          terminalResizeCallback();
        }}
      >
        <Allotment.Pane>
          <Allotment defaultSizes={[100]}>
            <Allotment.Pane minSize={500}>
              <CodeEditor />
            </Allotment.Pane>
            <Allotment.Pane>
              <Preview />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane>
          <TerminalConsole />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
