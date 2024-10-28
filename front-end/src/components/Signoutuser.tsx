import { Userstatusprops } from "../entities";
import { usePostData, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { deleteProfile } from "../redux/slices/userProfileSlices";
import Button from "./Button";

const Signoutuser = () => {
    const { postData, } = usePostData();
    const {setLoginStatus } = useUserIsLogin();
    const appDispatch = useAppDispatch();

    const handleLogOut = async () => {
        const url = '/api/logout';
        const response = await postData<Userstatusprops>(url, null);
        const { ok, data } = response;

        if (ok && data) {
            setLoginStatus((pre) => pre ? { ...pre, ...data } : pre);
            appDispatch(deleteProfile({ data: null, loading: true, error: '' }));
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
