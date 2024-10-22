import { FaUndo, FaRedo } from "react-icons/fa";

const History = ({ handleDisplayHistory }: { handleDisplayHistory: (direction: string) => void }) => {

    return <div id="history" className='flex flex-wrap items-center justify-between gap-x-3 gap-y-2'>
        <button className="block cursor-pointer" onClick={() => handleDisplayHistory('undo')}>
            <FaUndo size={17} />
        </button>
        <button className="block cursor-pointer" onClick={() => handleDisplayHistory('redo')}>
            <FaRedo size={17} />
        </button>
    </div>
};

export default History;
