import { useRef } from "react";

import "@xterm/xterm/css/xterm.css";
import "./index.css";

export default function TerminalConsole() {
  const terminalDomRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="w-full h-full relative"
      id="terminal-container"
      ref={terminalDomRef}
    ></div>
  );
}
