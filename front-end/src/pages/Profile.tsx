import { useParams } from 'react-router-dom';
import { useUserIsLogin } from '../hooks';
import { Othersprofilesec, Ownerprofilesec, } from '../sections'


const Profile = () => {
  const { userName } = useParams();
  if (!userName) return;

  const { loginStatus: { loginUserName } } = useUserIsLogin();

  // check whether current user is on his own profile page
  const isAccountOwner = (userName.trim().toLocaleLowerCase() === loginUserName.trim().toLocaleLowerCase());


  return <div className=''>
    {
      isAccountOwner ?
        <Ownerprofilesec loginUserName={loginUserName} /> :
        <Othersprofilesec userName={userName} />  
    }
  </div>
};

export default Profile;
