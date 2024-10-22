import { useState } from "react";
import Dropdownmenuwrapper from "../assests/Dropdownmenuwrapper";
import { imageCmd } from "../cmds";
import { Button, Dialog, Displayimage, Fileinput, Input } from "../../components";
import { useGetLocalMedia } from "../../hooks";
import { RiFolderImageLine} from "react-icons/ri";
import addImagIcon from  '../assests/add-image.svg';

type Props = {
    onInputAreaChange: () => void
    openDropDownMenu: string
    setOpenDropDownMenu: React.Dispatch<React.SetStateAction<string>>
};

const Image = ({
    onInputAreaChange,
    openDropDownMenu,
    setOpenDropDownMenu,
}: Props) => {
    const [displayTextEditorImageDialog, setDisplayTextEditorImageDialog] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFileUrl, setImageFileUrl] = useState('');
    const [imageHeight, setImageHeight] = useState(100);
    const [imageWight, setImageWight] = useState(100);
    const [imagePosition, setImagePosition] = useState('object-contain');
    const [imageAlt, setImageAlt] = useState('');
    const getMedia = useGetLocalMedia();

    const handleInsertImage = (imageUrl: string, alt: string, value: string[]) => {
        if (!imageUrl) return;
        imageCmd(imageUrl, alt, value);
        onInputAreaChange();
        setOpenDropDownMenu('');
    };

    return <div id='texteditor-add-image'>
        <button className='block cursor-pointer' onClick={() => setOpenDropDownMenu(openDropDownMenu === 'image' ? '' :'image')}>
           < RiFolderImageLine size={25} />
        </button>
        <Dropdownmenuwrapper
            openDropDownMenu={openDropDownMenu}
            menuName='image'
            Children={
                <div className='space-y-5 p-3 bg-gray-100 border shadow-sm'>
                    <div id="add-image" className='space-y-3'>
                        <Input
                            id={'image-text-url-input'}
                            type={'text'}
                            inputName={'Add url'}
                            inputClass={'max-w-[190px] text-blue-700 py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                            labelClass={''}
                            value={imageUrl}
                            setValue={(value) => { setImageFileUrl(''); setImageUrl(value as string) }}
                            placeHolder={'https://www.example.com'}
                        />
                        <span className="block">
                            <Displayimage
                                id='blogpost-display-img'
                                imageUrl={imageUrl || imageFileUrl}
                                parentClass='h-[40px] w-[40px] mt-1'
                                imageClass={`border-2 rounded cursor-pointer ${imagePosition}`}
                                placeHolder={addImagIcon}
                                onClick={() => setDisplayTextEditorImageDialog('texteditorimage')}
                            />
                        </span>
                    </div>
                    <div id="image-infor" className='space-y-4'>
                        <Input
                            id={'image-alt-input'}
                            type={'text'}
                            inputName={'Alt'}
                            inputClass={'max-w-[180px] py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                            labelClass={''}
                            value={imageAlt}
                            setValue={(value) => setImageAlt(value as string)}
                            placeHolder={'this image...'}
                        />
                        <div id="image-shape-setting" className='flex items-center gap-3'>
                            <Input
                                id={'image-width-input'}
                                type={'number'}
                                inputName={'Width'}
                                inputClass={'max-w-[80px] py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                                labelClass={''}
                                value={imageWight}
                                setValue={(value) => setImageWight(value as number)}
                                placeHolder={'width'}
                            />
                            <Input
                                id={'image-height-input'}
                                type={'number'}
                                inputName={'Height'}
                                inputClass={'max-w-[80px] py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                                labelClass={''}
                                value={imageHeight}
                                setValue={(value) => setImageHeight(value as number)}
                                placeHolder={'Height'}
                            />
                        </div>
                    </div>
                    <div id="image-position-setting" className='flex item-center gap-5'>
                        <Input
                            id={'image-contain-input'}
                            type={'checkbox'}
                            inputName={'Contain'}
                            inputClass={'cursor-pointer'}
                            labelClass={''}
                            value={imagePosition}
                            setValue={(value) => setImagePosition('object-contain')}
                            checked={imagePosition === 'object-contain' ? true : false}
                        />
                        <Input
                            id={'image-cover-input'}
                            type={'checkbox'}
                            inputName={'Cover'}
                            inputClass={'cursor-pointer'}
                            labelClass={''}
                            value={imagePosition}
                            setValue={(value) => setImagePosition('object-cover')}
                            checked={imagePosition === 'object-cover' ? true : false}
                        />
                        <Input
                            id={'image-fill-input'}
                            type={'checkbox'}
                            inputName={'Fill'}
                            inputClass={'cursor-pointer'}
                            labelClass={''}
                            value={imagePosition}
                            setValue={(value) => setImagePosition('object-fill')}
                            checked={imagePosition === 'object-fill' ? true : false}
                        />
                    </div>
                    <div className='flex justify-end items-center gap-3 '>
                        <button className='px-2 py-[.2rem] bg-red-800 text-white rounded shadow-sm' onClick={() => setOpenDropDownMenu('')}>
                            Close
                        </button>
                        <button className='px-2 py-[.2rem] bg-green-800 text-white rounded shadow-sm'
                            onClick={() => handleInsertImage(imageUrl || imageFileUrl, imageAlt, [`h-[${imageHeight}px]`, `w-[${imageWight}px]`, imagePosition, 'inline'])} >
                            Add image
                        </button>
                    </div>
                    <div id="image-dialog">
                        {/* run display image dialog */}
                        <Dialog
                            id='textarea-image-ialog'
                            parentClass="flex justify-center items-center"
                            childClass=""
                            currentDialog={'texteditorimage'}
                            dialog={displayTextEditorImageDialog}
                            setDialog={setDisplayTextEditorImageDialog}
                            children={
                                <div className='flex justify-around items-center gap-4 min-w-[280px] md:min-w-[480px] min-h-[140px] border-2 shadow rounded-md'>
                                    <Button
                                        children="Form library"
                                        buttonClass=""
                                        id=""
                                        handleClick={() => ''}
                                    />
                                    <Fileinput
                                        id="computer"
                                        type="image"
                                        placeHolder='From computer'
                                        accept="image/png, image/gif, image/jpeg"
                                        setValue={(value) => {
                                            getMedia({
                                                files: value,
                                                fileType: 'image',
                                                getValue: ({ url, file }) => {
                                                    setImageUrl('');
                                                    setImageFileUrl(url.toString());
                                                },
                                            });
                                            setDisplayTextEditorImageDialog('');
                                        }}
                                    />
                                </div>
                            }
                        />
                    </div>
                </div>
            } />
    </div>
};

export default Image;
