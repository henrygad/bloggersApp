import { useState } from "react";
import { Commentprops } from "../entities";
import { useCopyLink, useDeleteData, useSanitize, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { decreaseTotalNumberOfUserComments, deleteComments } from "../redux/slices/userCommentsSlices";
import Button from "./Button";
import Dotnav from "./Dotnav";
import Likebutton from "./Likebutton";
import Menu from "./Menu";
import UsershortInfor from "./UsershortInfor";
import { useNavigate } from "react-router-dom";
import { MdBlock, MdDeleteOutline, MdOutlineChatBubbleOutline } from "react-icons/md";
import tw from "tailwind-styled-components";
import { TfiFlagAlt2 } from "react-icons/tfi";
import { FaCheck } from "react-icons/fa";
import { BsCopy } from "react-icons/bs";


type Props = {
    comment: Commentprops
    index?: number
};



const Usercomment = ({ comment, index }: Props) => {
    const { loginStatus: { loginUserName } } = useUserIsLogin();
    const { _id, parentId, body, authorUserName, parentUrl, likes, children, commentIsAReplyTo } = comment;
    const isAccountOwner = loginUserName === authorUserName; // is user comment

    const { deleteData: deleteCommentData, loading: deleteCommentLoading } = useDeleteData();

    const sanitizeHTML = useSanitize();
    const { copied, handleCopyLink } = useCopyLink(parentUrl + '/' + _id);

    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    const [toggleSideMenu, setToggleSideMenu] = useState('');

    const generalMenu = [
        {
            name: 'copy comment link',
            to: '',
            content: <Button
                id="copy-comment-link"
                buttonClass="flex items-center gap-2"
                handleClick={() => handleCopyLink()}
                children={<>{copied ? <FaCheck color="green" size={20} /> : <BsCopy size={20} />} Copy</>}
            />
        },

    ];

    const intaracttionMenu = [
        ...generalMenu,
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

    const accountOnwerMenuForComment = [
        ...generalMenu,
        {
            name: 'delete',
            to: '',
            content: <Button
                id="delete-comment-btn"
                buttonClass="flex items-center gap-1"
                children={<><MdDeleteOutline size={26} /> Delete</>}
                handleClick={() => { handleDeleteComment(_id) }}
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

    return <Singleusercomment id={'blogpost-comment-' + _id} >
        <div className="relative">
            <Dotnav
                id="comments-nav"
                name={_id}
                toggleSideMenu={toggleSideMenu}
                setToggleSideMenu={setToggleSideMenu}
                children={
                    <Menu
                        arrOfMenu={!isAccountOwner ?
                            intaracttionMenu
                            : accountOnwerMenuForComment}
                        id="MenuForComment"
                        parentClass='absolute top-0 -right-2 min-w-[140px] max-w-[320px] backdrop-blur-sm p-3 rounded shadow-sm z-20 cursor-pointer space-y-4'
                        childClass=""
                    />
                }
            />
        </div>
        <UsershortInfor
            userName={authorUserName}
        />
        <div className="space-y-4 cursor-pointer" onClick={() => handleViewComment()}>
            <div id="comment-text" dangerouslySetInnerHTML={sanitizeHTML(body?._html)} >
            </div>
            <div id="comment-statistics" className="flex justify-start items-center gap-4">
                <Button
                    id="reply-comment-btn"
                    buttonClass="flex items-center gap-2"
                    children={<> <MdOutlineChatBubbleOutline size={20} /> {children.length || 0}</>}
                />
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
    </Singleusercomment>
};

export default Usercomment;

const Singleusercomment = tw.div`
relative 
w-full 
min-w-[280px] 
sm:min-w-[320px] 
md:min-w-[480px] 
max-w-[480xp] 
py-4 
px-3 
space-y-4
`
