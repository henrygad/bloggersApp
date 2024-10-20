import { useState } from "react";
import { textFormatCmd } from "../cmds";
import Dropdownmenuwrapper from "../assests/Dropdownmenuwrapper";

type Props = {
    arrOfFontColors: string[]
    arrOfBgColors: string[]
    arrOfHeadings: { name: string, value: string[] }[]
    arrOfFontSizes: { name: string, value: string[] }[]
    arrOfFontFamily: { name: string, value: string[] }[]
    onInputAreaChange: () => void
    openDropDownMenu: string
    setOpenDropDownMenu: React.Dispatch<React.SetStateAction<string>>
};

const Textformat = ({
    arrOfFontColors,
    arrOfBgColors,
    arrOfHeadings,
    arrOfFontSizes,
    arrOfFontFamily,
    onInputAreaChange,
    openDropDownMenu, 
    setOpenDropDownMenu,
}: Props) => {
    const [currentFontFamily, setCurrentFontFamily] = useState(arrOfFontFamily?.[0].name);
    const [currentHeadings, setCurrentHeading] = useState(arrOfHeadings?.[0].name);
    const [currentFontSizes, setCurrentFontSize] = useState(arrOfFontSizes?.[2].name);

    const handleTextFormat = (cmd: string, value?: string[]) => {
        textFormatCmd(cmd, value ? value : []);
        onInputAreaChange();
        setOpenDropDownMenu('')
    };

    return <div id='inlineStyling' className="flex flex-wrap items-center justify-between gap-2">
        <div id="text-normal">
            <button onClick={() => handleTextFormat('normal', ['inline-block', 'font-normal', 'no-underline', 'not-italic'])} >
                Normal
            </button>
        </div>
        <div id="text-fontfamily">
            <button className='capitalize p-1  border cursor-pointer' onClick={() => { setOpenDropDownMenu('fontfamily') }}>
                {currentFontFamily}
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName={'fontfamily'}
                Children={<div className="w-full min-w-[100px] bg-white p-1 space-y-2 border shadow-sm" >
                    {
                        arrOfFontFamily &&
                            arrOfFontFamily.length ?
                            arrOfFontFamily.map(item =>
                                <button
                                    className="block"
                                    key={item.name}
                                    onClick={() => { handleTextFormat('fontfamily', item.value); setCurrentFontFamily(item.name) }} >
                                    {item.name}
                                </button>
                            ) :
                            null
                    }
                </div>}
            />
        </div>
        <div id="text-headers" className=''>
            <button className='capitalize p-1  border cursor-pointer' onClick={() => { setOpenDropDownMenu('headings') }}>
                {currentHeadings}
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName={'headings'}
                Children={<div className="w-full min-w-[100px] bg-white p-1 space-y-2 border shadow-sm" >
                    {
                        arrOfHeadings &&
                            arrOfHeadings.length ?
                            arrOfHeadings.map(item =>
                                <button
                                    className="block"
                                    key={item.name}
                                    onClick={() => { handleTextFormat('heading', item.value); setCurrentHeading(item.name) }} >
                                    {item.name}
                                </button>
                            ) :
                            null
                    }
                </div>}
            />
        </div>
        <div id="text-fontsize" className=''>
            <button className=' capitalize border p-1 cursor-pointer' onClick={() => { setOpenDropDownMenu('fontsize') }}>
                {currentFontSizes}
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName={'fontsize'}
                Children={<div className="w-full min-w-[60px] bg-white p-1 space-y-2 border shadow-sm" >
                    {
                        arrOfFontSizes &&
                            arrOfFontSizes.length ?
                            arrOfFontSizes.map(item =>
                                <button
                                    className="block"
                                    key={item.name}
                                    onClick={() => { handleTextFormat('fontsize', item.value); setCurrentFontSize(item.name) }} >
                                    {item.name}
                                </button>
                            ) :
                            null
                    }
                </div>}
            />
        </div>
        <div id="text-bold">
            <button onClick={() => handleTextFormat('font-bold')}><b>B</b></button>
        </div>
        <div id="text-italic" >
            <button onClick={() => handleTextFormat('italic')}><i>I</i></button>
        </div>
        <div id="text-underline" >
            <button onClick={() => handleTextFormat('underline')}><u>U</u></button>
        </div>
        <div id="text-lowercase" >
            <button onClick={() => handleTextFormat('lowercase')}>lowerCase</button>
        </div>
        <div id="text-capitalize" >
            <button onClick={() => handleTextFormat('capitalize')}>capitalize</button>
        </div>
        <div id="text-uppercase" >
            <button onClick={() => handleTextFormat('uppercase')}>upCase</button>
        </div>
        <div id="text-fontcolor" className='' >
            <button className='border p-1 cursor-pointer' onClick={() => { setOpenDropDownMenu('fontcolor') }}>
                fontColor
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName={'fontcolor'}
                Children={<div className="grid grid-cols-3 gap-2 min-w-[130px] bg-gray-100 p-1 border shadow-sm" >
                    {arrOfFontColors &&
                        arrOfFontColors.length ?
                        arrOfFontColors.map(item =>
                            <button
                                key={item}
                                className={`block h-[40px] w-[40px] ${item.split('-').map(item => item === 'text' ? 'bg' : item).join('-')} shadow-md`}
                                onClick={() => handleTextFormat('fontcolor', [item])}></button>
                        ) :
                        null
                    }
                </div>}
            />
        </div>
        <div id="text-backgroundcolor" className=''>
            <button className='border p-1 cursor-pointer' onClick={() => { setOpenDropDownMenu('bgcolor') }}>
                BgIcon
            </button>
            <Dropdownmenuwrapper
                openDropDownMenu={openDropDownMenu}
                menuName='bgcolor'
                Children={<div className="grid grid-cols-3 gap-2 min-w-[130px] bg-gray-100 p-1 border shadow-sm" >
                    {arrOfBgColors &&
                        arrOfBgColors.length ?
                        arrOfBgColors.map(item =>
                            <button
                                key={item}
                                className={`block h-[40px] w-[40px] ${item} shadow-md`}
                                onClick={() => handleTextFormat('bgcolor', [item])}></button>
                        ) :
                        null
                    }
                </div>}
            />
        </div>
    </div>
};

export default Textformat;
