import { useContext } from "react";
import { Context } from "../contexts/Authenticateusercontexts";


const useUserIsLogin = () => {
  const  {loginStatus, setLoginStatus} =  useContext(Context);

  return{loginStatus, setLoginStatus};
};

export default useUserIsLogin;
