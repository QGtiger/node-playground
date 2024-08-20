import NodePlayground from "./NodePlaygroud";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { NodePlaygroundModel } from "./NodePlaygroud/NodePlaygroundModel";

function App() {
  return (
    <>
      <NodePlaygroundModel.Provider>
        <NodePlayground />
      </NodePlaygroundModel.Provider>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;
