import Textarea from './text-area';
import Texteditor from './text-editor';
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
}

const Trythistexteditor = ({ editorParentWrapperStyle, textAreaStyle, placeHolder, textAreaConfig, toolBarConfig, setGetContent = () => null }: Prop) => {
    const [displayPlaceHolder, setDisplayPlaceHolder] = useState(placeHolder.trim() ? true : false);
    const textAreaRef = useRef<HTMLDivElement>(null);
    const historyRef = useRef<string[]>([]);
    const mouseLeaveTextAreaRef = useRef<boolean>(false);
    const historyMomoryIndexRef = useRef(0);
    const caretPostionsRef = useRef<number[]>([]);
    const typingTimeOutRef = useRef<number>();

    // create a new fuction for font type

    const handlePlaceHolder = () => {
        const editables = textAreaRef?.current?.firstElementChild?.childNodes as NodeListOf<HTMLSpanElement> || [];
        for (const element of editables) {
            const hasContent = element?.innerHTML?.replace("<br>", "") !== ""; // There is a content available in the textarea at least in one of the children initialSpan
            setDisplayPlaceHolder(hasContent ? false : true);
            if (hasContent) {
                break;
            };
        };
    };

    const HandleOnTextAreaChange = (content?: React.RefObject<HTMLElement | null>) => {

        clearTimeout(typingTimeOutRef.current);

        typingTimeOutRef.current = setTimeout(() => {
            if (!textAreaRef.current) return;
            historyRef.current.push(textAreaRef.current?.innerHTML);
            historyMomoryIndexRef.current = historyRef.current.length - 1;
            caretPostionsRef.current.push(getCaretPosition(textAreaRef.current));
        }, 400);

        handlePlaceHolder();

        if (!textAreaRef.current) return;
        setGetContent({
            _html: textAreaRef.current?.innerHTML,
            text: filterText(textAreaRef.current?.innerText),
        });
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

    useEffect(() => {
        HandleOnTextAreaChange();
     }, [textAreaConfig.addNew]);


    return <div
        className={editorParentWrapperStyle}
    >
        <Texteditor
            historyMomoryIndexRef={historyMomoryIndexRef}
            mouseLeaveTextAreaRef={mouseLeaveTextAreaRef}
            HandleOnTextAreaChange={HandleOnTextAreaChange}
            caretPostionsRef={caretPostionsRef}
            historyRef={historyRef}
            toolBarConfig={toolBarConfig}
            textAreaRef={textAreaRef}
        />
        <Textarea
            placeHolder={placeHolder}
            displayPlaceHolder={displayPlaceHolder}
            mouseLeaveTextAreaRef={mouseLeaveTextAreaRef}
            textAreaRef={textAreaRef}
            className={textAreaStyle}
            textAreaConfig={textAreaConfig}
            HandleOnTextAreaChange={HandleOnTextAreaChange}
        />
    </div>
};

export default Trythistexteditor;
