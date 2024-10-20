import { useRef, useState } from "react";
import Dropdownmenuwrapper from "../assests/Dropdownmenuwrapper";
import { emojiCmd } from "../cmds";

type Props = {
    arrOfEmojis: string[]
    onInputAreaChange: () => void
    openDropDownMenu: string
    setOpenDropDownMenu: React.Dispatch<React.SetStateAction<string>>
};

const Emojis = ({ 
    arrOfEmojis, 
    onInputAreaChange ,
    openDropDownMenu, 
    setOpenDropDownMenu,
}: Props) => {
    
    const [currentEmoji, setCurrentEmoji] = useState(arrOfEmojis?.[0]);

    const handleInserEmojis = (emoji: string) => {
        emojiCmd(emoji);
        onInputAreaChange();
        setOpenDropDownMenu('');
    };

    return <div id="emojis" >
        <button className='border p-1 cursor-pointer'
            onClick={() => { setOpenDropDownMenu('emojis') }}>
            {currentEmoji}
        </button>
        <Dropdownmenuwrapper
            openDropDownMenu={openDropDownMenu}
            menuName='emojis'
            Children={
                <div className="grid grid-cols-4 gap-2 min-w-[130px] bg-gray-100 p-1 border shadow-sm">
                    {
                        arrOfEmojis &&
                            arrOfEmojis.length ?
                            arrOfEmojis.map((item) =>
                                <button
                                    key={item}
                                    className="w-[30px] h-[30px] shadow-md"
                                    onClick={() => { handleInserEmojis(item); setCurrentEmoji(item) }}
                                >{item}</button>
                            ) :
                            null
                    }
                </div>
            } />
    </div>
};

export default Emojis;
