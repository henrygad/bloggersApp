import { useState } from "react";
import { Commentprops } from "../entities";
import { useCopyLink, useDeleteData, useSanitize } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { decreaseTotalNumberOfUserComments, deleteComments } from "../redux/slices/userCommentsSlices";
import Button from "./Button";
import Dotnav from "./Dotnav";
import Likebutton from "./Likebutton";
import Menu from "./Menu";
import UsershortInfor from "./UsershortInfor";
import { useNavigate } from "react-router-dom";
type Props = {
    comment: Commentprops
    index?: number
};



const Usercomment = ({ comment, index }: Props) => {
    const { _id, blogpostId, parentId, body, authorUserName, parentUrl, likes, children, commentIsAReplyTo } = comment;

    const { deleteData: deleteCommentData, loading: deleteCommentLoading } = useDeleteData();

    const sanitizeHTML = useSanitize();
    const { copied, handleCopyLink } = useCopyLink(parentUrl + '/' + _id);

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    const [toggleSideMenu, setToggleSideMenu] = useState('');

    const menuForComment = [
        {
            name: 'copy link',
            to: '',
            content: <Button
                id="copy-comment-link"
                children={<>
                    Copy link {copied ? <span className="text-green-500">Copied</span> : null}
                </>}
                buttonClass="border-b"
                handleClick={() => handleCopyLink()}
            />
        },
        {
            name: 'delete',
            to: '',
            content: <Button
                id="share-blogpost-link"
                children={!deleteCommentLoading ? 'Delete' : 'delete loading...'}
                buttonClass="border-b"
                handleClick={() => { handleDeleteComment(comment._id) }}
            />
        },

    ];

    const handleViewComment = () => {
        const splitUrl = (parentUrl + '/' + _id).split('/'); //slipt url to get each address
        const getUrl = splitUrl.slice(0, 2).join('/'); // get blogpost url
        const parentCommentId = splitUrl[2]; // get parent comment id
        const commentId = splitUrl[splitUrl.length - 1] // get the target comment id
        let commentAddress = splitUrl.slice(2, (splitUrl.length - 1)).join('/')

        if (parentId === 'null') {
            commentAddress = ''; // it is a parent comment
        };

        const commentNotification = {
            autoOpenComment: true,
            parentCommentId,
            commentAddress,
            commentId,
        };

        console.log(parentUrl)
        console.log(commentNotification)

        navigate("/" + getUrl, { state: { commentNotification } });
    };

    const handleDeleteComment = async (_id: string) => {
        if (!_id) return;
        const url = '/api/deletecomment/' + _id;
        const response = await deleteCommentData(url);
        const { data } = response;

        if (data) {
            appDispatch(deleteComments({ _id }));
            appDispatch(decreaseTotalNumberOfUserComments(1));
        };
    };

    return <div
        id={'blogpost-comment-' + _id}
        className="relative w-full min-w-[280px] sm:min-w-[320px] md:min-w-[480px] max-w-[480xp] rounded-md px-3 py-4 space-y- 2">
        <Dotnav
            id="comments-nav"
            name={_id}
            toggleSideMenu={toggleSideMenu}
            setToggleSideMenu={setToggleSideMenu}
            children={
                <Menu
                    arrOfMenu={menuForComment}
                    id="MenuForComment"
                    parentClass='flex-col gap-2 absolute top-0 -right-2 min-w-[140px] max-w-[320px] backdrop-blur-sm p-3 rounded shadow-sm z-20 cursor-pointer'
                    childClass=""
                />
            }
        />
        <UsershortInfor
            userName={authorUserName}
        />
        <div className="cursor-pointer" onClick={() => handleViewComment()}>
            <div id="comment-text" dangerouslySetInnerHTML={sanitizeHTML(body?._html)} >

            </div>
            <div id="comment-statistics" className="flex justify-center items-center gap-4">
                <span
                    id="reply-comment-btn"
                    className="">
                    Replies {children.length || 0}
                </span>
                <Likebutton
                    parentId={_id}
                    arrOfLikes={likes}
                    apiForLike={'/api/likecomment/' + _id}
                    apiForUnlike={'/api/unlikecomment/' + _id}

                    autoOpenTargetLike={{ autoOpen: false, commentId: '', like: '' }}

                    notificationTitle={body.text}
                    userNameToNotify={authorUserName}
                    notificationUrl={parentUrl + '/' + _id}
                    liking="commentLike"
                />
            </div>
        </div>
    </div>
};

export default Usercomment;
