import { Userstatusprops } from "../entities";
import { usePostData, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { clearProfile } from "../redux/slices/userProfileSlices";
import Button from "./Button";
import Cookies from 'js-cookie';

const Signoutuser = () => {
    const { postData, } = usePostData();
    const { setLoginStatus } = useUserIsLogin();
    const appDispatch = useAppDispatch();

    const handleLogOut = async () => {
        const url = '/api/logout';
        const response = await postData<Userstatusprops>(url, null);
        const { data } = response;

        if (data) {
            Cookies.remove('blogbackclient');
            setLoginStatus((pre) => pre ? { ...pre, ...data } : pre);
            appDispatch(clearProfile({ data: null, loading: true, error: '' }));
        };
    };

    return <Button
        id={'logout-btn'}
        children={'logout'}
        buttonClass={'border-b p-1'}
        handleClick={handleLogOut}
    />
};

export default Signoutuser;
