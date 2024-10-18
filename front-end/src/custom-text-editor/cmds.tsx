import { createNewSpan, handleReplaceElement } from "./settings";

export const resetSelections = (selection: Selection, range: Range, element: HTMLElement | Text) => {
    selection.removeAllRanges(); // remove selection
    range.setStart(element, 0);// set caret position inside the element
    selection.addRange(range); // add the range object to the selection
    selection.collapseToEnd(); // remove the selection highlight 
};

export const insertSingleElementToTheDOM = (ele: HTMLElement | Text, range: Range, selection: Selection, alt?: HTMLElement | Text) => {
    range.insertNode(ele); // insert element to the dom
    console.log(alt)
    resetSelections(selection, range, alt ? alt : ele); // reset the selection
};

const getMultipleSelectedNodes = (range: Range) => {
    let nodes: Node[] = [];

    if (!range.collapsed) { // selected element must contain text
        const startNode = range.startContainer; // get the first node in the selection
        const endNode = range.endContainer; // get the last node in the selection
        let commonAncestor = range.commonAncestorContainer; // get the commonAncesstor of all selected node

        const walker = document.createTreeWalker( // fetch all text nodes within the selection
            commonAncestor,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function () {
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let currentNode: Node | null = walker.currentNode;

        while (currentNode) { // while currentNode has nodes push all the selected nodes or texts to the array of nodes
            if ((currentNode === startNode || currentNode === endNode || (walker.currentNode.nodeValue && walker.currentNode.nodeValue.trim())) &&
                range.intersectsNode(currentNode)) {
                nodes.push(currentNode);
            };
            currentNode = walker.nextNode();
        };

        return nodes;
    };

    return nodes;
};

export const textFormatCmd = (command: string, value: string[]) => {
    const selection = window.getSelection(); // get the selected element or text
    if (!selection) return;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected element range object
        const nodes = getMultipleSelectedNodes(range) // get all the selected nodes

        if (command.toLowerCase() === 'unlink') { // if cmd is to remove existing link
            const span = createNewSpan(); //  create new html span
            handleReplaceElement(span, selection);  // replace the selected anchor link to a span
            return; // return and don't run the rest of the code
        }

        const textFormat = () => {  // create new span or anchor element
            let element: HTMLSpanElement | HTMLAnchorElement = createNewSpan(); // create a new html span
            element.classList.add(command, ...value); // add list of class name to span clsss            

            if (command.toLowerCase() === 'link') { // if cmd is to create a link
                element = document.createElement('a'); // create html anchor tag
                if (element instanceof HTMLAnchorElement) {
                    element.href = value[0]; // add link
                    element.classList.add(command, ...value.filter((_, index) => index != 0))
                };
            };

            return element;
        };

        if (nodes.length) { // if multipes or a single element was selected and has text, loop through all nodes
            nodes.forEach(node => {
                const selecedElement = node.parentElement
                if (!selecedElement?.classList.contains('editable')) return;  // return if selected node is not an editable node

                const element = textFormat(); // create a new html element 

                if (nodes.length <= 1) { // when it only a single node text, wrapper the single node text

                    range.surroundContents(element);// surround content selected with span element
                    resetSelections(selection, range, element);// reset the selection
                } else { // when it more than a sinlge node inside the array of nodes, wrapper the entire node text

                    const newRange = document.createRange(); // create a new node object range for each node text
                    newRange.selectNodeContents(node); // add node to the new object range

                    newRange.surroundContents(element); // surround all content selected with span element
                    resetSelections(selection, newRange, element);// reset the selection
                };

            });
        } else { // if selected element has not text
            const node = range.startContainer; /// get the selected node
            const selecedElement = node.parentElement; //  get the parent element

            const element = textFormat(); // create a new html element 
            element.innerHTML = "&nbsp;" //'<br>';

            if (!selecedElement?.classList.contains('editable')) return; // return if selected node is not an editable node
            insertSingleElementToTheDOM(element, range, selection); // insert the hmtl lisiting style tag to the dom
        };
    };
};

export const alignTextCmd = (value: string[]) => {
    const selection = window.getSelection(); // get the selected element or text
    if (!selection) return; // return if no element is selected

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected range object
        const node = range.startContainer; // get node
        const element = node.parentElement; // get node parent element

        if (element?.classList.contains('editable')) { // element must be editable
            const classNames = element.className || ''; // get element class names
            element.classList.remove('text-left', 'text-center', 'text-right')
            if (classNames.includes('block')) { // check if element contains display block class name alread
                element.classList.add(...value); // only add other class name
            } else {
                element.classList.add('block', ...value); // add display block class names and other class name
            };
        };
    };
};

export const listingCmd = (type: string, value: string[]) => {
    const selection = window.getSelection(); // get the selected element or text
    if (!selection) return;

    const list: HTMLElement = document.createElement(type || 'ul'); // create html listing style
    list.classList.add('editable', type, ...value); // add editable class name and other class from the value array

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected element range object
        const nodes = getMultipleSelectedNodes(range) // get all the selected nodes

        if (nodes.length) { // if multipes or a single element was selected and has text, loop through all nodes
            nodes.forEach((node, index) => {
                if (node.parentElement?.classList.contains('editable')) {
                    let li = document.createElement('li'); //  create a html li tag for each node
                    li.classList.add('editable'); // add a editable class name to each li tag
                    li.appendChild(node); // insert each node into it own hmtl li tag
                    list.append(li); // insert all nodes to the hmtl lisiting style tag

                    if (index === nodes.length - 1) { // provided that all li have be added to the hmtl lisiting style tag
                        insertSingleElementToTheDOM(list, range, selection); // insert the hmtl lisiting style tag to the dom
                    };
                };
            });
        } else { // if selected element has not text
            const node = range.startContainer; /// get the selected node
            const element = node.parentElement; //  get the parent element

            if (element?.classList.contains('editable')) {
                let li = document.createElement('li'); //  create a html li tag
                li.classList.add('editable'); // add a editable class name to each li tag
                li.appendChild(node);
                list.append(li); // insert li tag to the hmtl lisiting style tag

                insertSingleElementToTheDOM(list, range, selection); // insert the hmtl lisiting style tag to the dom
            };
        };
    };
};

export const emojiCmd = (emoji: string) => {
    const selection = window.getSelection(); // get the selected element or text
    if (!selection) return;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected element range object
        const node = range.startContainer; /// get the selected node
        const element = node.parentElement; //  get the parent element

        if (element?.classList.contains('editable') ||
            element?.classList.contains('codeChild')) {

            const textNode = document.createTextNode(emoji); // create text node and insert emoji in the caret position
            insertSingleElementToTheDOM(textNode, range, selection); // insert emoji to the DOM
        };
    };
};

export const embedCmd = (embed: string) => {
    const selection = window.getSelection(); // get the selected element or text
    if (!selection) return;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected element range object
        const node = range.startContainer; /// get the selected node
        const element = node.parentElement; //  get the parent element

        if (element?.classList.contains('editable')) {
            const span = document.createElement('span'); // create a new html span  tag
            span.classList.add('editable'); // add editable class name to the htlm span
            span.append(embed); // embed string to htlm span tag
            insertSingleElementToTheDOM(span, range, selection); // insert embed string to the DOM
        };
    };

};

export const imageCmd = (src: string, alt: string, value: string[]) => {
    const selection = window.getSelection(); // get the selected element or text
    if (!selection) return;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected element range object
        const node = range.startContainer; /// get the selected node
        const element = node.parentElement; //  get the parent element

        if (element?.classList.contains('editable')) { // check if the selected element is editable
            const img = document.createElement('img'); // create a html img tag
            img.classList.add(...value); // add class name to the html img tag 
            img.alt = alt; // add alt tag to the image
            img.src = src; // add src url
            insertSingleElementToTheDOM(img, range, selection); // insert img tag to dom
        };
    };
};

export const videoCmd = (src: string, value: string[]) => {
    const selection = window.getSelection(); // get the selected element or text
    if (!selection) return;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected element range object
        const node = range.startContainer; /// get the selected node

        if (node.parentElement?.classList.contains('editable')) { // check if the selected element is editable
            const video = document.createElement('video'); // create a htlm video tag
            video.classList.add(...value); // add class name to the html video tag
            video.controls = true; // allow the html video tag to have control

            const source = document.createElement('source'); // create a htlm source tag
            source.src = src; // add src url
            video.appendChild(source); // append html sourcet to the video tag

            insertSingleElementToTheDOM(video, range, selection); // insert html vidoe tag to the dom
        };
    };

};

export const codeCmd = () => {
    const selection = window.getSelection(); // get the selected element or text
    if (!selection) return;

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // get the selected element range object
        const node = range.startContainer; /// get the selected node
        const element = node.parentElement; //  get the parent element

        if (element?.classList.contains('editable')) { // check if the selected element is editable
            const code = document.createElement('code'); // create a html code tag
            const codeClassName = ['code', 'flex-inline', 'flex-col', 'p-2', 'bg-black', 'text-white']; // array of class name for html code tag
            code.classList.add(...codeClassName); // add class name to code tag
            const a = document.createElement('a'); // create html anchor tag
            const aClassName = ['block', 'bg-black', 'text-left'];  // array of class name for html anchor tag
            a.classList.add(...aClassName); // add class name a tag
            a.innerHTML = `<br>`; // add a break tag to the anchor tag
            code.appendChild(a); // append the anchor tag to code tag

            insertSingleElementToTheDOM(code, range, selection); // insert html code tag to the dom
        };
    };
};
