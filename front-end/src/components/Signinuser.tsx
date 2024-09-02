import { useState } from 'react';
import { useUserIsLogin, usePostData } from '../hooks';
import Input from './Input';
import tw from 'tailwind-styled-components';

type Props = {
    switchPages: () => void
    closePages: () => void
};

const Signinuser = ({ switchPages, closePages }: Props) => {
    const [value, setValue] = useState('');
    const [passWord, setPassWord] = useState('');
    const { postData, loading, error: signInError } = usePostData();
    const url = 'api/login';
    const { setLoginStatus } = useUserIsLogin();

    const handleSignInUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const body = { value, password: passWord };
        const response = await postData(url, body); // sign up user

        if (response?.ok) {// login user
            const { data: { status, loginUser } } = response;
            setLoginStatus({
                isLogin: status,
                loginUserName: loginUser,
            });
            setValue('');
            setPassWord('');
            closePages();
            switchPages();
        } else {
            setPassWord('');
            setValue('');
        };
    };

    return <form
        action=""
        onSubmit={handleSignInUser}
        className='space-y-6'
    >
        <div>
            <h2 className='text-center text-xl capitalize font-primary'>Log in</h2>
        </div>
        <Inputwrapper >
            <Input
                type='text'
                inputName='username or email'
                inputClass='block w-full text-sm outline-blue-700 border-2 p-2 mt-2 rounded-md'
                value={value}
                setValue={(value) => setValue(value as string)}
                labelClass='block text-sm'
                error={{
                    isTrue: (signInError ? signInError.trim() !== '' : false),
                    errorClass: '',
                    errorMsg: 'invalid credentials!'
                }}
            />
            <Input
                type='password'
                inputName='password'
                inputClass='block w-full text-sm outline-blue-700 border-2 p-2 mt-2 rounded-md'
                value={passWord}
                setValue={(value) => setPassWord(value as string)}
                labelClass='block text-sm'
                error={{
                    isTrue: (signInError ? signInError.trim() !== '': false),
                    errorClass: '',
                    errorMsg: 'invalid credentials!'
                }}
            />
            <div>
                <button
                    className='w-full text-base bg-green-600 p-3 border shadow-md shadow-green-200'>
                    {loading ? "loading..." : "Log in"}
                </button>
            </div>
        </Inputwrapper>
        <div>
            <span className='block text-center cursor-pointer' onClick={switchPages}>Don't have an account?
                <p className='text-green-400'>sign up!</p>
            </span>
        </div>
    </form>
};

const Inputwrapper = tw.div`
font-secondary 
min-w-[240xp] 
sm:min-w-[380px] 
max-w-[480px] 
p-4
border 
shadow-md
space-y-6
`

export default Signinuser;
