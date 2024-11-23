import { Blogpostprops, Commentprops } from "../entities"
import { useNavigate } from "react-router-dom";
import Displayimage from "./Displayimage";
import blogpostImagePlaceHolder from '../assert/imageplaceholder.png';
import UsershortInfor from "./UsershortInfor";
import Menu from "./Menu";
import Button from "./Button";
import { useRef, useState } from "react";
import Dotnav from "./Dotnav";
import { useConvertRawDate, useDeleteData, useFetchData, usePatchData, useSanitize, useTrimWords } from "../hooks";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import Likebutton from "./Likebutton";
import Commentbutton from "./Commentbutton";
import Viewbutton from "./Viewbutton";
import Savesbutton from "./Savesbutton";
import Sharebutton from "./Sharebutton";
import { decreaseTotalNumberOfPublishedBlogposts, deletePublishedBlogpost, removeTimelineFeeds, addUnpublishBlogposts } from "../redux/slices/userBlogpostSlices";
import { LuExternalLink } from "react-icons/lu"
import { FiEdit } from "react-icons/fi"
import { FaLongArrowAltDown } from "react-icons/fa"
import { MdBlock, MdDeleteOutline } from "react-icons/md"
import { TfiFlagAlt2 } from "react-icons/tfi";
import tw from "tailwind-styled-components";
import LandLoading from "./LandLoading";
import Backwardnav from "./Backwardnav";

type Props = {
    blogpost: Blogpostprops
    type: string
    index?: number
    callBack?: ({ _id }: { _id: string }) => void,
    autoOpenTargetComment?: { autoOpen: boolean, commentId: string, commentAddress: string, comment: Commentprops | null, blogpostId: string, targetLike: { autoOpen: boolean, commentId: string, like: string } }
    autoOpenTargetBlogpostLike?: { autoOpen: boolean, blogpostId: string, like: string }
};

const Singleblogpost = ({
    blogpost,
    type,
    index = 0,
    callBack = ({ _id = '' }) => null,
    autoOpenTargetComment = { autoOpen: false, commentId: '', commentAddress: '', comment: null, blogpostId: '', targetLike: { autoOpen: false, commentId: '', like: '' } },
    autoOpenTargetBlogpostLike = { autoOpen: false, blogpostId: '', like: ' ', }
}: Props) => {
    const { userProfile: { data: profileData } } = useAppSelector((state) => state.userProfileSlices);

    const { patchData, loading: loadingUnpublished } = usePatchData();
    const { deleteData: deleteBlogpostData, loading: loadingDeleteBlogpost } = useDeleteData();
    const navigate = useNavigate();

    const {
        _id, displayImage, authorUserName,
        title, body, _html, catigory, url, likes, views,
        updatedAt, createdAt, shares, status } = blogpost;
    const [toggleSideMenu, setToggleSideMenu] = useState('');
    const isAccountOwner = authorUserName === profileData?.userName
    const appDispatch = useAppDispatch();

    const { trimedWords } = useTrimWords(body, 50);
    const sanitizeHTML = useSanitize();
    const blogpostRef = useRef<HTMLElement | null>(null);

    const { data: getCommentData, loading: loadingComment } =  // api for blogpost parent comments
        useFetchData<Commentprops[] | null>(`/api/comments/blogpost/${_id}?skip=0&limit=10`, [_id]);
    const handleReadableDate = useConvertRawDate()

    const handleViewBlogpost = (url: string) => {
        navigate(url);
    };

    const generalMenu = [
        {
            name: 'view',
            content: <Button
                id="see-all-of-blogpost-btn"
                buttonClass="flex gap-2"
                children={<><LuExternalLink size={20} />  View</>}
                handleClick={() => handleViewBlogpost('/' + url)}
            />
        },
    ];

    const intaracttionMenu = [
        ...generalMenu,
        {
            name: 'save',
            to: '',
            content: <Savesbutton
                saves={profileData?.saves || []}
                blogpost={blogpost}
            />
        },
        {
            name: 'report',
            to: '',
            content: <Button
                id="report-content-btn"
                buttonClass="flex gap-2"
                children={<><TfiFlagAlt2 size={20} />  Report</>}
                handleClick={() => ''}
            />
        },
        {
            name: 'block',
            to: '',
            content: <Button
                id="report-content-btn"
                buttonClass="flex gap-2"
                children={<><MdBlock size={20} />  Block</>}
                handleClick={() => ''}
            />
        },
    ];

    const accountOnwerMenuForBlogpost = [
        ...generalMenu,
        {
            name: 'edit',
            to: '',
            content: <Button
                id="edit-blogpost-btn"
                buttonClass="flex gap-2"
                children={<><FiEdit size={20} /> Edit</>}
                handleClick={() => handleEditBlogpost(blogpost)}
            />
        },
        {
            name: 'unpublished',
            to: '',
            content: <Button
                id="unpublished-blogpost-btn"
                buttonClass="flex gap-2"
                children={<><FaLongArrowAltDown size={20} /> Unpublish</>}
                handleClick={() => handleUnpublishBlogpost(_id)}
            />
        },
        {
            name: 'delete',
            to: '',
            content: <Button
                id="delete-blogpost-btn"
                buttonClass="flex gap-2"
                children={<><MdDeleteOutline size={22} /> Delete</>}
                handleClick={() => handleDeleteBlogpost(_id, status)}
            />
        },
    ];

    const handleEditBlogpost = (blogpost: Blogpostprops) => {
        navigate('/createpost', { state: { edit: true, data: blogpost } });
    };

    const handleUnpublishBlogpost = async (_id: string) => {
        const body = {
            status: 'unpublished',
        };
        const url = '/api/editblogpost/' + _id;

        await patchData<Blogpostprops>(url, body)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                callBack({ _id });
                appDispatch(deletePublishedBlogpost({ _id }));
                appDispatch(decreaseTotalNumberOfPublishedBlogposts(1));
                appDispatch(appDispatch(removeTimelineFeeds({ _id })));
                appDispatch(addUnpublishBlogposts(data));
            });
    };

    const handleDeleteBlogpost = async (_id: string, status: string) => {
        const url = '/api/deleteblogpost/' + _id;
        await deleteBlogpostData(url)
            .then((res) => {
                callBack({ _id });
                appDispatch(deletePublishedBlogpost({ _id }));
                appDispatch(appDispatch(removeTimelineFeeds({ _id })));
                if (status === 'published') appDispatch(decreaseTotalNumberOfPublishedBlogposts(1));
            });
    };

    return <>
        {!(loadingDeleteBlogpost || loadingUnpublished) ?
            <Article ref={blogpostRef}
                className={` ${type === 'text' ? 'max-w-[480px] xl:min-w-[768px] xl:max-w-[768px]' : ' '} 
                ${(index % 2 !== 0) ? "border-y" : ''}`}>
                <div className="relative w-full">
                    <Dotnav
                        id="blogpost-nav"
                        setToggleSideMenu={setToggleSideMenu}
                        toggleSideMenu={toggleSideMenu}
                        name={_id}
                        children={
                            <Menu
                                id="MenuForBlogpost"
                                parentClass='absolute top-0 -right-2 min-w-[140px] max-w-[320px] backdrop-blur-sm p-3 rounded shadow-sm z-20 cursor-pointer space-y-4'
                                childClass=""
                                arrOfMenu={!isAccountOwner ?
                                    intaracttionMenu
                                    : accountOnwerMenuForBlogpost
                                }
                            />
                        }
                    />
                </div>
                <div className="flex items-center">
                    {
                        type &&
                            type === 'text' ?
                            null :
                            <Backwardnav pageName="" />
                    }
                    <UsershortInfor
                        userName={authorUserName}
                    />
                </div>
                <span id="post-body" onClick={() => handleViewBlogpost('/' + url)}
                    className={`block w-full text-center space-y-2 ${type === 'text' ? 'cursor-pointer' : "cursor-text"}`}>
                    {type &&
                        type === 'text' ?
                        <span id="text-title" className="w-full text-xl sm:text-2xl font-semibold first-letter:capitalize">
                            {title}
                        </span> :
                        <span id="_html-title" className="flex justify-center" dangerouslySetInnerHTML={sanitizeHTML(_html.title)}>

                        </span>
                    }
                    <span id="blopost-infor" className="block font-secondary text-sm space-y-2">
                        <span id="date" >
                            Last upated<span> {handleReadableDate(updatedAt)}</span>
                        </span>
                        <span id="catigory"
                            className="block text-start w-full font-semibold">
                            {catigory?.split(' ').map((item =>
                                <span key={item}>.{item}</span>
                            ))}
                        </span>
                    </span>
                    {type &&
                        type === 'text' ?
                        <span id="text" className="block text-start w-full text-wrap py-2" >
                            {trimedWords}
                            <span className="text-blue-500 cursor-pointer"> see more</span>
                        </span> :
                        <span id="_html" className="block text-start w-full py-2" dangerouslySetInnerHTML={sanitizeHTML(_html.body)}>
                        </span>
                    }
                    {displayImage ?
                        <Displayimage
                            id="blopost-display-image"
                            imageId={displayImage}
                            parentClass={`w-full  ${type === 'text' ? "h-[140px]" : "h-[320px]"}`}
                            imageClass="object-cover rounded-md"
                            placeHolder={blogpostImagePlaceHolder}
                        />
                        :
                        null
                    }
                </span>
                <span id="blogpost-statisties" className=" relative flex justify-around gap-4 w-full">
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
                        apiForUnlike={'/api/unlikeblogpost/' + _id}

                        autoOpenTargetLike={{ ...autoOpenTargetBlogpostLike, commentId: autoOpenTargetBlogpostLike.blogpostId }}

                        notificationTitle={title}
                        notificationUrl={url}
                        userNameToNotify={authorUserName}
                        liking="blogpostLike"
                    />
                    <Sharebutton
                        arrOfShares={shares}
                        blogpostUrl={url}
                        apiForShare={'/api/blogpost/share/' + _id}

                        notificationUrl={url + '/#blogpost-statistics'}
                        notificationTitle={title}
                    />
                    <Viewbutton
                        arrOfViews={views}
                        apiForView={'/api/viewblogpost/' + _id}
                        elementRef={blogpostRef}
                        onLoadView={type?.trim() !== 'text' ? true : false}

                        notificationUrl={url + '/#blogpost-statistics'}
                        notificationTitle={title}
                    />
                </span>
            </Article> :
            <LandLoading loading={(loadingDeleteBlogpost || loadingUnpublished)} />
        }
    </>
};

export default Singleblogpost;

const Article = tw.article`
flex 
flex-col 
items-start 
gap-4 
font-text 
w-full 
px-2 
py-1
`
