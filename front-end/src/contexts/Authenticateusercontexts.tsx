import { ReactElement, createContext, useEffect, useState } from "react";
import { useFetchData } from "../hooks";
import { Userstatusprops } from "../entities";


type Contextprops = {
  loginStatus: Userstatusprops
  setLoginStatus: React.Dispatch<React.SetStateAction<Userstatusprops>>
};

const userStatus = {
  isLogin: false,
  loginUserName: '',
  greetings: '',
  sessionId: '',
};

export const Context = createContext<Contextprops>({
  loginStatus: userStatus,
  setLoginStatus: () => (userStatus)
});


const Authenticateusercontexts = ({ Children }: { Children: ReactElement }) => {
  const { fetchData } = useFetchData<Userstatusprops | null>(null);
  const [loginStatus, setLoginStatus] = useState<Userstatusprops>(userStatus);

  const handleClientStatus = async () => {
      const { data: client } = await fetchData('/api/');

      if(client){
        setLoginStatus({
          isLogin: false ,
          loginUserName: '',
          greetings: client.greetings,
          sessionId: client.greetings,
        });
      };

      const {data: user} = await fetchData('/api/status');

      if(user){
        setLoginStatus((pre)=> pre ? {...pre, ...user} : pre);
      };
  };

  useEffect(() => {
    handleClientStatus()
  }, []);

  return <Context.Provider value={{ loginStatus, setLoginStatus }}>
    {Children}
  </Context.Provider>
}

export default Authenticateusercontexts
