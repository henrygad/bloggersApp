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
  searchHistory: []
};

export const Context = createContext<Contextprops>({
  loginStatus: userStatus,
  setLoginStatus: () => (userStatus)
});


const Authenticateusercontexts = ({ Children }: { Children: ReactElement }) => {
  const { fetchData } = useFetchData<Userstatusprops | null>(null);
  const [loginStatus, setLoginStatus] = useState<Userstatusprops>(userStatus);

  const handleClientStatus = async () => {
     await fetchData('/api/status').then((response)=> {
      const {data} = response;
      if(!data) return
      setLoginStatus({...data})
     });

      await fetchData('/api/').then((response)=> {
        const {data} = response;
        if(!data) return;
        setLoginStatus((pre)=> pre? {...pre, ...data}: pre);
      });
  };

  useEffect(() => {
    handleClientStatus()
  }, []);

  return <Context.Provider value={{ loginStatus, setLoginStatus }}>
    {Children}
  </Context.Provider>
}

export default Authenticateusercontexts
