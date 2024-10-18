import { Blogpostprops, Commentprops } from "../entities"
import { Link, useNavigate } from "react-router-dom";
import Displayimage from "./Displayimage";
import blogpostImagePlaceHolder from '../assert/imageplaceholder.png';
import UsershortInfor from "./UsershortInfor";
import Menu from "./Menu";
import Button from "./Button";
import { useRef, useState } from "react";
import Dotnav from "./Dotnav";
import { useCopyLink, useDeleteData, useFetchData, usePatchData, useSanitize, useTrimWords, useUserIsLogin } from "../hooks";
import { deleteBlogposts, editBlogposts } from "../redux/slices/userBlogpostSlices";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import Likebutton from "./Likebutton";
import Commentbutton from "./Commentbutton";
import Viewbutton from "./Viewbutton";
import Savesbutton from "./Savesbutton";
import Sharebutton from "./Sharebutton";

type Props = {
    blogpost: Blogpostprops
    type: string
    index?: number
    autoOpenTargetComment?: { autoOpen: boolean, commentId: string, commentAddress: string, comment: Commentprops | null, blogpostId: string, targetLike: { autoOpen: boolean, commentId: string, like: string } }
    autoOpenTargetBlogpostLike?: { autoOpen: boolean, blogpostId: string, like: string }
};

const Singleblogpost = ({
    blogpost,
    type,
    index = 0,
    autoOpenTargetComment = { autoOpen: false, commentId: '', commentAddress: '', comment: null, blogpostId: '', targetLike: { autoOpen: false, commentId: '', like: '' } },
    autoOpenTargetBlogpostLike = { autoOpen: false, blogpostId: '', like: ' ', }
}: Props) => {
    const { userProfile: { data: profileData } } = useAppSelector((state) => state.userProfileSlices);

    const { patchData, loading: editingLoading } = usePatchData();
    const { deleteData: deleteBlogpostData, loading: deletingBlogpostLoading, error: deletingError } = useDeleteData();
    const navigate = useNavigate();
    const {
        _id, displayImage, authorUserName,
        title, body, _html, catigory, url, likes, views,
        updatedAt, createdAt, shares,
    } = blogpost;
    const [toggleSideMenu, setToggleSideMenu] = useState('');
    const isAccountOwner = authorUserName === profileData?.userName
    const { handleCopyLink, copied } = useCopyLink(url);
    const appDispatch = useAppDispatch();

    const trimedWordsInitailNum = 10
    const { trimWords, trimedWords, trimedWordsDone } = useTrimWords(body, trimedWordsInitailNum);
    const trimedWordsNumRef = useRef(trimedWordsInitailNum);
    const sanitizeHTML = useSanitize();
    const blogpostRef = useRef<HTMLElement | null>(null);

    // api for blog post comments and their nested children comments
    const { data: getCommentData, loading: loadingComment } = useFetchData<Commentprops[] | null>(`/api/blogpostcomments/${_id}?skip=0&limit=5`, [_id]);

    const generalMenuForBlogpost = [
        {
            name: 'view',
            to: url,
            content: ''
        },
        {
            name: 'copy link',
            to: '',
            content: <Button
                id="copy-blogpost-link"
                children={<>
                    Copy link {copied ? <span className="text-green-500">Copied</span> : null}
                </>}
                buttonClass="border-b"
                handleClick={() => handleCopyLink()}
            />
        },
        {
            name: 'save',
            to: '',
            content: <Savesbutton
                saves={profileData?.saves}
                blogpost={blogpost}
            />
        },
    ];

    const accountOnwerMenuForBlogpost = [
        ...generalMenuForBlogpost,
        {
            name: 'edit',
            to: '',
            content: <Button
                id="share-blogpost-link"
                children={'Edit'}
                buttonClass="border-b"
                handleClick={() => handleEditBlogpost(blogpost)}
            />
        },
        {
            name: 'unPublished',
            to: '',
            content: <Button
                id="share-blogpost-link"
                children={!editingLoading ? 'Unpublish' : 'unpublish loading...'}
                buttonClass="border-b"
                handleClick={() => handleUnpublishBlogpost(_id)}
            />
        },
        {
            name: 'delete',
            to: '',
            content: <Button
                id="share-blogpost-link"
                children={!deletingBlogpostLoading ? 'Delete' : 'delete loading...'}
                buttonClass="border-b"
                handleClick={() => handleDeleteBlogpost(_id)}
            />
        },

    ];

    const handleEditBlogpost = (blogpost: Blogpostprops) => {
        navigate('/createpost', { state: { toEdit: true, data: blogpost } });
    };

    const handleUnpublishBlogpost = async (_id: string) => {
        const body = {
            status: 'unpublished',
        };
        const url = '/api/editblogpost/' + _id;

        const formData = new FormData();
        formData.append('blogpostimage', 'no image');
        formData.append('data', JSON.stringify(body));

        const response = await patchData(url, formData);

        if (response.ok) {
            appDispatch(editBlogposts({ ...response.data }));
        };
    };

    const handleDeleteBlogpost = async (_id: string) => {
        const url = '/api/deleteblogpost/' + _id;
        const response = await deleteBlogpostData(url);

        if (response.ok) {
            appDispatch(deleteBlogposts(_id));
        };
    };


    return <article ref={blogpostRef} className={`
        flex flex-col items-start gap-4 font-text w-full 
        ${type === 'text' ? 'min-w-[280px] sm:min-[480px]  max-w-[480px] xl:min-w-[768px] xl:max-w-[768px]' : ' '} 
        ${(index % 2 !== 0) ? "border-y" : ''} 
        px-2 py-1`
    }
    >
        <span id="blogpost-menu" className="block relative w-full">
            <Dotnav
                setToggleSideMenu={setToggleSideMenu}
                toggleSideMenu={toggleSideMenu}
                name={_id}
                children={
                    <Menu
                        arrOfMenu={!isAccountOwner ?
                            generalMenuForBlogpost
                            : accountOnwerMenuForBlogpost
                        }
                        id="MenuForBlogpost"
                        parentClass='flex-col gap-2 absolute top-0 -right-2 min-w-[140px] max-w-[320px] backdrop-blur-sm p-3 rounded shadow-sm z-20 cursor-pointer'
                        childClass=""
                    />
                }
            />
        </span>
        <span id="author-shortInfor" >
            <UsershortInfor
                userName={authorUserName}
            />
        </span>
        <Link id="blogpostInfor" to={'/' + url} className="block w-full space-y-2">
            {type &&
                type === 'text' ?
                <span id="text-title" className="block w-full text-xl font-semibold first-letter:capitalize text-center">
                    {title}
                </span> :
                <span id="_html-title" className="flex justify-center items-center" dangerouslySetInnerHTML={sanitizeHTML(_html.title)}></span>
            }
            <span id="more-infor" className="block font-secondary text-sm space-y-1">
                <span className="block">
                    <span id="Published" className="block"> Published: {createdAt}</span>
                    <span id="Last published">Last published: {updatedAt}</span>
                </span>
                <span id="catigory" className="block">catigory: {catigory}</span>

            </span>
            <span id="display-image" className="flex justify-center" >
                {displayImage ?
                    <Displayimage
                        id="blogpostimage"
                        imageUrl={'/api/image/' + displayImage}
                        parentClass={type === 'text' ? 'w-[280px] h-[160px]' : "w-full h-[320px]"}
                        imageClass="object-contain rounded-md"
                        placeHolder={blogpostImagePlaceHolder}
                    />
                    : null}
            </span>
        </Link>
        <span id="blogpost-text" className="w-full ">
            {type &&
                type === 'text' ?
                <span id="text" className="block text-start" >
                    {trimedWords}
                    <>
                        {(body.split(' ').length > trimedWordsInitailNum) ?
                            <>
                                {
                                    trimedWordsDone ?
                                        <span className="text-blue-300 cursor-pointer pl-1" onClick={() => trimWords(trimedWordsNumRef.current = 10)} >See less</span> :
                                        <span className="text-blue-500 cursor-pointer pl-1" onClick={() => trimWords(trimedWordsNumRef.current += 10)} >see more</span>
                                }
                            </> :
                            null
                        }
                    </>
                </span> :
                <span id="_html" className="block w-full border-y py-3" dangerouslySetInnerHTML={sanitizeHTML(_html.body)}></span>
            }
        </span>
        <span id="blogpost-statisties" className="flex justify-around gap-4 w-full">
            <Commentbutton
                loadingComment={loadingComment}
                arrOfcomment={
                    (getCommentData || [])
                        .sort((a, b) => {
                            if (a.authorUserName === authorUserName) return -1;
                            if (a.authorUserName === authorUserName) return 1;
                            return 0
                        })}
                blogpostAuthorUserName={authorUserName}
                blogpostId={_id}
                blogpostUrl={url}
                blogpostTitle={title}

                autoOpenTargetComment={autoOpenTargetComment}
            />
            <Likebutton
                parentId={_id}
                arrOfLikes={likes}
                apiForLike={'/api/likeblogpost/' + _id}
                apiForUnlike={'/api/blogposts/shares/' + _id}

                autoOpenTargetLike={{ ...autoOpenTargetBlogpostLike, commentId: autoOpenTargetBlogpostLike.blogpostId }}

                notificationTitle={title}
                notificationUrl={url}
                userNameToNotify={authorUserName}
                liking="blogpostLike"
            />
            <Sharebutton
                shares={blogpost.shares}
                url={'/api/blogposts/shares/' + _id}

                notificationUrl={url + '/#blogpost-statistics'}
                notificationTitle={title}
            />
            <Viewbutton
                url={'/api/viewblogpost/' + _id}
                elementRef={blogpostRef}
                arrOfViews={views}
                onLoadView={type?.trim() !== 'text' ? true : false}

                notificationUrl={url + '/#blogpost-statistics'}
                notificationTitle={title}
            />
        </span>
    </article>
};

export default Singleblogpost;
