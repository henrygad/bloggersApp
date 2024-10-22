import { alignTextCmd } from "../cmds";
import { FiAlignLeft, FiAlignCenter, FiAlignRight, FiAlignJustify } from "react-icons/fi";

type Props = {
    onInputAreaChange: () => void
};

const Textalignment = ({ onInputAreaChange }: Props) => {
    const hanldeTextAlignment = (value: string[]) => {
        alignTextCmd(value)
        onInputAreaChange();
    };

    return <div id='text-alignment' className='flex flex-wrap items-center justify-between gap-x-3 gap-y-2'>
        <button className="cursor-pointer" onClick={() => hanldeTextAlignment(['block', 'text-left'])}>
            <FiAlignLeft size={24}/>
        </button>
        <button className="cursor-pointer" onClick={() => hanldeTextAlignment(['block', 'text-center'])}>
            <FiAlignCenter size={24} />
        </button>
        <button className="cursor-pointer" onClick={() => hanldeTextAlignment(['block', 'text-right'])}>
            <FiAlignRight size={24} />
        </button>
        <button className="cursor-pointer" onClick={() => hanldeTextAlignment(['flex'])}>
            <FiAlignJustify size={24} />
        </button>
    </div>
};

export default Textalignment;
