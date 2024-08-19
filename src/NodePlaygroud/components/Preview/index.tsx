import { NodePlaygroundModel } from "../../NodePlaygroundModel";

export default function Preview() {
  const { devUrl } = NodePlaygroundModel.useModel();
  return (
    <div className="h-full relative">
      <iframe src={devUrl} className="w-full h-full"></iframe>
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
