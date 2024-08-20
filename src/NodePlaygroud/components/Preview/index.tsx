import { useMemo } from "react";
import { NodePlaygroundModel } from "../../NodePlaygroundModel";
import iframeHtmlRaw from "./iframe.html?raw";

export default function Preview() {
  const { devUrl } = NodePlaygroundModel.useModel();

  const iframeUrl = useMemo(() => {
    return (
      devUrl ||
      URL.createObjectURL(new Blob([iframeHtmlRaw], { type: "text/html" }))
    );
  }, [devUrl]);

  return (
    <div className="h-full relative">
      <iframe src={iframeUrl} className="w-full h-full">
        1111
      </iframe>
      {/* {showMessage && (
        <MessageError
          className=" absolute bottom-[10px] w-[96%] left-[2%] animate-slide "
          message={messgae}
          onClose={showMessageAction.setFalse}
        />
      )} */}
    </div>
  );
}
