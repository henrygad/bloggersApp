import React, { useEffect, useRef, useState } from 'react'
import {
    handleDOMSelectionFormatText,
    handleDOMSelectionAlignText,
    handleDOMSelectionList,
    handleDOMSelectionEmoji,
    handleDOMSelectionImage,
    handleDOMSelectionVideo,
    handleDOMSelectionEmbed,
    handleDOMSelectionUnAnchorLink,
    handleDOMSelectionCodeMode,
} from '../cmds';
import Dropdownmenuwrapper from '../assests/Dropdownmenuwrapper';
import { deleteAllText } from '../text-area/Config';

const index = () => {
    const currentSelectionRef = useRef<Selection | null>(null);
    const [openDropDownMenu, setOpenDropDownMenu] = useState('');
    const [imageObjectFitChecked, setImageObjectFitChecked] = useState('contain');
    const [currentHeading, setCurrentHeading] = useState('normal');
    const [currentFontSize, setCurrentFontSize] = useState('90');
    const [link, setLink] = useState('');
    const [image, setImage] = useState({
        url: '',
        localUrl: '',
        alt: '',
        width: '250',
        height: '100',
        objectFit: 'contain'
    });
    const [video, setVideo] = useState({
        url: '',
        localUrl: '',
        width: '450',
        height: '',
        alt: '',
        objectFit: ''
    });
    const [embedCode, setEmbedCode] = useState('');
    const arrColors = [
        '#FFFFFF', '#FFFF00',
        '#FF0000', '#00A86B',
        '#0000FF', '#F0E68C',
        '#00FFFF', '#00FF00',
        '#00008B', '#FF00FF',
        '#50C878', '#000080',
        '#FFA500',
        '#008000', '#800080',
        '#FF69B4', '#51484F',
        '#4B0082', '#E0115F',
        '#C0C0C0', '#008080',
        '#3F00FF', '#EE82EE',
        '#0014A8',
    ];
    const arrEmojis = [
        '🙂', '😉', '😗',
        '😀', '😊', '☺',
        '😃', '😇', '😚',
        '😄', '😎', '😙',
        '😁', '🤓', '🥲',
        '😅', '🧐', '😋',
        '😛', '😜', '🤪',
        '😝', '🤑', '😆',
        '🥳', '🤣', '🥰',
        '😂', '😍', '🙃',
        '🤩', '©️', '😘',
    ];
    const arrHeading = [
        'normal',
        'h1',
        "h2",
        'h3',
        'h4',
        'h5',
        'h6',
    ];
    const arrFontSizes = [
        '90', '80', '70', '60', '50',
        '40', '36', '32', '30', '24',
        '22', '18', '16', '14', '12', '11'
    ];

    const handleSelectChange = () => {
        const selection = document.getSelection();
        currentSelectionRef.current = selection;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) &&
            e.key === 'z') {
            e.preventDefault();
            handleDisplayHistory('undo');
        } else if ((e.ctrlKey || e.metaKey) &&
            e.key === 'y') {
            e.preventDefault();
            handleDisplayHistory('redo');
        } else if ((e.ctrlKey || e.metaKey) &&
            e.key === 'b') {
            e.preventDefault();
            handleInlineStyle('bold');

        }
    };

    useEffect(() => {
        textAreaRef.current?.addEventListener('keydown', handleKeyDown);
        // window.addEventListener('keydown', handleKeyDown)
        document.addEventListener('selectionchange', handleSelectChange);
        return () => {
            textAreaRef.current?.removeEventListener('keydown', handleKeyDown);
            //window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('selectionchange', handleSelectChange);
        };
    }, []);

    const handleInlineStyle = (command: string = 'normal', value: string = "16px") => {
        if (!mouseLeaveTextAreaRef.current) return;

        handleDOMSelectionFormatText(command, value, currentSelectionRef.current);

        HandleOnTextAreaChange(textAreaRef);
    };

    const handleAddAnchoLInk = (command: string = 'link', value: string = '') => {
        if (!mouseLeaveTextAreaRef.current) return;

        if (command === 'link') {
            value &&
                handleDOMSelectionFormatText(command, value, currentSelectionRef.current);
        } else {
            handleDOMSelectionUnAnchorLink(currentSelectionRef.current);
        };

        HandleOnTextAreaChange(textAreaRef);
    };

    const handleListing = (command: string = 'ul') => {
        if (!mouseLeaveTextAreaRef.current) return;

        if (command === 'ul') {
            handleDOMSelectionList(command, 'outside', currentSelectionRef.current);
        } else {
            handleDOMSelectionList(command, 'outside', currentSelectionRef.current);
        };

        HandleOnTextAreaChange(textAreaRef);
    };

    const handleAlignment = (command: string = 'left') => {
        if (!mouseLeaveTextAreaRef.current) return;

        if (command === 'left') {
            handleDOMSelectionAlignText(command, currentSelectionRef.current);
        } else if (command === 'center') {
            handleDOMSelectionAlignText(command, currentSelectionRef.current);
        } else {
            handleDOMSelectionAlignText(command, currentSelectionRef.current);
        };

        HandleOnTextAreaChange(textAreaRef);
    };

    const handleEmojis = (value: string = '😊') => {
        if (!mouseLeaveTextAreaRef.current) return;
        handleDOMSelectionEmoji(value, currentSelectionRef.current);

        HandleOnTextAreaChange(textAreaRef);
    };

    const handleMedia = (command: string = 'image', media = { url: '', localUrl: '', alt: '', width: 'auto', height: 'auto', objectFit: 'contain' }) => {
        if (!mouseLeaveTextAreaRef.current) return;

        if (command === 'image') {
            handleDOMSelectionImage(media.url || media.localUrl, media.alt, media.width + 'px', media.height + 'px', media.objectFit, currentSelectionRef.current)
        } else if (command === 'video') {
            handleDOMSelectionVideo(media.url || media.localUrl, media.width + 'px', media.height + 'px', currentSelectionRef.current)
        };

        HandleOnTextAreaChange(textAreaRef);
    };

    const handleEmbedCode = (command: string = 'internal', value: string = '') => {
        if (!mouseLeaveTextAreaRef.current) return;

        if (command === 'external' &&
            value &&
            value.includes('<iframe')
        ) {
            handleDOMSelectionEmbed(value, currentSelectionRef.current);
        } else if (command === 'internal') {
            handleDOMSelectionCodeMode(currentSelectionRef.current);
        };

        HandleOnTextAreaChange(textAreaRef);
    };

    const handleDeleteAllText = (textAreaRef: React.RefObject<HTMLElement | null>) => {
        deleteAllText(textAreaRef.current as HTMLDivElement);

        HandleOnTextAreaChange(textAreaRef);
    };

    const handleDisplayHistory = (command: string) => {
        if (!textAreaRef.current) return;

        if (command === 'undo') {
            if (historyMomoryIndexRef.current <= 0) return;
            historyMomoryIndexRef.current -= 1;
            textAreaRef.current.innerHTML = historyRef.current[historyMomoryIndexRef.current];
            setCaretPosition(caretPostionsRef.current[historyMomoryIndexRef.current]);
        } else {
            if (historyMomoryIndexRef.current >= historyRef.current.length - 1) return;
            historyMomoryIndexRef.current += 1;
            textAreaRef.current.innerHTML = historyRef.current[historyMomoryIndexRef.current];
            setCaretPosition(caretPostionsRef.current[historyMomoryIndexRef.current]);
        };
    };

    const setCaretPosition = (position: number) => {
        const selection = window.getSelection();
        const range = document.createRange();

        // Traverse the element's child nodes to find the text node and set the caret position
        let charCount = 0;
        let found = false;

        (function traverseNodes(node: Node | null) {
            if (found ||
                !node ||
                !node.textContent
            ) return;

            if (node.nodeType === Node.TEXT_NODE) {
                const nextCharCount = charCount + node.textContent?.length;
                if (position <= nextCharCount) {
                    range.setStart(node, position - charCount);
                    range.collapse(true);
                    found = true;
                }
                charCount = nextCharCount;
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    traverseNodes(node.childNodes[i]);
                };
            }
        })(textAreaRef.current);

        if (found) {
            selection?.removeAllRanges();
            selection?.addRange(range);
        };
    };

    const handleGetLocalMedia = (e: React.ChangeEvent<HTMLInputElement>, fileType: string = 'image') => {
        if (!e.target.files) return;
        let file: Blob | undefined = e.target.files[0];

        const promise = new Promise((resolve: (value: string | ArrayBuffer) => void, reject: (value: string) => void) => {
            if (file) {
                const readFile = new FileReader();
                readFile.readAsDataURL(file); // To read the file data in a base64-encoded string that represents the file data
                //const imageUrl = URL.createObjectURL(file); // To creata a url for a file
                //readFile.readAsArrayBuffer(file); // To read the file as Blob i a binary format


                readFile.onload = function (e) {
                    if (e.target?.result) {
                        resolve(e.target.result);
                        //const fileBlob = new Blob([e.target.result], {type: file.type}); // To create the file into a binary format which can be uploader to the server
                    } else {
                        reject('error: no url data found');
                    };
                };
            } else {
                reject('error: no file found');
            };

        })

        promise
            .then((value) => {
                if (fileType === 'image') setImage({ ...image, localUrl: value.toString(), url: '' });
                else if (fileType === 'video') setVideo({ ...video, localUrl: URL.createObjectURL(file), url: '' })
            })
            .catch((error) => console.error(error));
    };


    return <div className="" >
            <div id='inlineStyling' className="flex flex-wrap items-center justify-between gap-3" >
                <div id="headers" className=''>
                    <button className='capitalize p-1  border cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'headers' ? '' : 'headers') }}>
                        {currentHeading}
                    </button>
                    <Dropdownmenuwrapper openDropDownMenu={openDropDownMenu} menuName={'headers'} Children={<div className='grid gap-3'>
                        {arrHeading &&
                            arrHeading.length &&
                            arrHeading.map((item, index) =>
                                <button className='border-b capitalize ' key={item} onClick={() => {
                                    handleInlineStyle(item);
                                    setCurrentHeading(item);
                                }} >{item}</button>
                            )}
                    </div>} />
                </div>
                <button onClick={() => handleInlineStyle('bold')}><b>B</b></button>
                <button onClick={() => handleInlineStyle('italic')}><i>I</i></button>
                <button onClick={() => handleInlineStyle('underline')}><u>U</u></button>
                <button onClick={() => handleInlineStyle('lowerCase')}>lowerCase</button>
                <button onClick={() => handleInlineStyle('upperCase')}>upCase</button>
                <button onClick={() => handleInlineStyle('capitalize')}>capitalize</button>
                <div id="fontSize" className=''>
                    <button className=' capitalize border p-1 cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'fontSize' ? '' : 'fontSize') }}>
                        {currentFontSize}
                    </button>
                    <Dropdownmenuwrapper openDropDownMenu={openDropDownMenu} menuName={'fontSize'} Children={<div className='grid gap-3'>
                        {arrFontSizes &&
                            arrFontSizes.length &&
                            arrFontSizes.map((item, index) =>
                                <button className='border-b capitalize ' key={item} onClick={() => {
                                    handleInlineStyle('fontSize', item + 'px');
                                    setCurrentFontSize(item);
                                }} >{item}</button>
                            )}
                    </div>} />
                </div>
                <div id="fontColor" className='' >
                    <button className='border p-1 cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'fontColor' ? '' : 'fontColor') }}>
                        fontColor
                    </button>
                    <Dropdownmenuwrapper openDropDownMenu={openDropDownMenu} menuName={'fontColor'} Children={
                        <div className='grid grid-cols-4 gap-2 min-w-[160px] '>
                            {
                                arrColors &&
                                arrColors.length &&
                                arrColors.map((item) =>
                                    <button
                                        key={item}
                                        style={{ backgroundColor: item }}
                                        className='flex justify-center items-center w-[30px] h-[30px] cursor-pointer'
                                        onClick={() => handleInlineStyle('fontColor', item)}
                                    ></button>
                                )
                            }
                        </div>} />
                </div>
                <div id="backGroundColor" className=''>
                    <button className='border p-1 cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'backGoundColor' ? '' : 'backGoundColor') }}>
                        BgIcon
                    </button>
                    <Dropdownmenuwrapper openDropDownMenu={openDropDownMenu} menuName='backGoundColor' Children={
                        <div className=' grid grid-cols-4 gap-2  min-w-[160px] border '>
                            {
                                arrColors &&
                                arrColors.length &&
                                arrColors.map((item) =>
                                    <button
                                        key={item}
                                        className='flex justify-center items-center w-[30px] h-[30px] cursor-pointer'
                                        style={{ backgroundColor: item }}
                                        onClick={() => handleInlineStyle('backGroundColor', item)}
                                    ></button>
                                )
                            }
                        </div>
                    } />

                </div>
            </div>
            <div id='alignment' className='flex flex-wrap items-center justify-between gap-3'>
                <button onClick={() => handleAlignment('left')}>Left</button>
                <button onClick={() => handleAlignment('center')}>Center</button>
                <button onClick={() => handleAlignment('right')}>Right</button>
            </div>
            <div id='listings' className='flex flex-wrap items-center justify-between gap-3'>
                <button onClick={() => handleListing('ul')}>ul</button>
                <button onClick={() => handleListing('ol')}>ol</button>
            </div>
            <div id="emojis" className=''>
                <button className='border p-1 cursor-pointer' onClick={() => { setOpenDropDownMenu(openDropDownMenu === 'emojis' ? '' : 'emojis') }}>
                    😊
                </button>
                <Dropdownmenuwrapper openDropDownMenu={openDropDownMenu} menuName='emojis' Children={
                    <div className='grid grid-cols-5 gap-2 min-w-[160px] ' >
                        {
                            arrEmojis &&
                            arrEmojis.length &&
                            arrEmojis.map((item) =>
                                <button
                                    key={item}
                                    className="flex justify-center items-center w-[30px] h-[30px] cursor-pointer"
                                    onClick={() => handleEmojis(item)}
                                >{item}</button>
                            )
                        }
                    </div>
                } />
            </div>
            <div id='anchorLink' className='flex flex-wrap items-center justify-between gap-3'>
                <div id='linked'>
                    <button className='border p-1 cursor-pointer' onClick={() => setOpenDropDownMenu(openDropDownMenu === 'link' ? '' : 'link')}>A</button>
                    <Dropdownmenuwrapper openDropDownMenu={openDropDownMenu} menuName='link' Children={
                        <div className=' flex flex-col gap-2'>
                            <label className='text-base' htmlFor="anchorLink">
                                Anchor link
                                <input type="text"
                                    className='mt-1 px-2 py-[.2rem] border text-blue-700 border-blue-400 outline-none rounded'
                                    placeholder='add link...'
                                    name='anchorLink'
                                    id='anchorLink'
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                                {!link ? <span className='text-red-800 text-sm -mt-2'>no link available</span> : null}
                            </label>
                            <div className='flex justify-end items-center gap-3 '>
                                <button className='px-2 py-[.2rem] bg-red-800 text-white rounded ' onClick={() => setOpenDropDownMenu('')}>Close</button>
                                <button className='px-2 py-[.2rem] bg-green-800 text-white rounded ' onClick={() => handleAddAnchoLInk('link', link)} >Create link</button>
                            </div>
                        </div>
                    } />
                </div>
                <button id='unlink' className='' onClick={() => handleAddAnchoLInk('unlink')}> <strike>A</strike> </button>
            </div>
            <div id='media' className='flex flex-wrap items-center justify-between gap-3'>
                <div id='image'>
                    <button className='border p-1 cursor-pointer' onClick={() => setOpenDropDownMenu(openDropDownMenu === 'image' ? '' : 'image')}>img</button>
                    <Dropdownmenuwrapper openDropDownMenu={openDropDownMenu} menuName='image' Children={
                        <div className='space-y-5 min-w-[240px] max-w-[240px]'>
                            <div className='space-y-3'>
                                <label htmlFor="imageUrl" className='text-base'>
                                    Add url
                                    <input type="text"
                                        className='block text-sm mt-2 px-2 py-[.2rem] border text-blue-700 border-blue-400 outline-none rounded'
                                        placeholder='https://www.yourimagelink.com...'
                                        id='imageUrl'
                                        name='imageUrl'
                                        value={image.url}
                                        onChange={(e) => setImage({ ...image, url: e.target.value, localUrl: '' })}
                                    />
                                </label>
                                <div className='text-1xl font-bold'>
                                    Or
                                </div>
                                <label className='text-base' htmlFor="localFileImage">
                                    Choose from computer
                                    <div className='relative mt-1'>
                                        <div className='h-[50px] w-[50px] bg-gray-600 '></div>
                                        <input
                                            id='localFileImage'
                                            type="file"
                                            name='localFileImage'
                                            accept="image/png, image/gif, image/jpeg"
                                            onChange={(e) => handleGetLocalMedia(e, 'image')}
                                            className='absolute top-0 right-0 left-0 bottom-0 opacity-0 cursor-pointer'
                                        />
                                    </div>
                                </label>
                            </div>
                            <div className='space-y-4'>
                                <label className='block text-sm' htmlFor="imageAlt">
                                    Alt
                                    <input type="text"
                                        id='imageAlt'
                                        name='imageAlt'
                                        placeholder='This image...'
                                        className='block text-sm min-w-[120px] max-w-[120px] outline-none border border-gray-500 px-2 py-[.2rem] rounded'
                                        value={image.alt}
                                        onChange={(e) => setImage({ ...image, alt: e.target.value })}
                                    />
                                </label>
                                <div className='flex items-center gap-3'>
                                    <label className='block text-sm' htmlFor="imageWidth">
                                        Width
                                        <input type="number"
                                            id='imageWidth'
                                            name='imageWidth'
                                            placeholder='auto'
                                            className='block text-sm min-w-[50px] max-w-[50px] outline-none border border-gray-500 px-1 py-[.2rem] rounded'
                                            value={image.width}
                                            onChange={(e) => setImage({ ...image, width: e.target.value })}
                                        />
                                    </label>
                                    <label className='block text-sm' htmlFor="imageHeight">
                                        Height
                                        <input type="number"
                                            id="imageHeight"
                                            name="imageHeight"
                                            placeholder='auto'
                                            className='block text-sm min-w-[50px] max-w-[50px] outline-none border border-gray-500 px-1 py-[.2rem] rounded'
                                            value={image.height}
                                            onChange={(e) => setImage({ ...image, height: e.target.value })}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className='flex item-center gap-5'>
                                <label className='block text-sm' htmlFor="imageContain" >
                                    Contain
                                    <input type="checkbox"
                                        id='imageContain'
                                        name='imageContain'
                                        value='contain'
                                        checked={imageObjectFitChecked === 'contain' ? true : false}
                                        onChange={(e) => {
                                            setImageObjectFitChecked('contain');
                                            setImage({ ...image, objectFit: e.target.value });
                                        }}
                                        className='block cursor-pointer'
                                    />
                                </label>
                                <label className='block text-sm' htmlFor="imageCover" >
                                    Conver
                                    <input type="checkbox"
                                        id='imageCover'
                                        name='imageCover'
                                        value='cover'
                                        checked={imageObjectFitChecked === 'cover' ? true : false}
                                        onChange={(e) => {
                                            setImageObjectFitChecked('cover');
                                            setImage({ ...image, objectFit: e.target.value });
                                        }}
                                        className='block cursor-pointer'
                                    />
                                </label>
                                <label className='block text-sm' htmlFor="imageFill" >
                                    Fill
                                    <input type="checkbox"
                                        id='imageFill'
                                        name='imageFill'
                                        value='fill'
                                        checked={imageObjectFitChecked === 'fill' ? true : false}
                                        onChange={(e) => {
                                            setImageObjectFitChecked('fill');
                                            setImage({ ...image, objectFit: e.target.value });
                                        }}
                                        className='block cursor-pointer'
                                    />
                                </label>
                            </div>
                            <div>
                                <img
                                    id='previewImage'
                                    src={image.url || image.localUrl}
                                    className='h-[100px] w-[100px] bg-gray-200'
                                    style={{ objectFit: image.objectFit }}
                                    onError={(e) => {
                                        if (e.target instanceof HTMLImageElement) {
                                            e.target.src = ''
                                        };
                                    }}
                                    onLoad={(e) => console.log('loading')}
                                />
                            </div>
                            <div className='flex justify-end items-center gap-3 '>
                                <button className='px-2 py-[.2rem] bg-red-800 text-white rounded ' onClick={() => setOpenDropDownMenu('')}>Close</button>
                                <button className='px-2 py-[.2rem] bg-green-800 text-white rounded ' onClick={() => (image.url || image.localUrl) && handleMedia('image', image)} >Add image</button>
                            </div>
                        </div>
                    } />
                </div>
                <div id='video'>
                    <button className='border p-1 cursor-pointer' onClick={() => setOpenDropDownMenu(openDropDownMenu === 'video' ? '' : 'video')}>video</button>
                    <Dropdownmenuwrapper openDropDownMenu={openDropDownMenu} menuName='video' Children={
                        <div className='space-y-5 min-w-[240px] max-w-[240px]'>
                            <div className='space-y-3'>
                                <label htmlFor="videoUrl" className='block text-base'>
                                    Add url
                                    <input type="text"
                                        className='block text-sm mt-2 px-2 py-[.2rem] border text-blue-700 border-blue-400 outline-none rounded'
                                        placeholder='https://www.yourvideolink.com...'
                                        id='videoUrl'
                                        name='videoUrl'
                                        value={video.url}
                                        onChange={(e) => setVideo({ ...video, url: e.target.value, localUrl: '' })}
                                    />
                                </label>
                                <div className='text-1xl font-bold'>
                                    Or
                                </div>
                                <label htmlFor="localVideoFile" className='text-base'>
                                    Choose from computer
                                    <div className='relative mt-1'>
                                        <div className='h-[50px] w-[50px] bg-gray-600' ></div>
                                        <input
                                            id='localVideoFile'
                                            type="file"
                                            name='localVideoFile'
                                            accept="video/*"
                                            onChange={(e) => handleGetLocalMedia(e, 'video')}
                                            className='absolute top-0 right-0 left-0 bottom-0 opacity-0 cursor-pointer'
                                        />
                                    </div>
                                </label>
                            </div>
                            <div className='flex items-center gap-3'>
                                <label className='text-sm' htmlFor="videoWidth">
                                    Width
                                    <input type="number"
                                        id='videoWidth'
                                        name='videoWidth'
                                        placeholder='auto'
                                        className='block text-sm min-w-[50px] max-w-[50px] outline-none border border-gray-500 px-1 py-[.2rem] rounded'
                                        value={video.width}
                                        onChange={(e) => setVideo({ ...video, width: e.target.value })}
                                    />
                                </label>
                                <label className='text-sm' htmlFor="videoHeight">
                                    Height
                                    <input type="number"
                                        id="videoHeight"
                                        name="videoHeight"
                                        placeholder='auto'
                                        className='block text-sm min-w-[50px] max-w-[50px] outline-none border border-gray-500 px-1 py-[.2rem] rounded'
                                        value={video.height}
                                        onChange={(e) => setVideo({ ...video, height: e.target.value })}
                                    />
                                </label>
                            </div>
                            <div className='flex justify-end items-center gap-3 '>
                                <button className='px-2 py-[.2rem] bg-red-800 text-white rounded ' onClick={() => setOpenDropDownMenu('')}>Close</button>
                                <button className='px-2 py-[.2rem] bg-green-800 text-white rounded ' onClick={() => (video.url || video.localUrl) && handleMedia('video', video)} >Add video</button>
                            </div>
                        </div>
                    } />
                </div>
            </div>
            <div id='code' className='flex flex-wrap items-center justify-between gap-3'>
                <button id='codeMode' onClick={() => handleEmbedCode('internal')}>Code</button>
                <div id='embedCode' >
                    <button className='border p-1 cursor-pointer' onClick={() => setOpenDropDownMenu(openDropDownMenu === 'embedCode' ? '' : 'embedCode')}>Embed</button>
                    <Dropdownmenuwrapper openDropDownMenu={openDropDownMenu} menuName='embedCode' Children={
                        <div className='flex flex-col gap-3 min-w-[240px] max-w-[240px]'>
                            <div>
                                <label htmlFor="embedCode" className='text-base'>
                                    {`Embed </>`}
                                    <textarea
                                        className='text-sm mt-1 min-h-[80px] w-full p-1 border border-blue-900 outline-none rounded'
                                        placeholder='embed...'
                                        id='embedCode'
                                        name='embedCode'
                                        value={embedCode}
                                        onChange={(e) => setEmbedCode(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className='flex justify-end items-center gap-3 '>
                                <button className='px-2 py-[.2rem] bg-red-800 text-white rounded ' onClick={() => setOpenDropDownMenu('')}>Close</button>
                                <button className='px-2 py-[.2rem] bg-green-800 text-white rounded ' onClick={() => embedCode && handleEmbedCode('external', embedCode)} >Embed</button>
                            </div>
                        </div>
                    } />

                </div>
            </div>
            <div>
                <button onClick={() => handleDeleteAllText()} >deleteAllText</button>
            </div>
            <div id="history" className='flex flex-wrap items-center justify-between gap-3'>
                <button onClick={() => handleDisplayHistory('undo')}>undo</button>
                <button onClick={() => handleDisplayHistory('redo')}>redo</button>
            </div>
    </div>
};


export default index;
