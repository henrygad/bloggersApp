import { useNavigate } from "react-router-dom";
import { Notificationsprops, UsershortInforprops } from "../entities";
import Displayimage from "./Displayimage";
import { useFetchData, usePatchData } from "../hooks";
import Button from "./Button";
import { useAppDispatch } from "../redux/slices";
import { updateNotification } from "../redux/slices/userProfileSlices";

type Props = {
    notification: Notificationsprops,
    displayImage: boolean
};


const Advater = ({ notifyFrom }: { notifyFrom: string }) => {
    const { data: userData, loading: loadingUserData } = useFetchData<UsershortInforprops | null>('/api/users/' + notifyFrom, [notifyFrom]);
    const navigate = useNavigate();

    const handleProfileLink = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, userName: string) => {
        navigate('/' + userName);
        e.stopPropagation();
    };

    return <Displayimage
        id={userData?.name || ''}
        imageUrl={'/api/image/' + userData?.displayImage}
        parentClass="h-[40px] w-[40px]"
        imageClass='object-contain rounded-full'
        placeHolder=''
        onClick={(e) => handleProfileLink(e, notifyFrom)}
    />
};

const Singlenotification = ({ notification, displayImage }: Props) => {
    const { msg, url, checked, notifyFrom, typeOfNotification, pegs } = notification;
    const { patchData: checkedNotification } = usePatchData();
    const { patchData: deleteNotification, loading: loadingDelete } = usePatchData();
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    const reStructureIncomingNotifications =
        [notification, ...(pegs || [])]
            .reduce((acc: Notificationsprops[], curr: Notificationsprops) => {
                const pre = (acc || []).map(item=> item.notifyFrom);

                if (pre.includes(curr.notifyFrom)) {
                    acc.push({ ...curr, notifyFrom: ' ' });
                } else {
                    acc.push(curr);
                };

                return acc;
            }, []);

    const handleRedirectToNotificationURL = (url: string, type: string, notifyFrom: string) => {
        const splitUrl = url.split('&');

        if (type === 'blogpostComment') {
            const getUrl = splitUrl[0];
            const parentCommentId = splitUrl[1];
            const commentAddress = 'donotopenitchildrencomments';

            const commentNotification = {
                autoOpenComment: true,
                parentCommentId,
                commentId: splitUrl[splitUrl.length - 1],
                commentAddress,
            };

            navigate("/" + getUrl, { state: { commentNotification } });

        } else if (type === 'replyComment') {
            const getUrl = splitUrl[0];
            const parentCommentId = splitUrl[1];
            const commentId = splitUrl[splitUrl.length - 1];
            const removeTheFirstUlr = splitUrl.slice(1);
            const removeThelastUrl =  removeTheFirstUlr.slice(0, -1);
            const addressLeadingToTheTargetComment = removeThelastUrl.join('&');

            const commentNotification = {
                autoOpenComment: true,
                parentCommentId,
                commentAddress: addressLeadingToTheTargetComment,
                commentId,
            };

            navigate("/" + getUrl, { state: { commentNotification } });

        } else if (type === 'commentLike') {
            const getUrl = splitUrl[0];
            const parentCommentId = splitUrl[1];
            const likeCommentId = splitUrl[splitUrl.length - 1];
            const removeTheFirstUlr = splitUrl.slice(1);
            const removeThelastUrl =  removeTheFirstUlr.slice(0, -1);
            const addressLeadingToTheTargetComment = removeThelastUrl.join('&');

            const commentNotification = {
                autoOpenComment: true,
                parentCommentId,
                commentAddress: addressLeadingToTheTargetComment,
                commentId: '',
                targetCommentLike: { autoOpenCommentLike: true, likeCommentId, commentlike: notifyFrom }
            };
            
            navigate("/" + getUrl, { state: { commentNotification } });

        } else if (type === 'blogpostLike') {
            const blogpostLikeNotification = {
                autoOpenBlogpostLike: true,
                blogpostlike: notifyFrom,
            };

            navigate("/" + url, { state: { blogpostLikeNotification } });

        } else if (type === 'share' || type === 'view') {
            navigate("/" + url);
        } else {
            navigate(url);
        };

        reStructureIncomingNotifications.map(item => {
            handleViewedNotification(item._id);
        }).reverse();
    };

    const handleDeleteNotification = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation();
        reStructureIncomingNotifications.map(async item => {
            const response = await deleteNotification('/api/deletenotification/' + item._id, null);
            const { ok, data } = response;
            if (ok) {
                appDispatch(updateNotification(data));
            };
        }).reverse();

    };

    const handleViewedNotification = async (_id: string) => {
        const response = await checkedNotification('/api/editnotification/' + _id, null);
        const { data, ok } = response;
        if (ok) {
            appDispatch(updateNotification(data));
        };
    };

    return <>
        <div
            id="comment-Notifications-layout"
            className={`flex gap-3 items-start p-2 rounded-md w-full ${checked ? ' ' : 'bg-red-50'} cursor-pointer`}
            onClick={() => handleRedirectToNotificationURL(url, typeOfNotification, notifyFrom)}
        >
            <div className="flex -space-x-6">
                {displayImage ?
                    reStructureIncomingNotifications.map((item, index) =>
                        item.notifyFrom.trim()  === '' || index > 2? 
                         null :
                         <Advater key={item._id} notifyFrom={item.notifyFrom} />
                    ).reverse()
                    :
                    null
                }
            </div>
            <div className="text-sm font-text text-wrap truncate">{
                <>
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
                                            item.notifyFrom.trim() ? ', '
                                            : ' '
                                        }
                                    </span>
                        )}
                    </>
                    <span className="ml-1" dangerouslySetInnerHTML={{ __html: msg }}></span>
                </>
            }</div>
            <div className="flex-1 flex justify-end pl-4">
                <Button
                    id="delete-notification"
                    buttonClass=" block border"
                    children={!loadingDelete ? 'delete' : 'loaidng...'}
                    handleClick={(e) => handleDeleteNotification(e)}
                />

            </div>
        </div>
    </>
}

export default Singlenotification;
