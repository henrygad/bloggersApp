import { useDeleteData, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { addProfile } from "../redux/slices/userProfileSlices";
import Button from "./Button";

const Deleteuseraccount = () => {
  const { deleteData } = useDeleteData();
  const { setLoginStatus } = useUserIsLogin();
  const appDispatch = useAppDispatch();

  const handleDeleteAccount = async () => {
    const url = '/api/deleteprofile';
    const response = await deleteData(url);
    const { ok, data } = response;

    if (ok && data) {
      setLoginStatus((pre) => pre ? { ...pre, ...data } : pre);
      appDispatch(addProfile({ data: null, loading: true, error: '' }));
    };
  };

  return <Button
    id={'delete-user-account-btn'}
    children={'delete account'}
    buttonClass={'border'}
    handleClick={handleDeleteAccount}
  />
};

export default Deleteuseraccount;
