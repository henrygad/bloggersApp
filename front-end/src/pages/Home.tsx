import { useSelector } from "react-redux";
import { useDeleteData, usePostData, useUserIsLogin } from "../hooks";

const Home = () => {
    const { postData, } = usePostData();
    const { deleteData } = useDeleteData()
    const { loginStatus, setLoginStatus } = useUserIsLogin();
    const {userBlogposts } = useSelector((state) => state.userBlogpostSlices);

    const handleLogOut = async () => {
        const url = '/api/logout';
        const body = { userName: loginStatus.loginUserName };
        const response = await postData(url, body);
        if (response.ok) {
            const data = await response.data;

            setLoginStatus({ isLogin: data.status, loginUserName: data.loginUserName });
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
