
export const Config1 = (textAreaRef: React.RefObject<HTMLElement | null>) => {
    const editorDiv = textAreaRef.current;
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
    editorDiv.insertBefore(span1, editorDiv.firstChild);
};

const htmlElementToRemove: string[] = [
    'div', 'i', 'u', 'font', 'b', 'h1', 'p', 'h2'
];

export const Config2 = () => {
    const selection = document.getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const element = range.startContainer.parentElement;
    const elementName = element?.nodeName.toLowerCase();

    const span = document.createElement('span');
    span.classList.add('editable');
    span.style.display = 'block';
    span.innerHTML = element?.innerHTML ? element?.innerHTML : `<br>`;

    // If any of this element is found in the editor text area replace them
    if (elementName &&
        (htmlElementToRemove.includes(elementName)) ||
        (elementName === 'span' && !element?.classList.contains('editable')) ||
        elementName === 'span' && element?.classList.contains('placeholder')
    ) {

        // Replace the elemeent with a custom  span
        element?.replaceWith(span);
        selection.removeAllRanges();
        range.setEndAfter(span);
        selection.addRange(range);
        selection.collapseToEnd();
    }
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

export const deleteAllText = (editorDiv: HTMLDivElement | null  ) => {
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