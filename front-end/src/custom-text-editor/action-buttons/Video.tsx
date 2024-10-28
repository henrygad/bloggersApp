import { useState } from "react";
import Dropdownmenuwrapper from "../assests/Dropdownmenuwrapper";
import { useGetLocalMedia } from "../../hooks";
import { Fileinput, Input } from "../../components";
import { videoCmd } from "../cmds";
import { RiFolderVideoLine } from "react-icons/ri";

type Props = {
    onInputAreaChange: () => void
    openDropDownMenu: string
    setOpenDropDownMenu: React.Dispatch<React.SetStateAction<string>>
};

const Video = ({
    onInputAreaChange,
    openDropDownMenu,
    setOpenDropDownMenu,
}: Props) => {
    const [videoName, setVideoName] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [videoFileUrl, setVideoFileUrl] = useState('');
    const [videoHeight, setVideoHeight] = useState(200);
    const [videoWight, setVideoWight] = useState(200);
    const getMedia = useGetLocalMedia();

    const handleInsertVideo = (videoUrl: string, value: string[]) => {
        if (!videoUrl) return;
        videoCmd(videoUrl, value || []);
        onInputAreaChange();
        setOpenDropDownMenu('');
    };

    return <div id='texteditor-add-video'>
        <button className='block cursor-pointer' onClick={() => setOpenDropDownMenu(openDropDownMenu === 'video' ? '' :'video')}>
            <RiFolderVideoLine size={25}/>
        </button>
        <Dropdownmenuwrapper
            openDropDownMenu={openDropDownMenu}
            menuName='video'
            Children={
                <div className='space-y-5 p-3 bg-gray-100 border shadow-sm'>
                    <div className='space-y-3'>
                        <Input
                            id={'video-text-url-input'}
                            type={'text'}
                            inputName={'Add url'}
                            inputClass={'max-w-[190px] text-blue-700 py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                            labelClass={''}
                            value={videoUrl}
                            setValue={(value) => { setVideoFileUrl(''); setVideoUrl(value as string) }}
                            placeHolder={'https://www.example.com'}
                        />
                        <span className="block">
                            <Fileinput
                                id="computer"
                                type='video'
                                height="40px"
                                width="40px"
                                accept="video/*"
                                placeHolder={videoName ? videoName : ''}
                                setValue={(value) => {
                                    getMedia({
                                        files: value,
                                        fileType: 'video',
                                        getValue: ({data, url, file }) => {
                                            const maxSizeInMB = 2;
                                            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

                                            if (file && file.size > maxSizeInBytes) {
                                                alert(`Video size exceeds ${maxSizeInMB} MB. Please select a smaller file.`);

                                                setVideoName('');
                                                setVideoUrl('');
                                                setVideoFileUrl(data.toString());
                                            }else {
                                                const fileObj = file as Blob & { name: string };
                                                setVideoName(fileObj.name);
                                                setVideoUrl('');
                                                setVideoFileUrl(data.toString());
                                            };
                                            
                                        },
                                    });
                                }}
                            />
                        </span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <Input
                            id={'video-width-input'}
                            type={'number'}
                            inputName={'Width'}
                            inputClass={'max-w-[80px] py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                            labelClass={''}
                            value={videoWight}
                            setValue={(value) => setVideoWight(value as number)}
                            placeHolder={'width'}
                        />
                        <Input
                            id={'video-height-input'}
                            type={'number'}
                            inputName={'Height'}
                            inputClass={'max-w-[80px] py-1 px-1.5 mt-1 border outline-blue-500 rounded'}
                            labelClass={''}
                            value={videoHeight}
                            setValue={(value) => setVideoHeight(value as number)}
                            placeHolder={'Height'}
                        />
                    </div>
                    <div className='flex justify-end items-center gap-3 '>
                        <button className='px-2 py-[.2rem] bg-red-800 text-white rounded'
                            onClick={() => setOpenDropDownMenu('')}>
                            Close
                        </button>
                        <button className='px-2 py-[.2rem] bg-green-800 text-white rounded '
                            onClick={() => handleInsertVideo(videoFileUrl || videoUrl, ['h-[' + videoHeight + 'px]', 'w-[' + videoWight + 'px]', 'inline'])} >
                            Add
                        </button>
                    </div>
                </div>
            } />
    </div>
};

export default Video;
