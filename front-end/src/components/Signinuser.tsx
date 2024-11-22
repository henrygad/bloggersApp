import { useState } from 'react';
import { useUserIsLogin, usePostData } from '../hooks';
import Input from './Input';
import tw from 'tailwind-styled-components';
import { Userstatusprops } from '../entities';
import Button from './Button';
import Cookies from 'js-cookie';


type Props = {
    switchPages: () => void
    closePages: () => void
};

const Signinuser = ({ switchPages, closePages }: Props) => {
    const [value, setValue] = useState('');
    const [passWord, setPassWord] = useState('');
    const { postData, loading, error } = usePostData()

    const { setLoginStatus } = useUserIsLogin();
    const setCookie = (myCookieValue: string) => { // create cookies to keep user login
        Cookies.set('blogbackclient', myCookieValue, {
            expires: 1, // Cookie expires in 1 days
            secure: true, // Ensures the cookie is only sent over HTTPS
            sameSite: 'Strict', // Prevents cross-site request forgery (adjust as needed)
        });
    };

    const handleSignInUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = '/api/login';
        const body = { value, password: passWord };

        await postData<Userstatusprops>(url, body) // sign up user
            .then((res) => {
                const { data, ok } = res;
                if (ok && data) {
                    setCookie(data.loginUserName);
                    setLoginStatus({ ...data });
                    setValue('');
                    setPassWord('');
                    closePages();
                    switchPages();
                } else {
                    setPassWord('');
                };
            })
    };

    return <form
        action=""
        onSubmit={handleSignInUser}
        className='space-y-12'
    >
        <span className="block text-4xl font-primary capitalize mt-2 text-center">
            Wellcome back!
        </span>
        <Inputwrapper >
            <span className='block text-2xl font-primary text-center capitalize'>Log In</span>
            <Input
                id='signin-username-input'
                type='text'
                inputName='Username or Email'
                inputClass='block w-full text-sm outline-blue-700 border-2 p-2 mt-2 rounded-md'
                labelClass='block text-base font-text'
                value={value}
                setValue={(value) => setValue(value as string)}
                error={{
                    isTrue: (error?.trim() !== '' ? true : false),
                    errorMsg: ''
                }}
            />
            <Input
                id='signin-passWord-input'
                type='password'
                inputName='Password'
                inputClass='block w-full text-sm outline-blue-700 border-2 p-2 mt-2 rounded-md'
                labelClass='block text-base font-text'
                value={passWord}
                setValue={(value) => setPassWord(value as string)}
                error={{
                    isTrue: (error?.trim() !== '' ? true : false),
                    errorMsg: ''
                }}
            />
            <span id='btn' className='block'>
                <Button
                    id='signin-user-btn'
                    buttonClass='w-full font-bold text-white bg-green-800 rounded-md p-3 shadow-md'
                    children={loading ? "loading..." : "Log in"}

                />
                <ol className='list-decimal py-1' >
                    {[...new Set(error.replace('Error:', '').split('.'))].map((error) =>
                        <li key={error} className='block text-red-500 text-sm text-wrap'>
                            {error}
                        </li>
                    )}
                </ol>
            </span>
            <span className='block text-sm text-center hover:text-green-500 transition-colors cursor-pointer'>
                Forget password
            </span>
        </Inputwrapper>
        <div>
            <span className='block text-center cursor-pointer' onClick={switchPages}>
                Create new account
                <p className='text-green-500'>sign up!</p>
            </span>
        </div>
    </form>
};

const Inputwrapper = tw.div`
p-8
border 
shadow-md
space-y-6
`

export default Signinuser;
