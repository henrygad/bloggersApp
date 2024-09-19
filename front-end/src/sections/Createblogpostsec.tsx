import { useEffect, useState } from 'react'
import Trythistexteditor from '../custom-text-editor/Trythistexteditor'
import { Button, Dialog, Displayimage, Fileinput, Input, Menu } from '../components';
import displayImagePlaceHolder from '../assert/imageplaceholder.png'
import { useDeleteData, useGetLocalMedia, usePatchData, usePostData } from '../hooks';
import { useDispatch} from 'react-redux';
import { createBlogpost, deleteBlogposts, editBlogposts } from '../redux/slices/userBlogpostSlices';
import { Blogpostprops } from '../entities';
import { deleteAllText } from '../custom-text-editor/text-area/Config';

type Props = {
    toEdit?: boolean
    blogpostToEdit?: Blogpostprops
};

type Slugprops = {
    slugPertern?: string
    useTitleAsSlugAlt?: boolean
    title?: string
    slugStatus?: string
    preSlug?: string
};

const Createblogpostsec = ({ toEdit, blogpostToEdit }: Props) => {

    const [displayBlogpostImageDialog, setDisplayBlogpostImageDialog] = useState('');
    const [allInputStatus, setAllInputStatus] = useState('empty');

    const [getTitleContent, setGetTitleContent] = useState<{ _html: string, text: string }>();
    const [getBodyContent, setGetBodyContent] = useState<{ _html: string, text: string }>();
    const [blogpostImageUrl, setBlogpostImageUrl] = useState((blogpostToEdit?.displayImage && '/api/image/' + blogpostToEdit?.displayImage) || ' ');
    const [catigory, setCatigory] = useState(blogpostToEdit?.catigory || '');
    const [tags, setTags] = useState(blogpostToEdit?.tags || '');
    const [blogSlug, setBlogSlug] = useState('');
    const [blogpostStatus, setBlogpostStatus] = useState(blogpostToEdit?.status.trim().toLocaleLowerCase() || 'publish');
    const [getImageFile, setGetImageFile] = useState<Blob | string>('');
    const [getBlogpostId, setGetBlogpostId] = useState('');
    const getMedia = useGetLocalMedia();

    const { postData, loading: postLoading, error: postError } = usePostData();
    const { patchData, error: editingError, loading: editLoading } = usePatchData();
    const { deleteData, error: deleteError, loading: deleteLoaidng } = useDeleteData();

    const dispatch = useDispatch();

    const postMenu = [
        {
            name: 'Publish',
            to: '',
            content: blogpostStatus === 'publish' ?
                <Button
                    children={<>
                        {!postLoading ?
                            <span>Publish</span> :
                            <span>creating blogpost...</span>
                        }
                    </>}
                    buttonClass={`test-base ${allInputStatus === 'empty' ? 'opacity-20' : ' '} `}
                    id="publish"
                    handleClick={() => blogpostStatus === 'publish' && handleCreateBlogpost()}
                /> : ' ',
        },
        {
            name: 'saveallchanges',
            to: '',
            content: (blogpostStatus === 'published' ||
                blogpostStatus === 'unpublished' ||
                blogpostStatus === 'republished') &&
                allInputStatus !== 'empty' ?
                <Button
                    children={<>
                        {!editLoading ?
                            <span>Save all changes</span> :
                            <span>saving all blogpost changes...</span>
                        }
                    </>}
                    buttonClass='test-base'
                    id="edit"
                    handleClick={() => handleEditBlogpost(blogpostToEdit?._id || getBlogpostId)}
                /> :
                '',
        },
        {
            name: 'delete',
            to: '',
            content: (blogpostStatus === 'published' ||
                blogpostStatus === 'unpublished' ||
                blogpostStatus === 'republished') ?
                <Button
                    children={<>
                        {!deleteLoaidng ?
                            <span>delete</span> :
                            <span>deleting blogpost...</span>
                        }
                    </>}
                    buttonClass='test-base'
                    id="delete"
                    handleClick={() => handleDeleteBlogpost(blogpostToEdit?._id || getBlogpostId)}
                /> :
                null
        },
        {
            name: 'unpublish',
            to: '',
            content: (blogpostStatus === 'published' || blogpostStatus === 'republished') ?
                <Button
                    children={<>
                        {!editLoading ?
                            <span>Unpublished</span> :
                            <span>unpublishing blogpost...</span>
                        }
                    </>}
                    buttonClass='test-base'
                    id="delete"
                    handleClick={() => handleUnpublishBlogpost(blogpostToEdit?._id || getBlogpostId)}
                /> :
                null
        },
        {
            name: 'republish',
            to: '',
            content: blogpostStatus === 'unpublished' ?
                <Button
                    children={<>
                        {!editLoading ?
                            <span>Republish</span> :
                            <span>republishing blogpost...</span>
                        }
                    </>}
                    buttonClass='test-base'
                    id="delete"
                    handleClick={() => blogpostStatus === 'unpublished' && handleRepublishBlogpost(blogpostToEdit?._id || getBlogpostId)}
                /> :
                null
        },
    ];

    const handleFIlterSlug = (value: string, slugPertern: string = '-') => {
        return value.split(' ').join(slugPertern);
    };

    const handleBlogSlug = (value: string, config: Slugprops) => {
        const slugStatus = config.slugStatus?.trim().toLocaleLowerCase();

        if (slugStatus === 'published' ||
            slugStatus === 'republished' ||
            slugStatus === 'unpublished') {
            return config.preSlug;
        } else {
            if (config.useTitleAsSlugAlt) {
                return handleFIlterSlug((value || config.title) || '');
            } else {
                return handleFIlterSlug(value);
            };
        };
    };

    const handleCreateBlogpost = async () => {
        const url = '/api/addblogpost';

        const body = {
            displayImage: '',
            title: getTitleContent?.text,
            body: getBodyContent?.text,
            _html: { title: getTitleContent?._html, body: getBodyContent?._html },
            catigory: catigory,
            tags: tags,
            slug: handleBlogSlug(blogSlug || '', {
                slugStatus: blogpostStatus,
                preSlug: blogpostToEdit?.slug || blogSlug,
                useTitleAsSlugAlt: true,
                title: getTitleContent?.text,
                slugPertern: '-',
            })
        };

        if (!body.slug) return;

        const formData = new FormData();
        formData.append('blogpostimage', getImageFile);
        formData.append('data', JSON.stringify(body));

        const response = await postData(url, formData);

        if (response.ok) {
            dispatch(createBlogpost(response.data));
            setGetBlogpostId(response.data._id);
            setBlogSlug(response.data.slug);
            setBlogpostStatus('published');
            setAllInputStatus('empty');
        } else {
            console.log(postError);
        };

    };

    const edit = async (_id: string, body: {}, status: string) => {
        const url = '/api/editblogpost/' + _id;

        const formData = new FormData();
        formData.append('blogpostimage', getImageFile);
        formData.append('data', JSON.stringify(body));

        const response = await patchData(url, formData);

        if (response.ok) {
            dispatch(editBlogposts({ ...response.data }));
            setBlogpostStatus(status.trim().toLocaleLowerCase());
            setAllInputStatus('empty');
        } else {
            console.log(editingError);
        };
    };

    const handleEditBlogpost = async (_id: string) => {
        const body = {
            displayImage: '',
            title: getTitleContent?.text,
            body: getBodyContent?.text,
            _html: { title: getTitleContent?._html, body: getBodyContent?._html },
            catigory: catigory,
            tags: tags,
            slug: handleBlogSlug(blogSlug || '', {
                slugStatus: blogpostStatus,
                preSlug: blogpostToEdit?.slug || blogSlug,
                useTitleAsSlugAlt: true,
                title: getTitleContent?.text,
                slugPertern: '-',
            })
        };

        if (!body.slug) return;
        await edit(_id, body, 'published');
    };

    const handleUnpublishBlogpost = async (_id: string) => {
        const body = {
            displayImage: '',
            title: getTitleContent?.text,
            body: getBodyContent?.text,
            _html: { title: getTitleContent?._html, body: getBodyContent?._html },
            catigory: catigory,
            tags: tags,
            slug: handleBlogSlug(blogSlug || '', {
                slugStatus: blogpostStatus,
                preSlug: blogpostToEdit?.slug || blogSlug,
                useTitleAsSlugAlt: true,
                title: getTitleContent?.text,
                slugPertern: '-',
            }),
            status: 'unpublished',
        };

        if (!body.slug) return;
        await edit(_id, body, 'unpublished');
    };

    const handleRepublishBlogpost = async (_id: string) => {
        const body = {
            displayImage: '',
            title: getTitleContent?.text,
            body: getBodyContent?.text,
            _html: { title: getTitleContent?._html, body: getBodyContent?._html },
            catigory: catigory,
            tags: tags,
            slug: handleBlogSlug(blogSlug || '', {
                slugStatus: blogpostStatus,
                preSlug: blogpostToEdit?.slug || blogSlug,
                useTitleAsSlugAlt: true,
                title: getTitleContent?.text,
                slugPertern: '-',
            }),
            status: 'republished',
        };

        if (!body.slug) return;
        await edit(_id, body, 'republished');
    };

    const handleDeleteBlogpost = async (_id: string) => {
        const url = '/api/deleteblogpost/' + _id;

        const response = await deleteData(url);

        if (response.ok) {
            dispatch(deleteBlogposts(_id));

            setGetTitleContent({ _html: '', text: '' });
            setGetBodyContent({ _html: '', text: '' });
            setDisplayBlogpostImageDialog('');
            setCatigory('');
            setTags('');
            setGetImageFile('');
            setBlogSlug('');

            const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div
            contentEditAbleELe.forEach((element) =>
                deleteAllText(element as HTMLDivElement)
            );
            setBlogpostStatus('publish');
            setAllInputStatus('empty');

        } else {
            console.log(deleteError);
        }
    };

    const handleChangesOnAllInputs = () => {
        if (!getTitleContent?.text.trim() &&
            !getBodyContent?.text.trim() &&
            !blogpostImageUrl.trim() &&
            !catigory.trim() &&
            !tags.trim() &&
            !blogSlug.trim()
        ) {
            setAllInputStatus('empty');
        } else setAllInputStatus('not empty');
    };

    useEffect(() => {
        handleChangesOnAllInputs();
    }, [
        getTitleContent,
        getBodyContent,
        blogpostImageUrl,
        catigory,
        tags,
        blogSlug,
    ]);


    return <div className='flex justify-center w-full font-text '>
        <div className='space-y-10'>
            <div>
                {/* blog post menus */}
                <Menu
                    arrOfMenu={postMenu.reverse()}
                    parentClass="flex justify-end items-center gap-3 w-full"
                    childClass=""
                    id=""
                />
            </div>
            <div className='w-full min-w-[280px] md:min-w-[768px] max-w-[768px]'>
                {/* title */}
                <Trythistexteditor
                    editorParentWrapperStyle="w-full"
                    textAreaStyle="text-base mt-3 p-2 border-2 rounded"
                    placeHolder="Title..."
                    setGetContent={setGetTitleContent}
                    textAreaConfig={{ addNew: !toEdit, body: blogpostToEdit?._html?.title || '' }}
                    toolBarConfig={{
                        useToolBar: false,
                    }}
                />
            </div>
            <div className='w-full'>
                {/* body */}
                <Trythistexteditor
                    editorParentWrapperStyle="w-full"
                    textAreaStyle="min-h-[380px] md:min-h-[500px] mt-3 p-2 border-2 rounded"
                    placeHolder="Start typing..."
                    setGetContent={setGetBodyContent}
                    textAreaConfig={{ addNew: !toEdit, body: blogpostToEdit?._html?.body || '' }}
                    toolBarConfig={{
                        useToolBar: true,
                        toolBarStyle: 'flex flex-wrap items-center gap-3',
                        inline: {
                            useInlineStyle: true,
                        },
                        anchorLink: {
                            useAnchorLink: true,
                        },
                        list: {
                            useList: true
                        },
                        alignment: {
                            useAlignment: true,
                        },
                        emojis: {
                            useEmojis: true
                        },
                        media: {
                            useMedia: true
                        },
                        embedCode: {
                            useEmbedCode: true
                        },
                        deleteAllText: {
                            useDeleteAllText: true
                        },
                        history: {
                            useHistory: true
                        },
                    }}
                />
            </div>
            <div className='space-y-4'>
                {/* img */}
                <span className='text-base'>Display image</span>
                <Displayimage
                    id='blogpostdisplayimage'
                    imageUrl={blogpostImageUrl || ''}
                    parentClass='h-[140px] w-[140px]'
                    imageClass='object-fit border-2 rounded cursor-pointer'
                    placeHolder={displayImagePlaceHolder}
                    onClick={() => setDisplayBlogpostImageDialog('displayBlogpostImageDialog')}
                />
            </div>
            <div className='flex flex-wrap justify-between gap-3 '>
                {/* post more datail */}
                <div className=''>
                    {/* catigory */}
                    <Input
                        labelClass='text-base'
                        inputClass='text-sm border-2 p-2 rounded-md mt-3 min-w-[180px] outline-blue-700'
                        type='test'
                        inputName='Catigory'
                        setValue={(value) => setCatigory(value as string)}
                        value={catigory}
                        error={{ isTrue: false, errorClass: '', errorMsg: '' }}
                    />
                </div>
                <div>
                    {/* tags */}
                    <Input
                        labelClass='text-base'
                        inputClass='text-sm border-2 p-2 rounded-md mt-3 min-w-[180px] outline-blue-700'
                        type='test'
                        inputName='Tags'
                        setValue={(value) => setTags(value as string)}
                        value={tags}
                        error={{ isTrue: false, errorClass: '', errorMsg: '' }}
                    />
                </div>
                <div>
                    {/* parmalink */}
                    <Input
                        labelClass='text-base'
                        inputClass='text-sm border-2 p-2 rounded-md mt-3 min-w-[280px] outline-blue-700'
                        type='test'
                        inputName='Blog slug'
                        setValue={(value) => setBlogSlug(value as string)}
                        value={handleBlogSlug(blogSlug || '', {
                            slugStatus: blogpostStatus,
                            preSlug: blogpostToEdit?.slug || blogSlug,
                            useTitleAsSlugAlt: true,
                            title: getTitleContent?.text,
                            slugPertern: '-',
                        })
                        }
                        error={{ isTrue: false, errorClass: '', errorMsg: '' }}
                    />
                </div>
            </div>
        </div>
        <div>
            {/* run display blog post image dialog */}
            <Dialog
                children={
                    <div className='flex justify-around items-center gap-4 min-w-[280px] md:min-w-[480px] min-h-[140px] border-2 shadow rounded-md'>
                        <Button
                            children="Form library"
                            buttonClass=""
                            id=""
                            handleClick={() => ''}
                        />
                        <Fileinput
                            placeHolder='From computer'
                            setValue={(value) => {
                                getMedia({
                                    files: value,
                                    fileType: 'image',
                                    getValue: ({ url, file }) => {
                                        setBlogpostImageUrl(url.toString());
                                        setGetImageFile(file)
                                    },
                                });
                                setDisplayBlogpostImageDialog('');
                            }}
                            id="fromComputer"
                        />
                    </div>
                }
                id=""
                parentClass="flex justify-center items-center"
                childClass=""
                currentDialog={'displayBlogpostImageDialog'}
                dialog={displayBlogpostImageDialog}
                setDialog={setDisplayBlogpostImageDialog}
            />
        </div>
    </div>
}

export default Createblogpostsec
