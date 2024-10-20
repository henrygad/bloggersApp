import { useClickOutSide } from '../hooks';
import Embed from './action-buttons/Embedcode';
import Emojis from './action-buttons/Emojis';
import Image from './action-buttons/Image';
import Textalignment from './action-buttons/Textalignment';
import Textanchorlink from './action-buttons/Textanchorlink';
import Textformat from './action-buttons/Textformat';
import Textlisting from './action-buttons/Textlisting';
import Video from './action-buttons/Video';
import Writecode from './action-buttons/Writecode';
import Inputarea from './Inputarea';
import { deleteUnacceptedHtmlTag, focusCaretOnInputArea } from './settings';

import React, { useEffect, useRef, useState } from 'react';

type Prop = {
    editorParentWrapperStyle: string,
    textAreaStyle: string,
    placeHolder: string
    setGetContent?: React.Dispatch<React.SetStateAction<{
        _html: string;
        text: string;
    } | undefined>>
    textAreaConfig: { addNew: boolean, body: string }
    toolBarConfig?: {
        useToolBar: boolean,
        toolBarStyle?: string,
        inline?: {
            useInlineStyle: boolean,
            inlineStyle?: string,
        }
        anchorLink?: {
            useAnchorLink: boolean,
            anchorLinkStyle?: string
        }
        list?: {
            useList: boolean
            listStyle?: string
        }
        alignment?: {
            useAlignment: boolean,
            alignmentStyle?: string
        }
        emojis?: {
            useEmojis: boolean
            emojisStyle?: string
        }
        media?: {
            useMedia: boolean
            mediaStyle?: string
        }
        embedCode?: {
            useEmbedCode: boolean
            embedCodeStyle?: string
        }
        deleteAllText?: {
            useDeleteAllText: boolean
            useDeleteAllTextStyle?: string
        }
        history?: {
            useHistory: boolean
            historyStyle?: string
        }
    },
};

const App = ({ editorParentWrapperStyle, textAreaStyle, placeHolder, textAreaConfig, toolBarConfig, setGetContent = () => null }: Prop) => {
    const [displayPlaceHolder, setDisplayPlaceHolder] = useState(true);
    const [inputAreaIsEmpty, setInputAreaIsEmpty] = useState(true);
    const inputAreaRef = useRef<HTMLDivElement | null>(null);
    const historyRef = useRef<string[]>([]);
    const historyMomoryIndexRef = useRef(0);
    const caretPostionsRef = useRef<number[]>([]);
    const typingTimeOutRef = useRef<number>();

    const reftest = useRef(null);
    const [openDropDownMenu, setOpenDropDownMenu] = useState('');
    useClickOutSide(reftest, () => { setOpenDropDownMenu('') });

    const handleHistory = () => {
        clearTimeout(typingTimeOutRef.current);
        typingTimeOutRef.current = setTimeout(() => {
            if (!inputAreaRef.current) return;
            historyRef.current.push(inputAreaRef.current?.innerHTML);
            historyMomoryIndexRef.current = historyRef.current.length - 1;
            caretPostionsRef.current.push(getCaretPosition(inputAreaRef.current));
        }, 400);
    };

    const filterText = (text: string) => {
        return text.split('').map((word) => word === '\n' ? ' ' : word).join('');
    };

    const getCaretPosition = (element: Node) => {
        const selection = document.getSelection();
        if (!selection) return 0;

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            // Clone the range
            const preCaretRange = range.cloneRange();
            // Select the entire content of the element
            preCaretRange.selectNodeContents(element);
            // Set the end to the caret position
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            const caretOffset = preCaretRange.toString().length;

            return caretOffset;
        };

        return 0;
    };

    const handleInputAreaIsEmpty = () => {
        const parentSpan = inputAreaRef.current?.firstElementChild;
        const parentSpanChildren = parentSpan?.childNodes;
        const parentSpanTextContentIsEmpty = parentSpan?.textContent?.trim() === "";
        const parentSpanHtmlIsEmpty = parentSpan?.innerHTML.replace("<br>", "") === "";
        const parentSpanFirstElemntHtmlIsEmpty = parentSpan?.lastElementChild?.innerHTML.replace("<br>", "") === "";
        let isInputAreaEmpty = true;

        if (parentSpanTextContentIsEmpty &&
            (parentSpanHtmlIsEmpty || parentSpanFirstElemntHtmlIsEmpty)) {
            isInputAreaEmpty = true;
        } else {
            isInputAreaEmpty = false;
        };

        setDisplayPlaceHolder(isInputAreaEmpty);
        setInputAreaIsEmpty(isInputAreaEmpty && parentSpanChildren?.length === 1);
    };

    const onInputAreaChange = () => {
        handleInputAreaIsEmpty();
        if (inputAreaRef.current?.textContent?.trim()) {
            deleteUnacceptedHtmlTag();
        };
        setOpenDropDownMenu('')
    };

    useEffect(() => {
        focusCaretOnInputArea(inputAreaRef);
        onInputAreaChange();
    }, []);

    const arrOfEmojis = ['🙂', '😉', '😗', '😀', '😊', '😃', '😇', '😚', '😄', '😎', '😙', '😁', '🤓', '😅', '🧐', '😋', '😛', '😜', '🤪', '😝', '🤑', '😆', '🥳', '🤣', '🥰', '😂', '😍', '🙃', '🤩', '😘', '☺', '🥲', '©️',];
    const arrOfFontColors = ['text-gray-900', 'text-white', 'text-blue-800', 'text-green-700', 'text-red-600', 'text-purple-700', 'text-teal-700', 'text-yellow-600', 'text-gray-400', 'text-indigo-900', 'text-black', 'text-pink-800'];
    const arrOfBgColors = ['bg-gray-900', 'bg-white', 'bg-blue-800', 'bg-green-700', 'bg-red-600', 'bg-purple-700', 'bg-teal-700', 'bg-yellow-600', 'bg-gray-400', 'bg-indigo-900', 'bg-black', 'bg-pink-800'];
    const arrOfFontSizes = [
        { name: '12', value: ['text-xs'] },
        { name: '14', value: ['text-sm'] },
        { name: '16', value: ['text-base'] },
        { name: '18', value: ['text-lg'] },
        { name: '20', value: ['text-xl'] },
        { name: '24', value: ['text-2xl'] },
        { name: '30', value: ['text-3x1'] },
        { name: '36', value: ['text-4xl'] },
        { name: '48', value: ['text-5x1'] },
        { name: '69', value: ['text-6xl'] },
    ];
    const arrOfFontFamily = [
        { name: 'Arial', value: ['font-[Arial]'] },
        { name: 'Sans', value: ['font-sans'] },
        { name: 'Serif', value: ['font-serif'] },
        { name: 'Mono', value: ['font-mono'] },
        { name: 'Georgia', value: ['font-[Georgia]'] },
        { name: 'Cambria', value: ['font-[Cambria]'] },
        { name: 'Monospace', value: ['font-[monospace]'] },
        { name: 'Sans Serif', value: ['font-[sans-serif]'] },
    ];
    const arrOfHeadings = [
        { name: 'Paragraph', value: ['text-base',] },
        { name: 'H1', value: ['text-5xl',] },
        { name: 'H2', value: ['text-4xl',] },
        { name: 'H3', value: ['text-3xl',] },
        { name: 'H4', value: ['text-2xl',] },
        { name: 'H5', value: ['text-xl',] },
        { name: 'H6', value: ['text-lg',] },
    ];


    return <div
        id={''}
        className={`${editorParentWrapperStyle} `}
        ref={reftest}
    >
        <div className='flex flex-wrap gap-2'>
            <Textformat
                arrOfFontColors={arrOfFontColors}
                arrOfBgColors={arrOfBgColors}
                arrOfHeadings={arrOfHeadings}
                arrOfFontSizes={arrOfFontSizes}
                arrOfFontFamily={arrOfFontFamily}
                onInputAreaChange={onInputAreaChange}
                openDropDownMenu={openDropDownMenu}
                setOpenDropDownMenu={setOpenDropDownMenu}
            />
            <Textalignment
                onInputAreaChange={onInputAreaChange}
            />
            <Textlisting
                onInputAreaChange={onInputAreaChange}
            />
            <Textanchorlink
                onInputAreaChange={onInputAreaChange}
                openDropDownMenu={openDropDownMenu}
                setOpenDropDownMenu={setOpenDropDownMenu}
            />
            <Emojis
                arrOfEmojis={arrOfEmojis}
                onInputAreaChange={onInputAreaChange}
                openDropDownMenu={openDropDownMenu}
                setOpenDropDownMenu={setOpenDropDownMenu}
            />
            <Writecode
                onInputAreaChange={onInputAreaChange}
            />
            <Image
                onInputAreaChange={onInputAreaChange}
                openDropDownMenu={openDropDownMenu}
                setOpenDropDownMenu={setOpenDropDownMenu}
            />
            <Video
                onInputAreaChange={onInputAreaChange}
                openDropDownMenu={openDropDownMenu}
                setOpenDropDownMenu={setOpenDropDownMenu}
            />
            <Embed
                onInputAreaChange={onInputAreaChange}
                openDropDownMenu={openDropDownMenu}
                setOpenDropDownMenu={setOpenDropDownMenu}
            />
        </div>
        <Inputarea
            displayPlaceHolder={displayPlaceHolder}
            inputAreaIsEmpty={inputAreaIsEmpty}
            placeHolder="Start  typing..."
            createNewText={{ IsNew: true, body: '' }}
            inputAreaRef={inputAreaRef}
            onInputAreaChange={onInputAreaChange}
        />
    </div>
};

export default App;



/* 
 const parentSpan = inputAreaRef.current?.firstElementChild; // get input area parent span
        const parentSpanTextContent = parentSpan?.textContent
        const parentSpanChildren = parentSpan?.children // get span children
        const textContentIsNotEmpty = parentSpanTextContent?.trim() !== "";

        console.log(textContentIsNotEmpty)

        if (!parentSpanChildren) return;

        for (const element of parentSpanChildren) {
            const htlmIsNotEmpty = element.innerHTML.replace("<br>", "") !== "" &&
                element.lastElementChild?.innerHTML.replace("<br>", "") !== ""; // find atleast one element that is truly not empty   

            if (textContentIsNotEmpty && htlmIsNotEmpty) { // if one element is not empty
                setDisplayPlaceHolder(false); // don't display placeholder 
                return; // return if one element is found to be not empty
            };

            setDisplayPlaceHolder(true); // display placeholder if all available element is empty
        };

*/
