import { useRef, useState } from "react";
import Dropdownmenuwrapper from "../assests/Dropdownmenuwrapper";
import { textFormatCmd } from "../cmds";
import { Input } from "../../components";
import { GoLink, GoUnlink} from "react-icons/go";

type Props = {
    onInputAreaChange: () => void
    openDropDownMenu: string
    setOpenDropDownMenu: React.Dispatch<React.SetStateAction<string>>
};

const Textanchorlink = ({ 
    onInputAreaChange,
    openDropDownMenu,
    setOpenDropDownMenu,
 }: Props) => {
    const [link, setLink] = useState('');
    const openDropDownMenuRef = useRef(null);

    const handleTextLink = (cmd: string, value?: string[]) => {
        textFormatCmd(cmd, value || []);
        onInputAreaChange();
        setOpenDropDownMenu('');
    };

    return <div id='text-link' className='flex flex-wrap items-center justify-between gap-x-3 gap-y-2'>
        <div id='link' ref={openDropDownMenuRef}>
            <button className='block cursor-pointer' onClick={() => setOpenDropDownMenu(openDropDownMenu === 'link' ? '' :'link')}>
               <GoLink size={18} />
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName='link'
                Children={
                    <div className='flex flex-col gap-3 bg-gray-100 p-3 border shadow-sm'>
                        <Input
                            id={'anchor-link-input'}
                            type={'text'}
                            inputName={'Add link'}
                            inputClass={'max-w-[190px] text-blue-700 py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                            labelClass={''}
                            value={link}
                            setValue={(value) => { setLink(value as string) }}
                            placeHolder={'https://www.example.com'}
                            error={{
                                isTrue: !link,
                                errorMsg: 'No link available',
                                errorClass: 'text-red-800 text-sm -mt-2',
                            }}
                        />
                       
                        <div className='flex justify-end items-center gap-3 '>
                            <button className='px-2 py-[.2rem] bg-red-800 text-white rounded ' onClick={() => setOpenDropDownMenu('')}>Close</button>
                            <button className='px-2 py-[.2rem] bg-green-800 text-white rounded ' onClick={() => handleTextLink('link', [link, 'text-blue-900'])} >Create link</button>
                        </div>
                    </div>
                } />
        </div>
        <button id='unlink' className='' onClick={() => handleTextLink('unlink')}> 
            <GoUnlink size={18} />
        </button>
    </div>
};

export default Textanchorlink;
