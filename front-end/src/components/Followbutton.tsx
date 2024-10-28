import { useEffect, useState } from "react";
import Button from "./Button";
import { useNotification, usePatchData } from "../hooks";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { follow, unFollow } from "../redux/slices/userProfileSlices";


const Followbutton = ({ userNameToFollow }: { userNameToFollow: string }) => {
    const { userProfile: {
        data: profileData, 
        loading: loadingUserProfileData
    } } = useAppSelector((state) => state.userProfileSlices);
    const [followed, setFollowed] = useState(false);
    const { patchData, loading: loadingFollow } = usePatchData();
    const appDispatch = useAppDispatch();

    const notify = useNotification();

    const handleFollow = async (userNameToFollow: string) => {
        if (followed) return;

        const body = null;
        const response = await patchData<{ userName: string }>('/api/follow/' + userNameToFollow, body);
        const { data, ok } = response;

        if (ok && data) {
            appDispatch(follow({userName: data.userName}));
            setFollowed(true);

            await handleNotification(userNameToFollow, 'followed you, you can follow them back', 'follow');
        };
    };

    const handleUnfollow = async (userNameToFollow: string) => {
        if (!followed) return;

        const body = null;
        const response = await patchData<{ userName: string }>('/api/unfollow/' + userNameToFollow, body);
        const { data, ok } = response;

        if (ok && data) {
            appDispatch(unFollow({userName: data.userName}));
            setFollowed(false);

            await handleNotification(userNameToFollow, 'unfollowed you, you can unfollow them back', 'unfollow');
        };
    };

    const handleNotification = async (userNameToNotify: string, msg: string, type: string) => {
        if(!profileData) return;
        const { userName, name} = profileData;

        const url = '/api/notification/' + userNameToNotify;
        const body = {
            typeOfNotification: type,
            msg: msg,
            url: '/' + userName,
            notifyFrom: userName,
        };

        await notify(url, body);
    };

    useEffect(() => {
        if (!profileData?.following) return;
        setFollowed(profileData.following.includes(userNameToFollow));
    }, [profileData?.following, loadingUserProfileData]);

    return <Button
        id='follow-btn'
        children={!loadingFollow ?
            (!followed ? 'Follow' : 'Following') :
            'loading...'
        }
        buttonClass="text-sm border px-1 rounded-md"
        handleClick={() => { !followed ? handleFollow(userNameToFollow) : handleUnfollow(userNameToFollow) }}
    />
};

export default Followbutton;
