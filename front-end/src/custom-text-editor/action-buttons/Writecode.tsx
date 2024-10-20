import { writeCodeCmd } from "../cmds";

type Props = {
    onInputAreaChange: () => void
};

const Writecode = ({onInputAreaChange}: Props) => {
    const handleInsertCodeTag = ()=>{
        writeCodeCmd();
        onInputAreaChange();
    };

  return <div id="embed-code">
     <button className="border p-1" onClick={() => handleInsertCodeTag()}>Code</button>
  </div>
};

export default Writecode;
