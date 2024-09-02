import {  useParams } from 'react-router-dom';
import { useFetchData, useUserIsLogin } from '../hooks';
import { useSelector } from 'react-redux';
import { Profilesec } from '../sections'


const Profile = () => {
  const { userName } = useParams();
  if (!userName) return;

  const { loginStatus: { isLogin, loginUserName } } = useUserIsLogin();

  // check whether current user is on his own profile page
  const isAccountOwner = (userName === loginUserName);

  // fetch and deisplay other account profiles when visited
  const {
    data: otherAccountProfileDatas,
    error: otherAccountProfileDatasError,
    loading: otherAccountProfileDatasLoading,
  } = useFetchData(!isAccountOwner ? `/api/users/${userName}` : '', [userName]);
// fetch and deisplay other account profiles blogpost when visited
  const {
    data: otherAccountProfileBlogpostDatas,
    loading: otherAccountProfileBlogpostLoading,
    error: otherAccountProfileBlogpostError } = useFetchData(!isAccountOwner ? `/api/blogposts/${userName}`: null, [userName]);


  // display owner of account profile
  const { userProfile: {
    data: accountProfileData,
    loading: accountProfileDataLoading,
    error: accountProfileDataError }
  } = useSelector((state) => state.userProfileSlices);
 // display owner of account profile blogpost
  const { userBlogposts: {
    data: accountProfileBlogpost,
    error: accountProfileBlogpostError,
    loading: accountProfileBlogpostLoading } } = useSelector((state) => state.userBlogpostSlices);

    
//console.log(accountProfileData);

  return <div className='w-full h-full'>
    {
      isAccountOwner ?
        <Profilesec
          profileLoading={accountProfileDataLoading}
          profileError={accountProfileDataError}
          profileData={accountProfileData}
          profileBlogposts={accountProfileBlogpost}
          profileBlogpostsLoading={accountProfileBlogpostError}
          profileBlogpostsError={accountProfileBlogpostLoading}
        /> :
        <Profilesec
          profileLoading={otherAccountProfileDatasLoading}
          profileError={otherAccountProfileDatasError}
          profileData={otherAccountProfileDatas as any}
          profileBlogposts={otherAccountProfileBlogpostDatas as any}
          profileBlogpostsLoading={otherAccountProfileBlogpostLoading}
          profileBlogpostsError={otherAccountProfileBlogpostError}
        />
    }

  </div>
};

export default Profile;
