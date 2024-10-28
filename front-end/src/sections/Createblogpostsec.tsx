import React, { SetStateAction, useEffect, useState } from 'react'
import Trythistexteditor from '../custom-text-editor/App'
import { Button, Dialog, Displayimage, Fileinput, Input, Menu } from '../components';
import displayImagePlaceHolder from '../assert/imageplaceholder.png'
import { useDeleteData, useGetLocalMedia, usePatchData, usePostData } from '../hooks';
import { Blogpostprops } from '../entities';
import { deleteAll } from '../custom-text-editor/settings';
import { useAppDispatch } from '../redux/slices';
import { archivedBlogposts, decreaseTotalNumberOfPublishedBlogposts, deleteArchivedBlogposts, deletePublishedBlogpost, deleteUnpublishedBlogposts, increaseTotalNumberOfPublishedBlogposts, publishBlogpost, unpublishBlogposts } from '../redux/slices/userBlogpostSlices';
import { addBlogpostImages } from '../redux/slices/userImageSlices';


type Props = {
    toEdit?: boolean
    inputAreasStatus: string
    setInputAreasStatus: React.Dispatch<React.SetStateAction<string>>
    getBlogpostId: string,
    setGetBlogpostId: React.Dispatch<React.SetStateAction<string>>
    titleContent: { _html: string; text: string }
    setTitleContent: React.Dispatch<React.SetStateAction<{
        _html: string;
        text: string;
    }>>
    bodyContent: { _html: string; text: string }
    setBodyContent: React.Dispatch<React.SetStateAction<{
        _html: string;
        text: string;
    }>>
    displayImage: string,
    setDisplayImage: React.Dispatch<SetStateAction<string>>
    catigory: string,
    setCatigory: React.Dispatch<SetStateAction<string>>
    slug: string
    setSlug: React.Dispatch<SetStateAction<string>>
    blogpostStatus: string,
    setBlogpostStatus: React.Dispatch<SetStateAction<string>>
    imageFile: Blob | string
    setImageFile: React.Dispatch<SetStateAction<Blob | string>>
};

const Createblogpostsec = ({
    toEdit,
    inputAreasStatus,
    setInputAreasStatus,
    getBlogpostId,
    setGetBlogpostId,
    titleContent,
    setTitleContent,
    bodyContent,
    setBodyContent,
    displayImage,
    setDisplayImage,
    catigory,
    setCatigory,
    slug,
    setSlug,
    blogpostStatus,
    setBlogpostStatus,
    imageFile,
    setImageFile,
}: Props) => {
    const [displayBlogpostImageDialog, setDisplayBlogpostImageDialog] = useState('');
    const [onGoingOperation, setOnGoingOperation] = useState('');

    const { postData, loading: postLoading } = usePostData();
    const { patchData, loading: editLoading } = usePatchData();
    const { deleteData, loading: deleteLoaidng } = useDeleteData();

    const appDispatch = useAppDispatch();
    const getMedia = useGetLocalMedia();

    const blogpostMenu = [
        {
            name: 'add new',
            content: <Button
                id="add-new"
                children={'Add new'}
                buttonClass="test-base"
                handleClick={() => handleAddNew()}
            />
        },
        {
            name: 'Publish',
            content: <Button
                id="publish"
                children={<>
                    {!(postLoading || editLoading) ?
                        <span>Publish</span> :
                        <>{onGoingOperation === 'publish' ?
                            <span>creating blogpost...</span> :
                            <span>Publish</span>
                        }</>
                    }
                </>}
                buttonClass={`test-base ${(blogpostStatus !== 'published' && inputAreasStatus === 'new') ||
                    (blogpostStatus === 'published' && inputAreasStatus === 'editing') ||
                    (blogpostStatus === 'unpublished' || (blogpostStatus === 'unpublished' && inputAreasStatus === 'editing')) ||
                    (blogpostStatus === 'archived' && inputAreasStatus === 'old') ?
                    ''
                    : 'opacity-20'
                    } `}
                handleClick={() => {
                    setOnGoingOperation('publish');

                    if (inputAreasStatus === 'new' && blogpostStatus === 'archive') {
                        handlePublish();
                    } else if ((blogpostStatus === 'published' && inputAreasStatus === 'editing') ||
                        (blogpostStatus === 'archived' && inputAreasStatus === 'old')) {
                        handlePublishChanges(getBlogpostId);
                    } else if (blogpostStatus === 'unpublished') {
                        handleRepublish(getBlogpostId);
                    };
                }}
            />
        },
        {
            name: 'Delete',
            content: <Button
                id="delete"
                children={<>
                    {!deleteLoaidng ?
                        <span>Delete</span> :
                        <span>deleting blogpost...</span>
                    }
                </>}
                buttonClass={`test-base ${blogpostStatus === 'published' ?
                    '' :
                    'opacity-20'
                    } `}
                handleClick={() => handleDeleteBlogpost(getBlogpostId, blogpostStatus)}
            />
        },
        {
            name: 'unpublish',
            content: <Button
                id="delete"
                children={<>
                    {!editLoading ?
                        <span>Unpublish</span> :
                        <>{onGoingOperation === 'unpublish' ?
                            <span>unpublishing blogpost...</span> :
                            <span>Unpublish</span>
                        }</>
                    }
                </>}
                buttonClass={`test-base ${blogpostStatus === 'published' ?
                    '' :
                    'opacity-20'
                    } `}
                handleClick={() => {
                    setOnGoingOperation('unpublish');
                    handleUnpublish(getBlogpostId);
                }}
            />
        },
        {
            name: 'Archived',
            content: <Button
                id="archived"
                children={<>
                    {!(postLoading || editLoading) ?
                        <span>Archived</span> :
                        <>{onGoingOperation === 'archive' ?
                            <span>Archived blogpost...</span> :
                            <span>Archived</span>
                        }</>
                    }
                </>}
                buttonClass={`test-base ${inputAreasStatus === 'new' ||
                    inputAreasStatus === 'editing'
                    ? '' : 'opacity-20'
                    } `}
                handleClick={() => {
                    setOnGoingOperation('archive')
                    handleArchived(getBlogpostId);
                }}
            />
        },
    ];

    const handleDesignSlug = (slug: string, slugPertern: string) => {
        return slug.split(' ').join(slugPertern);
    };

    const handleAddNew = () => {
        setGetBlogpostId('');
        setTitleContent({ _html: '', text: '' });
        setBodyContent({ _html: '', text: '' });
        setDisplayImage('');
        setImageFile('');
        setCatigory('');
        setSlug('');

        setDisplayBlogpostImageDialog('');

        setInputAreasStatus('empty');
        setBlogpostStatus('archive');

        const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div on page
        contentEditAbleELe.forEach((element) => {
            deleteAll(element as HTMLDivElement)
        });
    };

    const createNewBlogpost = async (status: string) => {
        if (!slug && blogpostStatus !== 'archived' && inputAreasStatus !== 'new') return;

        const url = '/api/addblogpost';
        const body = {
            title: titleContent?.text,
            body: bodyContent?.text,
            _html: { title: titleContent?._html, body: bodyContent?._html },
            catigory,
            slug,
            status,
        };

        const formData = new FormData();
        formData.append('blogpostimage', imageFile);
        formData.append('data', JSON.stringify(body));

        postData<Blogpostprops>(url, formData)
            .then((res) => {
                const { data } = res;
                if (data) {
                    if (data.status === 'archived') appDispatch(archivedBlogposts(data));
                    if (data.status === 'published') {
                        appDispatch(publishBlogpost(data));
                        appDispatch(increaseTotalNumberOfPublishedBlogposts(1))
                    };
                    
                    setGetBlogpostId(data._id)
                    setBlogpostStatus(status);
                    setInputAreasStatus('old');
                };
            });
    };

    const handlePublish = () => {
        createNewBlogpost('published');
    };

    const handleArchived = (_id: string) => {
        if (blogpostStatus === 'published') {
            editBlogpost(_id, 'archived');
            appDispatch(decreaseTotalNumberOfPublishedBlogposts(1));
        } else {
            createNewBlogpost('archived');
        };
    };

    const editBlogpost = async (_id: string, status: string) => {
        if (!slug) return;

        const url = '/api/editblogpost/' + _id;
        const body = {
            title: titleContent?.text,
            body: bodyContent?.text,
            _html: { title: titleContent?._html, body: bodyContent?._html },
            catigory,
            slug,
            status,
        };

        const formData = new FormData();
        formData.append('blogpostimage', imageFile);
        formData.append('data', JSON.stringify(body));

        await patchData<Blogpostprops>(url, formData)
            .then((res) => {
                const { data } = res;
                if (data) {

                    if (data.status === 'archived') appDispatch(archivedBlogposts(data));
                    if (data.status === 'published') {
                        appDispatch(publishBlogpost(data));
                        appDispatch(increaseTotalNumberOfPublishedBlogposts(1))
                    };
                    if (data.status === 'unpublished') {
                        appDispatch(unpublishBlogposts(data));
                        appDispatch(decreaseTotalNumberOfPublishedBlogposts(1))
                    };
                    setGetBlogpostId(data._id)
                    setBlogpostStatus(status);
                    setInputAreasStatus('old');
                };

            }).catch((error) => {
                console.log(error);
            });
    };

    const handlePublishChanges = (_id: string) => {
        if ((blogpostStatus === 'published' && inputAreasStatus === 'editing') ||
            (blogpostStatus === 'archived' && inputAreasStatus === 'old')
        ) {
            editBlogpost(_id, 'published');
        };
    };

    const handleUnpublish = (_id: string) => {
        if (blogpostStatus === 'published') editBlogpost(_id, 'unpublished');
    };

    const handleRepublish = (_id: string) => {
        if (blogpostStatus === 'unpublished') editBlogpost(_id, 'published');
    };

    const handleDeleteBlogpost = async (_id: string, status: string) => {
        const url = '/api/deleteblogpost/' + _id;

        await deleteData(url)
            .then((data) => {

                appDispatch(deletePublishedBlogpost({ _id }));
                appDispatch(deleteArchivedBlogposts({ _id }));
                appDispatch(deleteUnpublishedBlogposts({ _id }));
                if(status === 'published') appDispatch(decreaseTotalNumberOfPublishedBlogposts(1));
                handleAddNew();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return <div className='font-text space-y-6'>
        {/* blog post menus */}
        <Menu
            arrOfMenu={blogpostMenu}
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
                createNewText={{ IsNew: false, content: titleContent }}
                useTextEditors={false}
                inputTextAreaFocus={true}
                setGetContent={(content) => {
                    setTitleContent(content);
                    if (blogpostStatus !== 'published' &&
                        blogpostStatus !== 'unpublished') {
                        setSlug(handleDesignSlug(content.text, '-'));
                    };

                    if (content.text.trim()) { // check for new values add in title input
                        setInputAreasStatus('new');
                    } else {
                        setInputAreasStatus('empty');
                    };

                    if ((blogpostStatus === 'published' || blogpostStatus === 'unpublished') &&
                        (titleContent?._html.trim() !== content._html.trim())) { // check for change in title after puplishing 
                        setInputAreasStatus('editing');
                    };
                }}
            />
        </div>
        <div id='blogpost-features' className='flex flex-wrap items-center gap-4'>
            {/* img */}
            <Displayimage
                id='blogpost-display-img'
                imageUrl={displayImage || ''}
                parentClass='h-[60px] w-[60px]'
                imageClass='object-fit border-2 rounded cursor-pointer'
                placeHolder={displayImagePlaceHolder}
                onClick={() => setDisplayBlogpostImageDialog('displayBlogpostImageDialog')}
            />
            <div id='catigory-perlink' className='flex justify-between gap-3 '>
                {/* catigory */}
                <Input
                    inputName='Catigory'
                    labelClass='text-base'
                    inputClass='text-sm min-w-[120px] border-2 p-1 rounded-md outline-blue-700'
                    type='test'
                    id='catigory'
                    setValue={(value) => {
                        const getValue = value as string;
                        setCatigory(getValue);

                        if ((blogpostStatus === 'published' || blogpostStatus === 'unpublished') &&
                            (catigory.trim() !== getValue.trim())) { // check for change in catigory after puplishing 
                            setInputAreasStatus('editing');
                        };
                    }}
                    value={catigory}
                    error={{ isTrue: false, errorClass: '', errorMsg: '' }}
                    placeHolder='Blogpost catigory'
                />

                {/* parmalink */}
                <Input
                    inputName='Permalink'
                    labelClass='text-base'
                    inputClass='text-sm min-w-[120px] border-2 p-1 rounded-md outline-blue-700'
                    type='test'
                    id='blogpost-slug'
                    value={slug}
                    setValue={(value) => {
                        const getValue = value as string;
                        if (blogpostStatus !== 'published' &&
                            blogpostStatus !== 'unpublished') {
                            setSlug(handleDesignSlug(getValue, '-'));
                        };

                        if (blogpostStatus !== 'published' && getValue.trim()) {
                            setInputAreasStatus('new');
                        } else {
                            setInputAreasStatus('empty');
                        };
                    }}
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
                createNewText={{ IsNew: false, content: bodyContent }}
                useTextEditors={true}
                setGetContent={(content) => {
                    setBodyContent(content);

                    if ((blogpostStatus === 'published' || blogpostStatus === 'unpublished') &&
                        (bodyContent?._html.trim() !== content._html.trim())) { // check for change in body after puplishing 
                        setInputAreasStatus('editing');
                    };
                }}
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
                        id="computer"
                        placeHolder='From computer'
                        type='image'
                        accept='image/png'
                        setValue={(value) => {
                            getMedia({
                                files: value,
                                fileType: 'image',
                                getValue: ({ url, file }) => {
                                    setDisplayImage(url.toString());
                                    setImageFile(file)

                                    if ((blogpostStatus === 'published' || blogpostStatus === 'unpublished') &&
                                        (displayImage.trim() !== url.trim())) { // check for change in displayimage after puplishing 
                                        setInputAreasStatus('editing');
                                    };
                                },
                            });
                            setDisplayBlogpostImageDialog('');
                        }}
                    />
                </div>
            }
        />
    </div>
};

export default Createblogpostsec;
