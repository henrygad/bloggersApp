import { useSelector } from "react-redux";
import { useDeleteData, usePostData, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { addProfile } from "../redux/slices/userProfileSlices";

const Home = () => {
    const { postData, } = usePostData();
    const { deleteData } = useDeleteData()
    const { loginStatus, setLoginStatus } = useUserIsLogin();
    const appDispatch = useAppDispatch();

    const handleLogOut = async () => {
        const url = '/api/logout';
        const body = { userName: loginStatus.loginUserName };
        const response = await postData(url, body);
        if (response.ok) {
            const data = response.data;
            setLoginStatus({ isLogin: false, loginUserName: '' });
            appDispatch(addProfile({data: null, loading: true , error: ''}));
        };
    };

    const handleDeleteAccount = async () => {
        const url = '/api/deleteprofile';
        const response = await deleteData(url);
        if (response.ok) {
            const data = await response.data;
            console.log(data);
            setLoginStatus({ isLogin: false, loginUserName: '' });
        };
    };

    return <h1>Home
        <button onClick={handleLogOut} >logout</button>
        <div> <button onClick={handleDeleteAccount} >delete accoutn</button></div>
    </h1>
};

export default Home;
