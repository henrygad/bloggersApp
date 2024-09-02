import useContextAuthentication from "./useContextAuthentication"

const useIsAccountOwner = (currentUser:  string | null | undefined) => {
    const {loginUser} = useContextAuthentication();
    let isOwnerOfAccount = false;
    
    if (loginUser === currentUser) {
        isOwnerOfAccount = true;
        return {isOwnerOfAccount};
    } else return {isOwnerOfAccount};
};

//export default useIsAccountOwner;
