import { Allotment } from "allotment";
import Header from "./components/Header";
import { NodePlaygroundModel } from "./NodePlaygroundModel";

import "allotment/dist/style.css";

export default function NodePlayground() {
  return (
    <div className="h-[100vh] flex flex-col">
      <NodePlaygroundModel.Provider>
        <Header />
        <Allotment vertical>
          <Allotment.Pane>
            <Allotment defaultSizes={[100]}>
              <Allotment.Pane minSize={500}>代码编辑区域</Allotment.Pane>
              <Allotment.Pane>预览</Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
          <Allotment.Pane>console</Allotment.Pane>
        </Allotment>
      </NodePlaygroundModel.Provider>
    </div>
  );
}
