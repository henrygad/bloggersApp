import { useUserIsLogin } from '../hooks';
import UsershortInfor from './UsershortInfor'
import Followbutton from './Followbutton';
import Userdotnav from './Userdotnav';
import tw from 'tailwind-styled-components';

const Singleuser = ({ userName, index = 0 }: { index?: number, userName: string }) => {
  const { loginStatus: { loginUserName } } = useUserIsLogin();
  const isAccountOwner = loginUserName === userName;

  return <Singleuserwrapper className={index % 2 == 0 ? 'border-b' : 'border-none'}>
    <UsershortInfor userName={userName} />
    <div className='flex  gap-6'>
      {isAccountOwner ?
        null :
        <div>
          <Followbutton userNameToFollow={userName} />
        </div>
      }
      <Userdotnav userName={userName} />
    </div>
  </Singleuserwrapper>
};

export default Singleuser;

const Singleuserwrapper = tw.div`
relative
w-full 
flex 
justify-between
p-4
`