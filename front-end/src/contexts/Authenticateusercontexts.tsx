import axios from "axios";
import { ReactElement, createContext, useState } from "react";

type Contextprops = {
  loginStatus: {
    isLogin: boolean
    loginUserName: string
    greetings: string
    sessionId: string
  }
  setLoginStatus: React.Dispatch<React.SetStateAction<{
    isLogin: boolean
    loginUserName: string
    greetings: string
    sessionId: string
  }>>
};

export const Context = createContext<Contextprops>({
  loginStatus: {
    isLogin: false,
    loginUserName: '',
    greetings: '',
    sessionId: '',
  },
  setLoginStatus: () => ({
    isLogin: false,
    loginUserName: '',
    greetings: '',
    sessionId: '',
  })
});

const status = {
  isLogin: false,
  loginUserName: '',
  greetings: '',
  sessionId: '',
};

try {
  const clientData = await axios('/api/');
  const { data: getClientData } = clientData;
  status.sessionId = getClientData.sessionId;
  status.greetings = getClientData.greetings;

  const userData = await axios('/api/status');
  const { data: getUserData } = userData;
  status.isLogin = getUserData.status;
  status.loginUserName = getUserData.loginUser;
  status.sessionId = getUserData.sessionId;
  status.greetings = getUserData.greetings;

} catch (error) {
  console.error(error);
}


const Authenticateusercontexts = ({ Children }: { Children: ReactElement }) => {
  const [loginStatus, setLoginStatus] = useState(status);

  return <Context.Provider value={{ loginStatus, setLoginStatus }}>
    {Children}
  </Context.Provider>
}

export default Authenticateusercontexts
