import { alignTextCmd } from "../cmds";

type Props = {
    onInputAreaChange: ()=> void
};

const Textalignment = ({onInputAreaChange}: Props) => {
    const hanldeTextAlignment=(value: string[])=>{
        alignTextCmd(value)
        onInputAreaChange();
    };

    return <div id='text-alignment' className='flex flex-wrap items-center justify-between gap-2'>
        <button onClick={() => hanldeTextAlignment(['text-left'])}>Left</button>
        <button onClick={() => hanldeTextAlignment(['text-center'])}>Center</button>
        <button onClick={() => hanldeTextAlignment(['text-right'])}>Right</button>
    </div>
};

export default Textalignment;
