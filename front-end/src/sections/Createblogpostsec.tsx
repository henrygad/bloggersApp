import { useEffect, useState } from 'react'
import Trythistexteditor from '../custom-text-editor/App'
import { Button, Dialog, Displayimage, Fileinput, Input, Menu } from '../components';
import displayImagePlaceHolder from '../assert/imageplaceholder.png'
import { useDeleteData, useGetLocalMedia, usePatchData, usePostData } from '../hooks';
import { useDispatch } from 'react-redux';
import { createBlogpost, deleteBlogposts, editBlogposts } from '../redux/slices/userBlogpostSlices';
import { Blogpostprops } from '../entities';
import { deleteAll } from '../custom-text-editor/settings';

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

    const [getTitleContent, setGetTitleContent] = useState<{ _html: string, text: string } | null>(null);
    const [getBodyContent, setGetBodyContent] = useState<{ _html: string, text: string } | null>(null);
    const [blogpostImageUrl, setBlogpostImageUrl] = useState((blogpostToEdit?.displayImage && '/api/image/' + blogpostToEdit?.displayImage) || ' ');
    const [catigory, setCatigory] = useState(blogpostToEdit?.catigory || '');
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
            setGetBlogpostId(response?.data?._id);
            setBlogSlug(response?.data?.slug);
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
            setGetImageFile('');
            setBlogSlug('');

            const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div
            contentEditAbleELe.forEach((element) => {
                //deleteAll(element as HTMLDivElement)
            }
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
        blogSlug,
    ]);


    console.log(getBodyContent)
    return <div className='font-text space-y-6'>
        {/* blog post menus */}
        <Menu
            arrOfMenu={postMenu.reverse()}
            parentClass="flex justify-end items-center gap-3 w-full"
            childClass=""
            id=""
        />
        <div id='title-textarea' className='w-full'>
            {/* title */}
            <Trythistexteditor
                id='blogpost-title-text-editor'
                placeHolder="Title..."
                InputWrapperClassName="border-2 p-3 rounded-md max-w-[768px]"
                InputClassName="max-w-[768px]"
                createNewText={{ IsNew: true }}
                useTextEditors={false}
                inputTextAreaFocus={true}
                setGetContent={setGetTitleContent}
            />
        </div>
        <div id='blogpost-features' className='flex flex-wrap items-center gap-4'>
            {/* img */}
            <Displayimage
                id='blogpost-display-img'
                imageUrl={blogpostImageUrl || ''}
                parentClass='h-[60px] w-[60px]'
                imageClass='object-fit border-2 rounded cursor-pointer'
                placeHolder={displayImagePlaceHolder}
                onClick={() => setDisplayBlogpostImageDialog('displayBlogpostImageDialog')}
            />
            <div id='catigory-perlink' className='flex justify-between gap-3 '>
                {/* catigory */}
                <Input
                    labelClass='text-base'
                    inputClass='text-sm min-w-[120px] border-2 p-1 rounded-md outline-blue-700'
                    type='test'
                    id='catigory'
                    setValue={(value) => setCatigory(value as string)}
                    value={catigory}
                    error={{ isTrue: false, errorClass: '', errorMsg: '' }}
                    placeHolder='Blogpost catigory'
                />

                {/* parmalink */}
                <Input
                    labelClass='text-base'
                    inputClass='text-sm min-w-[120px] border-2 p-1 rounded-md outline-blue-700'
                    type='test'
                    id='blogpost-slug'
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
                    placeHolder='Blogpost slug'
                />

            </div>
        </div>
        <div id='body-textarea' className='w-full'>
            {/* body */}
            <Trythistexteditor
                id='blogpost-body-text-editor'
                placeHolder="Start typing..."
                InputWrapperClassName="border-2 p-3 max-w-[768px]"
                InputClassName="min-h-[480px] max-w-[768px]"
                textEditorWrapperClassName="p-3 border-2 max-w-[768px]"
                createNewText={{ IsNew: true }}
                useTextEditors={true}
                setGetContent={setGetBodyContent}
            />
        </div>
        {/* run display blog post image dialog */}
        <Dialog
            id='textarea-dialog'
            parentClass="flex justify-center items-center"
            childClass=""
            currentDialog={'displayBlogpostImageDialog'}
            dialog={displayBlogpostImageDialog}
            setDialog={setDisplayBlogpostImageDialog}
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
                        id="computer"
                    />
                </div>
            }
        />
    </div>
};

export default Createblogpostsec;
