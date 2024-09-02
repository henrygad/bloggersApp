import axios from "axios";
import { ReactElement, createContext, useState } from "react";

type Contextprops = {
  loginStatus: {
    isLogin: boolean;
    loginUserName: string;
  }
  setLoginStatus: React.Dispatch<React.SetStateAction<{
    isLogin: boolean;
    loginUserName: string;
  }>>
};

export const Context = createContext<Contextprops>({
  loginStatus: {
    isLogin: false,
    loginUserName: '',
  },
  setLoginStatus: () => ({
    isLogin: false,
    loginUserName: '',
  })
});

const status = {
  isLogin: false,
  loginUserName: ''
};

try {

  const response = await axios('/api/status')
  const { data } = response;
  status.isLogin = data.status;
  status.loginUserName = data.loginUser;

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
