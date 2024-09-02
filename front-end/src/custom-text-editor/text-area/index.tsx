import React, { useEffect } from 'react'
import DOMPurify from 'dompurify';
import { Config1, Config2, Config3 } from './Config';


//  get all the texts from the paste clipbored and paste it to the textarea
// finish up with the action function and thier design



type Props = {
  displayPlaceHolder: boolean,
  className: string,
  textAreaConfig: { addNew: boolean, body?: string },
  textAreaRef: React.RefObject<HTMLDivElement>,
  mouseLeaveTextAreaRef: React.MutableRefObject<boolean>,
  HandleOnTextAreaChange: (content: React.RefObject<HTMLElement | null>) => void,
  placeHolder: string,
};

const Index = ({
  className,
  textAreaConfig = { addNew: true, body: '' },
  textAreaRef,
  displayPlaceHolder,
  mouseLeaveTextAreaRef,
  HandleOnTextAreaChange,
  placeHolder = 'start typing' }: Props) => {

  const snaitizeHTML = (html: string) => {
    return {
      __html: DOMPurify.sanitize(html)
    };
  };

  const handleKeyDown = (e: KeyboardEvent) => {
  };

  useEffect(() => {
    textAreaConfig.addNew && Config1(textAreaRef);
  }, [textAreaConfig.addNew])

  useEffect(() => {
    textAreaRef.current?.addEventListener('paste', (e) => {
      Config3(e);
      HandleOnTextAreaChange(textAreaRef);
    });
    return () => {
      textAreaRef.current?.removeEventListener('paste', (e) => {
        Config3(e);
        HandleOnTextAreaChange(textAreaRef);
      });
    };
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { innerHTML } = e.currentTarget;

    if (!innerHTML?.trim()) {
      Config1(textAreaRef);
    } else {
      Config2();
    };
    HandleOnTextAreaChange(textAreaRef);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (textAreaRef.current &&
      textAreaRef.current.contains(e.currentTarget)
    ) {
      mouseLeaveTextAreaRef.current = true;
    };
  };


  return <div className={`relative flex flex-col border ${className}`} >
    {displayPlaceHolder ? <span className=' text-base first-letter:capitalize opacity-50 absolute'>{placeHolder}</span> : null}
    <div
      className='flex-1 outline-none'
      ref={textAreaRef}
      contentEditable
      onInput={handleInput}
      onMouseLeave={handleMouseLeave}
      dangerouslySetInnerHTML={snaitizeHTML(!textAreaConfig.addNew ? textAreaConfig?.body || '' : '')}
    >
    </div>
  </div>
};


export default Index;
