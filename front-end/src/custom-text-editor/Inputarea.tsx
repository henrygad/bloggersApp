import DOMPurify from "dompurify";
import { deleteUnacceptedHtmlTag, handleSpacialCharacters, selectedElement } from "./settings";

type Props = {
  placeHolder: string,
  displayPlaceHolder: boolean
  inputAreaIsEmpty: boolean
  createNewText: { IsNew: boolean, body: string }
  inputAreaRef: React.RefObject<HTMLDivElement>,
  onInputAreaChange: (content: React.RefObject<HTMLElement>) => void,
};

const Inputarea = (
  {
    placeHolder = 'Start type ...',
    displayPlaceHolder,
    inputAreaIsEmpty,
    createNewText,
    inputAreaRef,
    onInputAreaChange,
  }: Props
) => {

  const sanitizeHTML = (html: string) => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  };

  const handleSpecialCharactersIsAvailable = (text: string) => {
    const getText = text.split('');
    const getLastValue = getText[getText.length - 1];

    if (getLastValue.includes('@')) {
      handleSpacialCharacters(['font-bold']);
    } else if (getLastValue.includes('#')) {
      handleSpacialCharacters(['text-blue-600']);
    };
  };

  const handleInsideSpecialCharacterElement = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const getselectedElement: HTMLAnchorElement = selectedElement() as HTMLAnchorElement
    const elementClassName = getselectedElement?.className;
    if (elementClassName?.includes('special-characters')) {
      if (e.key.trim() === "" || e.key === 'Enter') {
        getselectedElement.href = '#';
      };
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (inputAreaIsEmpty === true) {
      if (e.key === 'Backspace') e.preventDefault();
    };
    handleInsideSpecialCharacterElement(e);
  };

  const handleInput = () => {
    onInputAreaChange(inputAreaRef);
    handleSpecialCharactersIsAvailable(inputAreaRef.current?.textContent || '');
  };

  return <div id='inputarea-wrapper' className="relative border p-3 " >
    {displayPlaceHolder ?
      <span className='text-base first-letter:capitalize opacity-50 absolute'>
        {placeHolder}
      </span> :
      null}
    <div
      id={'inputarea-for-text'}
      ref={inputAreaRef}
      className='outline-none'
      contentEditable
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={sanitizeHTML(`
        <span class="parent-span block min-h-[220px]">
        ${!createNewText.IsNew ? createNewText.body : `
          <span class="childSpan editable block">
            <span class="childSpan editable">
              <span class="childSpan editable">
                <br>
              </span>
            </span>
          </span>`
        }
        </span>`)}
    >
    </div>
  </div>
};

export default Inputarea;
