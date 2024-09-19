import { useEffect, useState } from "react";
import Button from "./Button";
import { usePatchData, useUserIsLogin } from "../hooks";
import Dialog from "./Dialog";
import UsershortInfor from "./UsershortInfor";
import Followbutton from "./Followbutton";
import Userdotnav from "./Userdotnav";

type Props = {
    arrOfLikes: string[]
    apiForLike: string,
    apiForUnlike: string
};

const Likebutton = ({ arrOfLikes, apiForLike, apiForUnlike }: Props) => {
    const { loginStatus: { loginUserName } } = useUserIsLogin();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState<string[]>(arrOfLikes);
    const { patchData, loading: loadingLike } = usePatchData();

    const [toggleDialog, setToggleDialog] = useState('');

    useEffect(() => {
        setLiked((likes).includes(loginUserName));
    }, [likes, loginUserName]);


    const handlelike = async (apiForLike: string) => {
        if (liked) return;
        const url = apiForLike;
        const body = null;

        const response = await patchData(url, body);
        const { data, ok } = response;

        if (ok) {
            setLikes(data);
            setLiked(true);
        };

    };

    const handleUnlike = async (apiForUnlike: string) => {
        if (!liked) return;
        const url = apiForUnlike;
        const body = null;

        const response = await patchData(url, body);
        const { data, ok } = response;

        if (ok) {
            setLikes(data);
            setLiked(false);
        };
    };

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
                    : <span className="bg-blue-200 P-1" onClick={(e) => { setToggleDialog('blogpostlikedialog'); e.stopPropagation() }} >
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
                currentDialog='blogpostlikedialog'
                dialog={toggleDialog}
                setDialog={setToggleDialog}
                children={
                    <div className="flex flex-col items-center gap-4 py-2">
                        <span>{likes ? likes.length : 0} : likes</span>
                        <div>
                            {likes &&
                                likes.length ?
                                <>
                                    {likes.map((item, index) =>
                                        <div key={item} className={`relative flex items-start gap-6 py-4 px-2 ${index % 2 == 0 ? 'border-b rounded-md' : 'border-none'}`}>
                                            <UsershortInfor userName={item} />
                                            <Userdotnav userName={item} />
                                            <div className="mt-6">
                                                {loginUserName === item ?
                                                    null :
                                                    <Followbutton userName={item} />
                                                }

                                            </div>
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
