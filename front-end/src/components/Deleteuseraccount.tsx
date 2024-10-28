import { useDeleteData, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { deleteProfile } from "../redux/slices/userProfileSlices";
import Button from "./Button";

const Deleteuseraccount = () => {
  const { deleteData } = useDeleteData();
  const { setLoginStatus } = useUserIsLogin();
  const appDispatch = useAppDispatch();

  const handleDeleteAccount = async () => {
    const url = '/api/deleteprofile';
    await deleteData<{ deleted: string }>(url)
      .then((res) => {
        const { data } = res;
        if (!data) return;

        setLoginStatus((pre) => pre ? { 
          ...pre, 
          isLogin: false,
          loginUserName: '',
          greetings: data.deleted
        } : pre);
        appDispatch(deleteProfile({ data: null, loading: true, error: '' }));
      });
  };

  return <Button
    id={'delete-user-account-btn'}
    children={'delete account'}
    buttonClass={'border'}
    handleClick={handleDeleteAccount}
  />
};

export default Deleteuseraccount;
