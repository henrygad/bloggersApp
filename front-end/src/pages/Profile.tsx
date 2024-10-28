import { useParams } from 'react-router-dom';
import { useFetchData, useUserIsLogin } from '../hooks';
import { Othersprofilesec, Ownerprofilesec, } from '../sections'
import { useAppSelector } from '../redux/slices';
import { Userprops } from '../entities';


const Profile = () => {
  const { userName } = useParams();
  if (!userName) return;
  const { loginStatus: { loginUserName } } = useUserIsLogin();
  const isAccountOwner = (userName.trim().toLocaleLowerCase() === loginUserName.trim().toLocaleLowerCase()); // check whether current user is on his own profile page

  //other account visted my the account owner ...
  const {
    data: getOthersProfile,
    loading: getOthersProfileLoading,
    error: getOthersProfileError,
  } = useFetchData<Userprops>(!isAccountOwner ? `/api/users/${userName}` : null, [userName, isAccountOwner === false]);


  // Owner of account profile data ...
  const { userProfile: {
    data: ownerProfileData,
    loading: ownerProfileDataLoading,
    error: ownerProfileDataError
  } } = useAppSelector((state) => state.userProfileSlices);



  return <div className=''>
    {
      isAccountOwner ?
        <Ownerprofilesec
          data={ownerProfileData as Userprops}
          loading={ownerProfileDataLoading}
          error={ownerProfileDataError}
        /> :
        <Othersprofilesec
          data={getOthersProfile as Userprops}
          loading={getOthersProfileLoading}
          error={getOthersProfileError}
          userName={userName} />
    }
  </div>
};

export default Profile;
