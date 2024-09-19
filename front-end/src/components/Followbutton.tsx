import { useEffect, useState } from "react";
import Button from "./Button";
import { usePatchData } from "../hooks";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { addFollowing, removeFollowing } from "../redux/slices/userProfileSlices";


const Followbutton = ({ userName }: { userName: string }) => {
    const { userProfile } = useAppSelector((state) => state.userProfileSlices);
    const { data, loading: loadingUserProfile } = userProfile;
    const [followed, setFollowed] = useState(false);

    const { patchData, loading: loadingFollow } = usePatchData();
    const appDispatch = useAppDispatch();

    useEffect(() => {
        if (!data) return;
        const { following } = data;
        setFollowed(following?.includes(userName));
    }, [data, loadingUserProfile]);

    const handleFollow = async (userName: string) => {
        if (followed) return;
        const body = null;
        const response = await patchData('/api/follow/' + userName, body);
        const { data, ok } = response;

        if (ok && data) {
            appDispatch(addFollowing(data.followed));
            setFollowed(true);
        };
    };

    const handleUnfollow = async (userName: string) => {
        if (!followed) return;

        const body = null;
        const response = await patchData('/api/unfollow/' + userName, body);
        const { data, ok } = response;

        if (ok && data) {
            appDispatch(removeFollowing(data.unFollowd));
            setFollowed(false);
        };
    }

    return <Button
        id='follow-btn'
        children={!loadingFollow ?
            (!followed ?
                'Follow' :
                'Following') :
            'loading...'
        }
        buttonClass="text-sm border px-1 rounded-md"
        handleClick={() => { !followed ? handleFollow(userName) : handleUnfollow(userName) }}
    />
};

export default Followbutton;
