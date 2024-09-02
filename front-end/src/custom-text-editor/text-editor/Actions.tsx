
const handleInsertEleToDOM = (ele: HTMLElement | Text, range: Range, selection: Selection, caretPositionEle?: HTMLElement | Text) => {
    // Insert element to node
    range.insertNode(ele);

    // Reset the selection
    selection.removeAllRanges(); // ramove selections
    range.setEndAfter(caretPositionEle ? caretPositionEle : ele); // reset the caret position
    selection.addRange(range); // add the range back to the selection
    selection.collapseToEnd(); // remove the highted text and move the caret to the ending of the text
};

const formatText = (command: string = 'normal', value: string = '16px', selection: Selection) => {
    let ele: Node | null = null;

    if (command === 'link' && value) {

        const range = selection.getRangeAt(0);
        const element = range.startContainer.parentElement;
        const anchorElement = element instanceof HTMLAnchorElement;

        // If element is currently a anchor link, change the href link
        if (anchorElement &&
            element.href
        ) {
            element.href = value;

            ele = null;
        } else {

            // Create and style a new anchor link element
            const a = document.createElement('a');
            a.href = value;
            a.style.color = 'blue'
            a.style.textDecoration = 'underline'
            a.classList.add('anchorLink');

            ele = a;
        };

    } else {

        // Create and style a span element for inline styling
        const span = document.createElement('span');
        span.classList.add('editable');

        if (command === 'bold') {
            span.style.fontWeight = 'bold';
        } else if (command === 'italic') {
            span.style.fontStyle = 'italic';
        } else if (command === 'underline') {
            span.style.textDecoration = 'underline';
        } else if (command === 'upperCase') {
            span.style.textTransform = 'uppercase';
        } else if (command === 'lowerCase') {
            span.style.textTransform = 'lowercase';
        } else if (command === 'capitalize') {
            span.style.textTransform = 'capitalize';
        } else if (command === 'fontColor') {
            span.style.color = value;
        } else if (command === 'backGroundColor') {
            span.style.backgroundColor = value;
        } else if (command === 'fontSize') {
            span.style.fontSize = value;
            span.style.display = 'block';
        } else if (command === 'h1') {
            span.style.fontSize = '32px';
        } else if (command === 'h2') {
            span.style.fontSize = '24px';
        } else if (command === 'h3') {
            span.style.fontSize = '18.72px';
        } else if (command === 'h4') {
            span.style.fontSize = '16px';
        } else if (command === 'h5') {
            span.style.fontSize = '13.28px';
        } else if (command === 'h6') {
            span.style.fontSize = '10.76px';
        } else if (command === 'normal') {
            span.style.display = 'block';
            span.style.fontWeight = 'normal';
            span.style.fontStyle = 'normal';
            span.style.textDecoration = 'none';
            span.style.fontSize = value;
            span.style.color = 'rgb(0, 0, 0)';
            span.style.background = 'rgb(255, 255, 255)';
        };

        ele = span;
    };

    return ele;
};

export const handleDOMSelectionFormatText = (command: string = 'normal', value: string = '16px', selection: Selection | null) => {
    if (!selection) return;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        if (!range.collapsed) {
            const startNode = range.startContainer;
            const endNode = range.endContainer;

            let commonAncestor = range.commonAncestorContainer;
            let nodes: Node[] = [];

            // Get all text nodes within the selection
            const walker = document.createTreeWalker(
                commonAncestor,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function () {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let currentNode: Node | null = walker.currentNode;

            while (currentNode) {
                if (
                    (currentNode === startNode ||
                        currentNode === endNode ||
                        (walker.currentNode.nodeValue &&
                            walker.currentNode.nodeValue.trim())) &&
                    range.intersectsNode(currentNode)
                ) {
                    nodes.push(currentNode);
                }
                currentNode = walker.nextNode();
            }

            // Wrap each node in a span elemtent
            nodes.forEach(node => {

                if (node.parentElement?.classList.contains('editable')) {

                    // If only one line was selected wrapper the selected text
                    if (nodes.length <= 1) {
                        const ele = formatText(command, value, selection);

                        // If no selected element, return back
                        if (!ele) return;

                        // surround content selected with span element
                        range.surroundContents(ele);

                        // Reset the selection
                        selection.removeAllRanges();
                        range.setEndAfter(ele);
                        selection.addRange(range);
                        selection.collapseToEnd();
                    } else {

                        // If more than one line is selected wrapper the entire selected text
                        const ele = formatText(command, value, selection);
                        if (!ele) return;

                        const newRange = document.createRange();
                        newRange.selectNodeContents(node);

                        // surround all content selected with span element
                        newRange.surroundContents(ele);

                        // Reset the selection
                        selection.removeAllRanges();
                        range.setEndAfter(ele);
                        selection.addRange(range);
                        selection.collapseToEnd();
                    };

                } else {

                    // Just Call this function to reset anchor element href link even when to element is retun
                    formatText(command, value, selection);
                };

            });


        };

    };
};

export const handleDOMSelectionUnAnchorLink = (selection: Selection | null) => {

    if (selection) {
        const range = selection.getRangeAt(0);
        const node = range.startContainer;
        const element = node.parentElement;

        // Check if element selected is a anchor element
        if (element instanceof HTMLAnchorElement &&
            element?.classList.contains('anchorLink')
        ) {

            // Create and style span element
            const span = document.createElement('span');
            span.innerHTML = element.innerHTML;
            span.classList.add('editable');
            span.style.textDecoration = 'none';
            span.style.color = ''

            // Replace the current anchor element to a normal span element
            element.replaceWith(span);
        };

    };
};

export const handleDOMSelectionAlignText = (value: string = 'left', selection: Selection | null) => {
    const range = selection?.getRangeAt(0);
    if (!selection ||
        !range
    ) return;

    const element = range.startContainer.parentElement;

    if (element?.classList.contains('editable')) {
        // Position the text withen the span
        element.style.display = 'block';
        element.style.textAlign = value;
    };
};

export const handleDOMSelectionList = (type: string = 'ul', position: string, selection: Selection | null) => {
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const endNode = range.endContainer;

    // Create and style a new html elements of ul or ol
    let ul: HTMLElement = document.createElement(type || 'ul');
    ul.classList.add('editable');
    ul.style.listStyle = type === 'ul' ? 'disc' : 'decimal';
    ul.style.listStylePosition = position;
    ul.style.marginLeft = '20px';

    if (selection.rangeCount > 0) {

        // If text has been highlighted loop through all nodes
        if (!range.collapsed) {
            let commonAncestor = range.commonAncestorContainer;
            let nodes: Node[] = [];

            // Get all text nodes within the selection
            const walker = document.createTreeWalker(
                commonAncestor,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function () {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let currentNode: Node | null = walker.currentNode;

            while (currentNode) {
                if (
                    (currentNode === startNode ||
                        currentNode === endNode ||
                        (walker.currentNode.nodeValue &&
                            walker.currentNode.nodeValue.trim())) &&
                    range.intersectsNode(currentNode)
                ) {
                    nodes.push(currentNode);
                }
                currentNode = walker.nextNode();
            }

            // Wrapper each element with a html element list
            nodes.forEach((node, index) => {

                if (node.parentElement?.classList.contains('editable')) {
                    // Create a new html list
                    let li = document.createElement('li');
                    li.classList.add('editable');

                    // Get the node text
                    li.appendChild(node);
                    ul.append(li);

                    if (index === nodes.length - 1) {

                        // Insert the new  ul list to the range
                        handleInsertEleToDOM(ul, range, selection)
                    };
                };
            });


        } else { // When no text is highlighted wrapper the node in a ul list

            if (startNode.parentElement?.classList.contains('editable')) {
                // Create a new html list
                let li = document.createElement('li');
                li.classList.add('editable');

                // Get the node text
                li.appendChild(startNode);
                ul.append(li);

                // Insert the new  ul list to the range
                handleInsertEleToDOM(ul, range, selection)
            };
        };

    };
};

export const handleDOMSelectionEmoji = (emoji: string = '', selection: Selection | null) => {
    if (!selection?.rangeCount) return;
    const range = selection?.getRangeAt(0);
    if(!range) return;

    const node = range.startContainer;

    if (node.parentElement?.classList.contains('editable') ||
        node.parentElement?.classList.contains('codeModeChild')
    ) {
        // Create a new text node and insert emoji in the caret position
        const textNode = document.createTextNode(emoji);

        // Insert Image to the DOM
        handleInsertEleToDOM(textNode, range, selection);
    };
};

export const handleDOMSelectionEmbed = (embed: string, selection: Selection | null) => {
    if (!selection?.rangeCount) return;
    const range = selection?.getRangeAt(0);
    if(!range) return;

    const node = range.startContainer;

    if (node.parentElement?.classList.contains('editable')) {
        // Create a new span element and embed link into it
        const element = document.createElement('span');
        element.innerHTML = embed

        // Insert Image to the DOM
        handleInsertEleToDOM(element, range, selection);
    };
};

export const handleDOMSelectionImage = (url: string = '', alt: string = '', widthSize: string = '', heightSize: string = '', objectFit: string = '', selection: Selection | null) => {
    if (!selection?.rangeCount) return;
    const range = selection?.getRangeAt(0);
    if(!range) return;

    // Create and styel new image html elemwnt
    const img = document.createElement('img');
    img.style.display = 'inline';
    img.alt = alt;
    img.style.width = widthSize;
    img.style.height = heightSize;
    img.style.objectFit = objectFit;
    img.style.objectPosition = 'center';
    img.style.borderRadius = '10px';
    img.src = url;

    if (range.startContainer.parentElement?.classList.contains('editable')) {
        // Insert Image to the DOM
        handleInsertEleToDOM(img, range, selection);
    };
};

export const handleDOMSelectionVideo = (url: string = '', widthSize: string = '', heightSize: string = '', selection: Selection | null) => {
    if (!selection?.rangeCount) return;
    const range = selection?.getRangeAt(0);
    if(!range) return;

    // Create a new html vidoe element
    const video = document.createElement('video');
    video.style.display = 'inline';
    video.controls = true;
    video.style.width = widthSize;
    video.style.height = heightSize;
    video.style.borderRadius = '10px';

    // Create a new html source element 
    let source = document.createElement('source'); 
    source.src = url;
    video.appendChild(source);

    if (range.startContainer.parentElement?.classList.contains('editable')) {
        // Insert to element to the DOM
        handleInsertEleToDOM(video, range, selection);
    };
};

export const handleDOMSelectionCodeMode = (selection: Selection | null) => {
    if (!selection?.rangeCount) return;
    const range = selection?.getRangeAt(0);
    if(!range) return;

    // Create a new span hmtl element
    const codeMode = document.createElement('code');
    const codeModeChild = document.createElement('a');

    // Parent code mode element
    codeMode.classList.add('editable');
    codeMode.style.display = 'inline-flex';
    codeMode.style.flexDirection = 'column';
    codeMode.style.padding = '6px 10px';
    codeMode.style.borderRadius = '4px';
    codeMode.style.backgroundColor = 'black';
    codeMode.style.color = 'white';

    // Child code mode element
    codeModeChild.classList.add('codemode');
    codeModeChild.style.display = 'block';
    codeModeChild.style.backgroundColor = 'black'
    codeModeChild.style.textAlign = 'left'
    codeModeChild.innerHTML = `<br>`;

    // Append child code mode parent
    codeMode.appendChild(codeModeChild);

    if (range.startContainer.parentElement?.classList.contains('editable')) {
        //Insert elements to the DOM
        handleInsertEleToDOM(codeMode, range, selection, codeModeChild);
    };

};
