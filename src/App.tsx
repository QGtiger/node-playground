import NodePlayground from "./NodePlaygroud";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <NodePlayground />
      <SpeedInsights />
      <Analytics />
    </>
  );
}

export default App;
