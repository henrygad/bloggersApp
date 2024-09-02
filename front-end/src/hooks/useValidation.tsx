
type Props = {
    userName: string
    email: string
    passWord: string
    confirmPassWord: string
};

const useValidation = () => {
    const userNameLengthISGreaterThen = 4;
    const strongPassWord = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*?+=._-]).{8,}$/;
    const validEmail = /^([a-z0-9_.-]+)@([a-z0-9.-]+).([a-z.]{2,5})$/;

    const validate = ({ userName, email, passWord, confirmPassWord }: Props): { isTrue: boolean, msg: string } => {
        if(!userName || 
            !email || 
            !passWord || 
            !confirmPassWord
        ) return { isTrue: true, msg: 'empty field' };
        if (userName.length < userNameLengthISGreaterThen) return { isTrue: true, msg: 'username most be more then 5 letters/characters' };
        if (!email.match(validEmail)) return { isTrue: true, msg: 'invalid email' };
        if (!passWord.match(strongPassWord)) return { isTrue: true, msg: 'password not strong enough (most be atleats 8 characters long)' };
        if (confirmPassWord !== passWord) return { isTrue: true, msg: 'password confirmation did not match' };
        else return { isTrue: false, msg: '' };
    };

    return validate
};

export default useValidation