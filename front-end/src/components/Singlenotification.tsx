import { useNavigate } from "react-router-dom";
import { Notificationsprops } from "../entities";
import { usePatchData } from "../hooks";
import Button from "./Button";
import { useAppDispatch } from "../redux/slices";
import { viewedNotification, deleteNotification } from "../redux/slices/userProfileSlices";
import UsershortInfor from "./UsershortInfor";
import { FaRegComments, FaRegEye } from "react-icons/fa";
import { SlLike, SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { MdDeleteOutline } from "react-icons/md";

type Props = {
    notification: Notificationsprops,
    displayImage: boolean
};

const Singlenotification = ({ notification, displayImage }: Props) => {
    const { msg, url, checked, notifyFrom, typeOfNotification, pegs } = notification;

    const { patchData: viewNotification } = usePatchData();
    const { patchData: patchDeleteNotification, loading: loadingDelete } = usePatchData();
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    const reStructureIncomingNotifications = [notification, ...(pegs || [])]
        .reduce((acc: Notificationsprops[], curr: Notificationsprops) => {
            const pre = (acc || []).map(item => item.notifyFrom);

            if (pre.includes(curr.notifyFrom)) {
                acc.push({ ...curr, notifyFrom: ' ' });
            } else {
                acc.push(curr);
            };

            return acc;
        }, []);

    const handleNotificationViewed = async (_id: string) => {
        await viewNotification<{ notification: Notificationsprops }>('/api/notification/viewed/' + _id, null)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                appDispatch(viewedNotification({ _id }));
            });

    };

    const handleNavigateToNotification = (url: string, type: string, notifyFrom: string) => {
        const splitUrl = url.split('/'); //slipt url to get each address
        const getUrl = splitUrl.slice(0, 2).join('/'); // get blogpost url
        const parentCommentId = splitUrl[2]; // get parent comment id
        const commentId = splitUrl[splitUrl.length - 1] // get the target comment id
        let commentAddress = splitUrl.slice(2, (splitUrl.length - 1)).join('/')


        if (type === 'blogpostComment') {
            commentAddress = ''; // it is a parent comment

            const commentNotification = {
                autoOpenComment: true,
                parentCommentId,
                commentId,
                commentAddress,
            };

            navigate(getUrl, { state: { commentNotification } });

        } else if (type === 'replyComment') {

            const commentNotification = {
                autoOpenComment: true,
                parentCommentId,
                commentAddress,
                commentId,
            };

            navigate(getUrl, { state: { commentNotification } });

        } else if (type === 'commentLike') {

            const commentNotification = {
                autoOpenComment: true,
                parentCommentId,
                commentAddress,
                commentId,
                targetCommentLike: { autoOpenCommentLike: true, likeCommentId: commentId, commentlike: notifyFrom }
            };

            navigate(getUrl, { state: { commentNotification } });

        } else if (type === 'blogpostLike') {
            const blogpostLikeNotification = {
                autoOpenBlogpostLike: true,
                blogpostlike: notifyFrom,
            };

            navigate(getUrl, { state: { blogpostLikeNotification } });

        } else {
            navigate(getUrl);
        };

        reStructureIncomingNotifications.map(item => {
            if (item.checked === false) {
                handleNotificationViewed(item._id);
            };
        }).reverse();
    };

    const handleDeleteNotification = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        reStructureIncomingNotifications.map(async item => {
            await patchDeleteNotification<{ _id: string }>('/api/notification/delete/' + item._id, null)
                .then((res) => {
                    const { data } = res;
                    if (!data) return;

                    appDispatch(deleteNotification({ _id: data._id }));
                });
        })
            .reverse();

    };

    const Displayicon = () => {
        if (typeOfNotification === 'view') return <FaRegEye size={24} />
        if (typeOfNotification === 'follow') return <SlUserFollow size={24} />
        if (typeOfNotification === 'unfollow') return <SlUserUnfollow size={24} />
        if (typeOfNotification === 'blogpostComment') return <FaRegComments size={24} />
        if (typeOfNotification === 'replyComment') return <FaRegComments size={24} />
        if (typeOfNotification === 'commentLike') return <SlLike size={22} />
        if (typeOfNotification === 'blogpostlike') return <SlLike size={22} />
    };

    return <div
        id="comment-Notifications-layout"
        className={`flex gap-2 items-center p-2 rounded-md ${checked ? ' ' : 'bg-yellow-500'} cursor-pointer`}
        onClick={() => handleNavigateToNotification(url, typeOfNotification, notifyFrom)}
    >
        <div>
            <Displayicon />
        </div>
        <div className="flex -space-x-6">
            {displayImage ?
                reStructureIncomingNotifications.map((item, index) =>
                    item.notifyFrom.trim() === '' || index > 2 ?
                        null :
                        <UsershortInfor userName={item.notifyFrom} displayName={false} />
                ).reverse()
                :
                null
            }
        </div>
        <div className="text-sm font-text text-wrap truncate">{
            <>
                {reStructureIncomingNotifications.map((item, index) =>
                    index > 2 ?
                        <span key={item._id}> and +{(reStructureIncomingNotifications.length - 3)}</span> :
                        (reStructureIncomingNotifications.length - 1) === index &&
                            (reStructureIncomingNotifications.length - 1) > 0 &&
                            item.notifyFrom.trim() ?
                            <span key={item._id}>
                                and <span className="font-bold">{item.notifyFrom.slice(1)}</span>
                            </span> :
                            <span key={item._id}>
                                <span className="font-bold">{item.notifyFrom.slice(1)}</span>
                                {(reStructureIncomingNotifications.length - 1) >= 0 &&
                                    item.notifyFrom.trim() ? ' '
                                    : ' '
                                }
                            </span>
                )}
                <span className="ml-1" dangerouslySetInnerHTML={{ __html: msg }}></span>
            </>
        }</div>
        <div className="flex-1 flex justify-end">
            <Button
                id="delete-notification"
                buttonClass=""
                children={<MdDeleteOutline size={22} />}
                handleClick={(e) => handleDeleteNotification(e)}
            />
        </div>
    </div>
};

export default Singlenotification;
