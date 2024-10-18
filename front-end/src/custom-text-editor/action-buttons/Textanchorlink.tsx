import { useRef, useState } from "react";
import { useClickOutSide } from "../../hooks";
import Dropdownmenuwrapper from "../assests/Dropdownmenuwrapper";
import { textFormatCmd } from "../cmds";

type Props = {
    onInputAreaChange: () => void
};

const Textanchorlink = ({ onInputAreaChange }: Props) => {
    const [link, setLink] = useState('');
    const [openDropDownMenu, setOpenDropDownMenu] = useState('');
    const openDropDownMenuRef = useRef(null);
    useClickOutSide(openDropDownMenuRef, () => { setOpenDropDownMenu('') });

    const handleTextLink = (cmd: string, value?: string[]) => {
        textFormatCmd(cmd, value || []);
        onInputAreaChange();
        setOpenDropDownMenu('');
    };

    return <div id='text-link' className='flex flex-wrap items-center justify-between gap-2'>
        <div id='link'>
            <button className='border p-1 cursor-pointer' onClick={() => setOpenDropDownMenu('link')}>A</button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName='link'
                Children={
                    <div className='flex flex-col gap-3 bg-gray-100 p-3 border shadow-sm'>
                        <label className='text-base' htmlFor="anchorLink">
                            Anchor link
                            <input type="text"
                                className='mt-1 px-2 py-[.2rem] border text-blue-700 border-blue-400 outline-none rounded'
                                placeholder='add link...'
                                name='anchorLink'
                                id='anchorLink'
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                            {!link ?
                                <span className='text-red-800 text-sm -mt-2'>no link available</span>
                                : null
                            }
                        </label>
                        <div className='flex justify-end items-center gap-3 '>
                            <button className='px-2 py-[.2rem] bg-red-800 text-white rounded ' onClick={() => setOpenDropDownMenu('')}>Close</button>
                            <button className='px-2 py-[.2rem] bg-green-800 text-white rounded ' onClick={() => handleTextLink('link', [link, 'text-blue-900'])} >Create link</button>
                        </div>
                    </div>
                } />
        </div>
        <button id='unlink' className='' onClick={() => handleTextLink('unlink')}> <span className="overline">A</span> </button>
    </div>
};

export default Textanchorlink;
