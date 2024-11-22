import React, { SetStateAction, useState } from 'react'
import Trythistexteditor from '../custom-text-editor/App'
import { Button, Dialog, Displayimage, Fileinput, Input, Menu } from '../components';
import displayImagePlaceHolder from '../assert/imageplaceholder.png'
import { useCreateImage, useDeleteData, useGetLocalMedia, useImageGalary, usePatchData, usePostData } from '../hooks';
import { Blogpostprops, Imageprops } from '../entities';
import { deleteAll } from '../custom-text-editor/settings';
import { useAppDispatch } from '../redux/slices';
import { decreaseTotalNumberOfPublishedBlogposts, deletePublishedBlogpost, deleteUnpublishedBlogposts, editPublishedBlogpost, increaseTotalNumberOfPublishedBlogposts, publishBlogpost, unpublishBlogposts } from '../redux/slices/userBlogpostSlices';
import { addDrafts, deleteDrafts, editDrafts } from '../redux/slices/userProfileSlices';
import { addBlogpostImages } from '../redux/slices/userImageSlices';
import Displayblogpostimagessec from './Displayblogpostimagessec';


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
    blogpostPreStatus: string
    setBlogpostPreStatus: React.Dispatch<SetStateAction<string>>
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
    blogpostPreStatus,
    setBlogpostPreStatus,
}: Props) => {
    const [displayBlogpostImageDialog, setDisplayBlogpostImageDialog] = useState('');
    const [onGoingOperation, setOnGoingOperation] = useState('');

    const { postData: postBlogpostData, loading: postLoading } = usePostData();
    const { patchData: patchBlogpostData, loading: LoadingPatchBlogpostData } = usePatchData();
    const { patchData: patchDraftData, loading: loadingPatchDraftData } = usePatchData();
    const { deleteData, loading: deleteLoaidng } = useDeleteData();

    const appDispatch = useAppDispatch();
    const getMedia = useGetLocalMedia();
    const { createImage, loading: loaidngCreateImage, error: errorCreateImage, } = useCreateImage();
    const { imageGalary, setImageGalary } = useImageGalary();

    const blogpostMenu = [
        {
            name: 'add new',
            content: <Button
                id="add-new"
                children={'Add new'}
                buttonClass={`test-base ${inputAreasStatus !== 'empty' ? '' : 'opacity-20 cursor-text'} `}
                handleClick={() => { handleClearInputsArea() }}
            />
        },
        {
            name: 'Publish',
            content: <Button
                id="publish"
                children={<>
                    {!(postLoading || LoadingPatchBlogpostData) ?
                        <span>Publish</span> :
                        <>{onGoingOperation === 'publish' ?
                            <span>creating blogpost...</span> :
                            <span>Publish</span>
                        }</>
                    }
                </>}
                buttonClass={`test-base ${(inputAreasStatus !== 'empty' && blogpostStatus !== 'published') ||
                    inputAreasStatus === 'editing' ?
                    '' : 'opacity-20 cursor-text'} `}
                handleClick={() => {
                    setOnGoingOperation('publish');

                    if (inputAreasStatus === 'editing') {
                        handlePublishChanges(getBlogpostId);
                    } else if (blogpostStatus === 'unpublished') {
                        handleRepublish(getBlogpostId);
                    } else if (blogpostStatus === 'draft') {
                        handlePublishDraft()
                    } else if (blogpostStatus !== 'published') {
                        handldePublish();
                    };
                }}
            />
        },
        {
            name: 'Delete',
            content: <Button
                id="delete"
                children={<>
                    {!(deleteLoaidng || loadingPatchDraftData) ?
                        <span>Delete</span> :
                        <>{onGoingOperation === 'delete' ?
                            <span>deleting blogpost...</span> :
                            <span>Delete</span>
                        }</>
                    }
                </>}
                buttonClass={`test-base ${blogpostStatus === 'published' || blogpostStatus === 'draft' ? '' : 'opacity-20 cursor-text'} `}
                handleClick={() => {
                    setOnGoingOperation('delete');
                    if (blogpostStatus === 'draft') {
                        handleDeleteDraft(getBlogpostId, true);
                    } else {
                        handleDeleteBlogpost(getBlogpostId, blogpostStatus);
                    };
                }}
            />
        },
        {
            name: 'unpublish',
            content: <Button
                id="unpublish"
                children={<>
                    {!LoadingPatchBlogpostData ?
                        <span>Unpublish</span> :
                        <>
                            {onGoingOperation === 'unpublish' ?
                                <span>unpublishing blogpost...</span> :
                                <span>Unpublish</span>
                            }
                        </>
                    }
                </>}
                buttonClass={`test-base ${blogpostStatus === 'published' ? '' : 'opacity-20 cursor-text'} `}
                handleClick={() => {
                    setOnGoingOperation('unpublish')
                    handleUnpublish(getBlogpostId)
                }}
            />
        },
        {
            name: 'Draft',
            content: <Button
                id="draft"
                children={<>{!loadingPatchDraftData ? 'Draft' : 'loading...'}</>}
                buttonClass={`test-base ${inputAreasStatus !== 'empty' && inputAreasStatus !== 'old'
                    ? '' : 'opacity-20 cursor-text'} `}
                handleClick={() => {
                    if (inputAreasStatus !== 'empty' &&
                        inputAreasStatus !== 'old') {
                        setOnGoingOperation('draft');
                        if (blogpostStatus !== 'draft') handleAddDraft('new');
                        else handleAddDraft('edit');
                    };
                }}
            />
        },
    ];

    const handleDesignSlug = (slug: string, slugPertern: string) => {
        return slug.split(' ').join(slugPertern);
    };

    const handleClearInputsArea = () => {
        setGetBlogpostId('');
        setTitleContent({ _html: '', text: '' });
        setBodyContent({ _html: '', text: '' });
        setDisplayImage('');
        setCatigory('');
        setSlug('');

        setDisplayBlogpostImageDialog('');

        setInputAreasStatus('empty');
        setBlogpostStatus('');
        setBlogpostPreStatus('');

        const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div on page
        contentEditAbleELe.forEach((element) => {
            deleteAll(element as HTMLDivElement)
        });
    };

    const handldePublish = async () => {
        if (!slug) return;
        const url = '/api/addblogpost';
        const body = {
            displayImage,
            title: titleContent?.text,
            body: bodyContent?.text,
            _html: { title: titleContent?._html, body: bodyContent?._html },
            catigory,
            slug,
            status: 'published',
        };

        postBlogpostData<Blogpostprops>(url, body)
            .then((res) => {
                const { data } = res;
                if (data) {
                    if (data.status === 'published') {
                        appDispatch(publishBlogpost(data));
                        appDispatch(increaseTotalNumberOfPublishedBlogposts(1))
                    };

                    setGetBlogpostId(data._id)
                    setBlogpostStatus('published');
                    setInputAreasStatus('empty');
                };
            });
    };

    const editBlogpost = async (_id: string, status: string) => {
        if (!slug) return;

        const url = '/api/editblogpost/' + _id;
        const body = {
            displayImage,
            title: titleContent?.text,
            body: bodyContent?.text,
            _html: { title: titleContent?._html, body: bodyContent?._html },
            catigory,
            slug,
            status,
        };

        await patchBlogpostData<Blogpostprops>(url, body)
            .then((res) => {
                const { data } = res;
                if (data) {

                    if (data.status === 'published') {
                        appDispatch(editPublishedBlogpost(data));
                        appDispatch(increaseTotalNumberOfPublishedBlogposts(1))
                        setInputAreasStatus('empty');
                    };
                    if (data.status === 'unpublished') {
                        appDispatch(unpublishBlogposts(data));
                        appDispatch(decreaseTotalNumberOfPublishedBlogposts(1))
                        setInputAreasStatus('old');
                    };
                    setGetBlogpostId(data._id)
                    setBlogpostStatus(data.status);
                };

            }).catch((error) => {
                console.log(error);
            });
    };

    const handlePublishChanges = async (_id: string) => {
        if ((blogpostStatus === 'published' &&
            inputAreasStatus === 'editing') || blogpostStatus === 'draft') {
            await editBlogpost(_id, 'published');
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
                appDispatch(deleteUnpublishedBlogposts({ _id }));
                if (status === 'published') appDispatch(decreaseTotalNumberOfPublishedBlogposts(1));
                handleClearInputsArea();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handlePublishDraft = async () => {
        setOnGoingOperation('publish');
        if (blogpostPreStatus === 'published' ||
            blogpostPreStatus === 'unpublished'
        ) {
            await handlePublishChanges(getBlogpostId);
        } else {
            await handldePublish();
        };

        await handleDeleteDraft(getBlogpostId, false);
    };

    const handleAddDraft = async (type: string) => {
        if (!slug) return;
        const url = '/api/profile/drafts/add';
        const copy = {
            _id: getBlogpostId,
            displayImage,
            title: titleContent?.text,
            body: bodyContent?.text,
            _html: { title: titleContent?._html, body: bodyContent?._html },
            catigory,
            slug,
            preStatus: blogpostStatus,
            status: 'draft',
        };

        await patchDraftData<Blogpostprops>(url, copy)
            .then((res) => {
                const { data } = res;
                if (data) {
                    if (type === 'new') appDispatch(addDrafts(data));
                    else appDispatch(editDrafts(data));
                    setGetBlogpostId(data._id);
                    setBlogpostStatus('draft');
                    setInputAreasStatus('empty');
                };
            });
    };

    const handleDeleteDraft = async (_id: string, clearInput?: boolean) => {
        const url = '/api/profile/drafts/delete';
        const copy = { _id };

        await patchDraftData<Blogpostprops>(url, copy)
            .then((data) => {
                if (data) {
                    console.log(data)
                    appDispatch(deleteDrafts({ _id }));
                    setBlogpostStatus('deleted');
                    setInputAreasStatus('empty');
                    clearInput && handleClearInputsArea();
                } else {
                    console.log('didt delete')
                }
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
                imageId={displayImage}
                parentClass='h-[60px] w-[60px]'
                imageClass='object-fit border-2 rounded cursor-pointer'
                placeHolder={displayImagePlaceHolder}
                onClick={() => setDisplayBlogpostImageDialog('blogpost-image-dialog')}
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
        <Dialog
            id='change-image-dialog-for-blogpost-display-image'
            parentClass="flex justify-center items-center"
            childClass="-mt-60"
            currentDialog={'blogpost-image-dialog'}
            dialog={displayBlogpostImageDialog}
            setDialog={()=>  setDisplayBlogpostImageDialog('')}
            children={
                <div className='flex justify-around items-center gap-4 min-w-[280px] md:min-w-[480px] min-h-[140px] border-2 shadow rounded-md'>
                    <Button
                        id="choose-image-from-library"
                        buttonClass=""
                        children="Form library"
                        handleClick={() => setImageGalary({ displayImageGalary: 'blogpost-images-1', selectedImages: [] })}
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
                                getValue: async ({ dataUrl, tempUrl, file }) => {
                                    const image: Imageprops | null = await createImage({ fieldname: 'blogpostimage', file, url: '/api/image/blogpostimage/add' });
                                    if (image) {
                                        setDisplayImage(image._id);
                                        appDispatch(addBlogpostImages(image))

                                        if ((blogpostStatus === 'published' || blogpostStatus === 'unpublished') &&
                                            (displayImage.trim() !== image._id.trim())) { // check for change in displayimage after puplishing 
                                            setInputAreasStatus('editing');
                                        };
                                    };
                                },
                            });
                            setDisplayBlogpostImageDialog('');
                        }}
                    />
                </div>
            }
        />
        <Dialog
            id="blogpost-image-galary-dialog-1"
            parentClass=""
            childClass="container relative w-full h-full py-10"
            currentDialog="blogpost-images-1"
            dialog={imageGalary.displayImageGalary === 'blogpost-images-1' ? 'blogpost-images-1' : ''}
            setDialog={()=> null}
            children={<>
                <Displayblogpostimagessec selection={true} />
                <div className='absolute bottom-1 right-1 flex items-center gap-6'>
                    <Button
                        id='add-selected-image-galary-btn'
                        buttonClass='text-white px-2.5 py-1.5 rounded bg-green-800'
                        children={`(${imageGalary.selectedImages?.length || 0}) Add`}
                        handleClick={() => { 
                            if(imageGalary.selectedImages?.length == 0) return;
                            setDisplayImage(imageGalary.selectedImages[0]);
                            setImageGalary({selectedImages: [], displayImageGalary: ''}); 
                            setDisplayBlogpostImageDialog('');
                        }}
                    />
                    <Button
                        id='close-image-galary-btn'
                        buttonClass='text-white px-2 py-1.5 rounded bg-red-800'
                        children={'Close'}
                        handleClick={() => {
                            setImageGalary({ displayImageGalary: '', selectedImages: [] });
                            setDisplayBlogpostImageDialog('displayBlogpostImageDialog');
                        }}
                    />
                </div>
            </>}
        />
    </div>
};

export default Createblogpostsec;
