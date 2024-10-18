import { listingCmd } from "../cmds";

type Props = {
    onInputAreaChange: () => void
};

const Textlisting = ({onInputAreaChange}: Props)=>{

    const handleTextListing = (type: string, value: string[])=> {
        listingCmd(type, value);
        onInputAreaChange();
    };

    return <div id='text-listings' className='flex flex-wrap items-center justify-between gap-3'>
        <button onClick={() => handleTextListing('ul', [])}>ul</button>
        <button onClick={() => handleTextListing('ol', [])}>ol</button>
    </div>
};

export default Textlisting;
