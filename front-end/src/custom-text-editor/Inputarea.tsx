import { addSpanToInputAreaIfEmpty, handleSpacialCharacters, handleWhenPasteIntoInputArea } from "./settings";
import { getSelection, textFormatCmd } from "./cmds";
import { useSanitize } from "../hooks";

type Props = {
  placeHolder: string,
  displayPlaceHolder: boolean
  inputAreaIsEmpty: boolean
  InputWrapperClassName: string
  InputClassName: string
  createNewText: { IsNew: boolean, content?: { _html: string, text: string } }
  inputAreaRef: React.RefObject<HTMLDivElement>,
  onInputAreaChange: () => void,
  handleDisplayHistory: (direction: string) => void
};

const Inputarea = (
  {
    placeHolder = 'Start type...',
    displayPlaceHolder,
    inputAreaIsEmpty,
    InputWrapperClassName,
    InputClassName,
    createNewText = { IsNew: true, content: { _html: '', text: '' } },
    inputAreaRef,
    onInputAreaChange,
    handleDisplayHistory,
  }: Props
) => {

  const sanitizeHTML = useSanitize();

  const handleSpecialCharactersIsAvailable = (text: string) => {
    const getText = text.split('');
    const getLastValue = getText[getText.length - 1];

    if (getLastValue?.includes('@')) {
      handleSpacialCharacters(['font-bold']);
    } else if (getLastValue?.includes('#')) {
      handleSpacialCharacters(['text-blue-600']);
    };
  };

  const handleInsideSpecialCharacterElement = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selectedNode = getSelection()
    if (!selectedNode) return

    const { element } = selectedNode;

    if (element) {
      const getselectedElement: HTMLAnchorElement = element as HTMLAnchorElement
      const elementClassName = getselectedElement?.className;
      if (elementClassName?.includes('special-characters')) {
        if (e.key.trim() === "" || e.key === 'Enter') {
          getselectedElement.href = '#';
        };
      };

    };

  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (inputAreaIsEmpty === true) {
      if (e.key === 'Backspace') e.preventDefault();
    };
    handleInsideSpecialCharacterElement(e);
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      handleDisplayHistory('undo');
    } else if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      handleDisplayHistory('redo');
    } else if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      textFormatCmd('font-bold', []);
    };
  };

  const handleInput = () => {
    addSpanToInputAreaIfEmpty(inputAreaRef, InputClassName);
    onInputAreaChange();
    handleSpecialCharactersIsAvailable(inputAreaRef.current?.textContent?.trim() || '');
  };

  return <div className={`relative border ${InputWrapperClassName}`}>
    {displayPlaceHolder ?
      <span className='text-base first-letter:capitalize opacity-50 absolute'>
        {placeHolder}
      </span> :
      null}
    <div
      ref={inputAreaRef}
      className='outline-none'
      contentEditable
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={(e) => { handleWhenPasteIntoInputArea(e); onInputAreaChange() }}
      dangerouslySetInnerHTML={sanitizeHTML(`<span class="parent-span block ${InputClassName}">${!createNewText.IsNew &&
        createNewText.content?._html &&
        createNewText.content._html.trim() !== "" ?
        createNewText.content._html :
        `<span class="child-span editable block"><span class="editable block"><br></span></span>`}</span>`)}
    >
    </div>
  </div>
};

export default Inputarea;
