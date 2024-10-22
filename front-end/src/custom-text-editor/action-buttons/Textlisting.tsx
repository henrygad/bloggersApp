import { listingCmd } from "../cmds";
import { GrUnorderedList, GrOrderedList } from "react-icons/gr";

type Props = {
    onInputAreaChange: () => void
};

const Textlisting = ({onInputAreaChange}: Props)=>{

    const handleTextListing = (type: string, value: string[])=> {
        listingCmd(type, value);
        onInputAreaChange();
    };

    return <div id='text-listings' className='flex flex-wrap items-center justify-between gap-x-3 gap-y-2'>
        <button className="block cursor-pointer" onClick={() => handleTextListing('ul', ['list-disc', 'ml-5'])}>
            <GrUnorderedList size={24} />
        </button>
        <button className="block cursor-pointer" onClick={() => handleTextListing('ol', ['list-decimal', 'ml-5'])}>
            <GrOrderedList size={24} />
        </button>
    </div>
};

export default Textlisting;
