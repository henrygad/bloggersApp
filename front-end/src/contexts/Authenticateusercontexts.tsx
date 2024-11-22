import { ReactElement, createContext, useEffect, useState } from "react";
import { useFetchData } from "../hooks";
import { Userstatusprops } from "../entities";
import Cookies from 'js-cookie';

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

const getCookie = () => {
  const cookieValue = Cookies.get('blogbackclient');
  if (cookieValue) {
    return {
      isLogin: true,
      loginUserName: cookieValue,
    };
  } else {
    return {
      isLogin: false,
      loginUserName: '',
    }
  };
};

const Authenticateusercontexts = ({ Children }: { Children: ReactElement }) => {
  const { data: clientData } = useFetchData('/');
  const [loginStatus, setLoginStatus] = useState<Userstatusprops>({ ...userStatus, ...getCookie() });
  const { fetchData } = useFetchData<Userstatusprops>('');

  const userIsStillLogin = () => {
    fetchData('/api/status')
      .then((res) => {
        const { data } = res;
        if (data) {
          setLoginStatus((pre) => pre ? { ...pre, ...data } : pre); // update user login
          if (data.loginUserName === '' && data.isLogin === false) { // if user is logout 
            Cookies.remove('blogbackclient'); // delete blogbackclient cookies
          };
        };
      })
      .catch((err) => {
        Cookies.remove('blogbackclient'); // delete blogbackclient cookies if error occures
      });
  };

  useEffect(() => {
    userIsStillLogin();
  }, []);

  useEffect(() => {
    if (!clientData) return;
    setLoginStatus((pre) => pre ? { ...pre, ...clientData } : pre)
  }, [clientData]);

  return <Context.Provider value={{ loginStatus, setLoginStatus }}>
    {Children}
  </Context.Provider>
};

export default Authenticateusercontexts;
