import { useEffect, useState } from "react";
import Button from "./Button";
import { useNotification, usePatchData } from "../hooks";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { follow, unFollow } from "../redux/slices/userProfileSlices";


const Followbutton = ({ userNameToFollow }: { userNameToFollow: string }) => {
    const { userProfile } = useAppSelector((state) => state.userProfileSlices);
    const { data: profileData, loading: loadingUserProfileData } = userProfile;
    const [followed, setFollowed] = useState(false);
    const { patchData, loading: loadingFollow } = usePatchData<{ userName: string }>();
    const appDispatch = useAppDispatch();

    const notify = useNotification();

    useEffect(() => {
        if (!profileData?.following) return;
        setFollowed(profileData.following.includes(userNameToFollow));
    }, [profileData?.following, loadingUserProfileData]);

    const handleFollow = async (userNameToFollow: string) => {
        if (followed) return;

        const body = null;
        const response = await patchData('/api/follow/' + userNameToFollow, body);
        const { data, ok } = response;

        if (ok && data) {
            appDispatch(follow(data.userName));
            setFollowed(true);

            await handleNotification(userNameToFollow, 'followed you, you can follow them back', 'follow');
        };
    };

    const handleUnfollow = async (userNameToFollow: string) => {
        if (!followed) return;

        const body = null;
        const response = await patchData('/api/unfollow/' + userNameToFollow, body);
        const { data, ok } = response;

        if (ok && data) {
            appDispatch(unFollow(data.userName));
            setFollowed(false);

            await handleNotification(userNameToFollow, 'unfollowed you, you can unfollow them back', 'unfollow');
        };
    };

    const handleNotification = async (userNameToNotify: string, msg: string, type: string) => {
        const { userName, name } = profileData;
        const url = '/api/notification/' + userNameToNotify;
        const body = {
            typeOfNotification: type,
            msg: msg,
            url: '/' + userName,
            notifyFrom: userName,
        };

        await notify(url, body);
    };

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
