import { insertSingleElementToTheDOM } from "./cmds";

export const createNewSpan = (): HTMLSpanElement => {
    const span = document.createElement('span');
    span.classList.add('editable');
    return span;
};

export const addSpanToInputWhenEmpty = (inputAreaRef: React.RefObject<HTMLDivElement>) => {
    const parentSpan = inputAreaRef.current?.firstElementChild;
    const parentSpanHtml = parentSpan?.innerHTML;
    const test = parentSpan?.textContent

    if (parentSpanHtml?.replace("<br>", "") === "") {
        const getBr = inputAreaRef.current?.firstChild?.firstChild
        if (!getBr) return;
        const span = createNewSpan();
        span.classList.add('childSpan', 'block');
        span.innerHTML = '<br>';

        inputAreaRef.current?.firstChild?.removeChild(getBr)
        inputAreaRef.current?.firstChild?.appendChild(span);
    };
};

export const selectedElement = () => {
    const selection = window.getSelection();
    if (!selection) return;
    let element: HTMLElement | null = null

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        element = range.startContainer.parentElement;
    };

    return element;
};

export const handleSpacialCharacters = (value: string[]) => {
    const selection = window.getSelection();
    if (!selection) return;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const node: Node = range.startContainer;
        const startOffSet = range.endOffset;
        const endOffSet = startOffSet - 1;

        const newRange = document.createRange();
        newRange.setStart(node, endOffSet);
        newRange.setEnd(node, startOffSet);
        const extactContent = newRange.extractContents();

        const anchor = document.createElement('a');
        anchor.classList.add('special-characters', ...value);
        anchor.appendChild(extactContent);
        insertSingleElementToTheDOM(anchor, newRange, selection);
    };

};

export const handleReplaceElement = (newElement: HTMLElement, selection: Selection | null) => {
    if (!selection) return; // return if not element is selected

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected range object
        const oldElement = range.startContainer.parentElement; // get the first element
        const classNames = oldElement?.className // get all class names
        const text = oldElement?.innerText; //get element text

        newElement.innerText = text || '<br>'; // add the selected element text to the new element
        newElement.classList.add('editable'); // add the selected element class names to the new element

        oldElement?.replaceWith(newElement); // replace unaccepted  html tag with new span
        range.setStartAfter(newElement); // set caret position inside the element
        selection.collapseToEnd(); // remove the selection highlight 
    };
};

export const deleteUnacceptedHtmlTag = () => {
    const selection = window.getSelection(); // get the selected element or text
    if (!selection) return;

    const arrOfHmlTags: string[] = ['span', 'ul', 'ol', 'li', 'a', 'code', 'vidoe', 'source', 'img'];

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected element range object
        const element = range.startContainer.parentElement; // get the selected element
        if (!element) return;
        const elementName = element?.nodeName.toLowerCase(); // get the element name

        if (!arrOfHmlTags.includes(elementName) ||
            (!element.className.includes('editable') &&
                !element.className.includes('special-characters') &&
                !element.className.includes('parent-span') &&
                !element.className.includes('link') &&
                !element.className.includes('code-mode'))) { // if element not an accepted arrOfHtmltags
            const span = createNewSpan(); // create a new span 
            handleReplaceElement(span, selection); // replace unaccepted  html tag with new span
        };
    };
};

export const focusCaretOnInputArea = (inputAreaRef: React.RefObject<HTMLDivElement>) => {
    inputAreaRef.current?.focus();
};

export const Config3 = (e: ClipboardEvent) => { // filter a text pasted into the text area
    e.preventDefault();
    const selection = document.getSelection(); // get the selection api
    if (!selection?.rangeCount) return; // return if nothing is selection
    const range = selection.getRangeAt(0); // get range
    if (!range) return;
    const span = document.createElement('span');
    span.classList.add('editable');

    const clipboardData = e.clipboardData;  // Get the clipboard data
    const pastedData = clipboardData?.getData('text/plain'); // or 'text/plain'

    span.innerHTML = pastedData || ''

    range.insertNode(span); // insert the new node (span) into the selected DOM
    selection.removeAllRanges(); // remove all selection
    range.setEndAfter(span); // reset the caret position in the DOM  
    selection.addRange(range); // add back the range to the selection
    selection.collapseToEnd(); // move the caret to the ending of the selected tex
};

export const deleteAllText = (editorDiv: HTMLDivElement | null) => {
    if (!editorDiv) return;

    const span1 = document.createElement('span');
    span1.classList.add('editable');
    span1.style.display = 'block';
    span1.style.position = 'relative';
    span1.id = 'initialSpan';
    span1.style.textWrap = 'wrap';

    const span2 = document.createElement('span');
    span2.style.display = 'block';
    span2.classList.add('editable');
    span2.innerHTML = `<br>`;

    span1.appendChild(span2);
    editorDiv.replaceChildren(span1);
};