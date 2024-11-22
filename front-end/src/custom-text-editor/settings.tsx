import { getSelection, insertSingleElementToTheDOM, resetSelections } from "./cmds";

export const createNewSpan = (): HTMLSpanElement => {
    const span = document.createElement('span');
    span.classList.add('editable');
    return span;
};

export const addSpanToInputAreaIfEmpty = (inputAreaRef: React.RefObject<HTMLDivElement>, value: string) => {
    const inputAreaHtmlEmpty = !inputAreaRef.current?.innerHTML.trim()

    if (inputAreaHtmlEmpty) {
        const parentSpan = createNewSpan();
        parentSpan.className = `parent-span block ${value}`;
        const childSpan = createNewSpan();
        childSpan.classList.add('child-span', 'editable', 'block');
        const initialEditableSpan = createNewSpan();
        initialEditableSpan.classList.add('editable', 'block');
        initialEditableSpan.innerHTML = "<br>";

        childSpan.append(initialEditableSpan);
        parentSpan.append(childSpan)
        inputAreaRef.current?.append(parentSpan);
    };
};

export const getCaretPosition = (element: Node) => {
    const selection = document.getSelection(); // get selected element or node
    if (!selection) return 0;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected range object 

        const preCaretRange = range.cloneRange(); // clone range
        preCaretRange.selectNodeContents(element); // select the entire content of the element
        preCaretRange.setEnd(range.endContainer, range.endOffset); // set the end to the caret position
        return preCaretRange.toString().length; // return the position number of caret in the input text editor area
    };
    return 0;
};

export const handleSpacialCharacters = (value: string[]) => {
    const selectedNode = getSelection(); // get the selected node properties

    if (selectedNode) {
        const { selection, range, node } = selectedNode;

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

        newElement.innerText = oldElement?.innerText || '<br>'; // add the selected element text to the new element
        newElement.classList.add('editable'); // add the selected element class names to the new element

        oldElement?.replaceWith(newElement); // replace unaccepted  html tag with new span
        range.setStartAfter(newElement); // set caret position inside the element
        selection.collapseToEnd(); // remove the selection highlight 
    };
};

export const deleteUnacceptedHtmlTag = () => {
    const selectedNode = getSelection(); // get the selected node properties
    const arrOfHmlTags: string[] = ['span', 'ul', 'ol', 'li', 'a', 'code', 'vidoe', 'source', 'img'];

    if (selectedNode) {
        const { selection, element } = selectedNode;
        if (!element) return;
        const elementName = element.nodeName.toLowerCase(); // get the element name

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

export const focusCaretOnInputArea = (contenteditableDiv: HTMLDivElement | null) => {
    const range = document.createRange();
    const selection = window.getSelection();
    if (!selection || !contenteditableDiv) return;

    resetSelections(selection, range, contenteditableDiv, 'start')
};

export const handleWhenPasteIntoInputArea = (e: React.ClipboardEvent<HTMLDivElement>) => { // filter a text pasted into the text area
    e.preventDefault();
    const selectedNode = getSelection(); // get the selected node properties
    if (!selectedNode) return;
    const { selection, range } = selectedNode;

    range.deleteContents();

    const clipBoard = e.clipboardData;
    const incomingData = clipBoard.getData('text/plain');
    const newTextNode = document.createTextNode(incomingData);
    insertSingleElementToTheDOM(newTextNode, range, selection);
};

export const deleteAll = (contenteditableDiv: HTMLDivElement | null) => {
    const parentSpan = contenteditableDiv?.firstElementChild;
    const childSpan = createNewSpan();
    childSpan.classList.add('child-span', 'editable', 'block');
    const initialEditableSpan = createNewSpan();
    initialEditableSpan.classList.add('editable', 'block');
    initialEditableSpan.innerHTML = "<br>";

    childSpan?.appendChild(initialEditableSpan);
    parentSpan?.replaceChildren(childSpan); // replace all chidspan children with  a new initialEditablespan
    focusCaretOnInputArea(contenteditableDiv); // place focus on input area
};
