import { useEffect, useState } from "react";
import Button from "./Button";
import { useNotification, usePatchData, useUserIsLogin } from "../hooks";
import Dialog from "./Dialog";
import UsershortInfor from "./UsershortInfor";
import Userdotnav from "./Userdotnav";

type Props = {
    parentId: string
    arrOfLikes: string[]
    apiForLike: string,
    apiForUnlike: string

    autoOpenTargetLike: { autoOpen: boolean, commentId: string, like: string },

    notificationUrl: string
    notificationTitle: string
    userNameToNotify: string
    liking: string;
};

const Likebutton = ({
    parentId,
    arrOfLikes,
    apiForLike,
    apiForUnlike,

    autoOpenTargetLike = { autoOpen: false, commentId: '', like: '' },

    userNameToNotify,
    notificationTitle,
    notificationUrl,
    liking,
}: Props) => {
    const { loginStatus: { loginUserName } } = useUserIsLogin();

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState<string[]>(
        autoOpenTargetLike?.autoOpen && autoOpenTargetLike?.like ?
            [autoOpenTargetLike.like, ...arrOfLikes.filter(item => item !== autoOpenTargetLike.like)] :
            arrOfLikes
    );
    const { patchData, loading: loadingLike } = usePatchData();
    const notify = useNotification();

    const [toggleLikesDialog, setToggleLikesDialog] = useState(' ');

    const [targetLike, setTargetLike] = useState(' ');

    const handlelike = async (apiForLike: string) => {
        if (liked) return;
        const url = apiForLike;
        const body = null;

        const response = await patchData<{likes: string[]}>(url, body);
        const { data, ok } = response;

        if (data) {
            setLikes(data.likes);
            setLiked(true);

            handleNotification();
        };

    };

    const handleUnlike = async (apiForUnlike: string) => {
        if (!liked) return;
        const url = apiForUnlike;
        const body = null;

        const response = await patchData<{likes: string[]}>(url, body);
        const { data, ok } = response;

        if (data) {
            setLikes(data?.likes);
            setLiked(false);
        };
    };

    const handleNotification = async () => {
        const isOwnerOfBlogpost = userNameToNotify === loginUserName;
        if (isOwnerOfBlogpost) return;

        const url = '/api/notification/' + userNameToNotify;
        const body = {
            typeOfNotification: liking,
            msg: `liked your ${liking.includes('blogpost') ? 'blogpost' : 'comment'}, ${notificationTitle}`,
            url: notificationUrl,
            notifyFrom: loginUserName,
        };

        await notify(url, body);
    };

    useEffect(() => {
        setLiked((likes).includes(loginUserName));
    }, [
        likes,
        loginUserName,
    ]);

    useEffect(() => {
        setTimeout(() => {
            setToggleLikesDialog(autoOpenTargetLike?.autoOpen ? autoOpenTargetLike?.commentId : ' ')
        }, 1000);

        setTargetLike(autoOpenTargetLike?.autoOpen ? autoOpenTargetLike?.like : ' ');

        setTimeout(() => {
            setTargetLike(' ');
        }, 2000);
    }, [
        autoOpenTargetLike?.autoOpen,
        autoOpenTargetLike?.commentId
    ])

    return <div>
        <div>
            <Button
                id='like-btn'
                children={<>
                    {
                        (!loadingLike ?
                            (!liked ?
                                'like' :
                                'liked') :
                            'loading...')
                    }
                    : <span className="bg-blue-200 P-1" onClick={(e) => { setToggleLikesDialog(parentId); e.stopPropagation() }} >
                        {likes ? likes.length : 0}
                    </span>
                </>
                }
                buttonClass="text-sm border px-1 rounded-md"
                handleClick={() => { !liked ? handlelike(apiForLike) : handleUnlike(apiForUnlike) }}
            />
        </div>
        <div>
            <Dialog
                id='blogpost-like-dialog'
                parentClass='flex justify-center'
                childClass=' w-full min-w-[280px] sm:min-w-[320px] max-w-[768px] overflow-y-scroll max-h-screen pb-[200px]'
                currentDialog={parentId}
                dialog={toggleLikesDialog}
                setDialog={setToggleLikesDialog}
                children={
                    <div className="flex flex-col items-center gap-4 py-2">
                        <span>{likes ? likes.length : 0} : likes</span>
                        <div>
                            {likes &&
                                likes.length ?
                                <>
                                    {likes.map((item, index) =>
                                        <div
                                            key={item}
                                            className={` relative  ${index % 2 == 0 ? 'border-b rounded-md' : 'border-none'}  ${targetLike === item ? 'bg-red-50' : ''} `} >
                                            <div className="pr-12 py-3">
                                                <UsershortInfor userName={item} />
                                            </div>
                                            <Userdotnav userName={item} />
                                        </div>
                                    )}
                                </> :
                                <div>be the first to like</div>
                            }
                        </div>
                    </div>
                }
            />
        </div>
    </div>
};

export default Likebutton;
