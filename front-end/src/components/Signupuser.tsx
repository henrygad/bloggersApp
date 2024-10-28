import React, { useState } from 'react';
import { useUserIsLogin, usePostData } from '../hooks';
import tw from 'tailwind-styled-components';
import Input from './Input';
import { Userstatusprops } from '../entities';
import Button from './Button';

type Props = {
    switchPages: () => void
    closePages: () => void
};

const Signupuser = ({ switchPages, closePages }: Props) => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [passWord, setPassWord] = useState('');
    const [confirmPassWord, setConfirmPassWord] = useState('');

    const { postData, loading, error } = usePostData();
    const { setLoginStatus } = useUserIsLogin();

    const handleSignUPUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = '/api/signup';
        const body = { userName, email, password: passWord, comfirmPassword: confirmPassWord };

        await postData<Userstatusprops>(url, body)// sign up user
            .then((res) => {
                const { data, ok } = res;
                if (data) {
                    setLoginStatus({ ...data });
                    setUserName('');
                    setEmail('');
                    setPassWord('');
                    setConfirmPassWord('');
                    closePages();
                } else {
                    setPassWord('');
                    setConfirmPassWord('');
                };
            })
    };

    return <form
        action=""
        onSubmit={handleSignUPUser}
        className='space-y-6'
    >
        <Inputwrapper >
            <span className='block text-2xl font-primary text-center capitalize'>Sign up</span>
            <Input
                id='signup-username-input'
                type='text'
                inputName='username'
                labelClass='block text-base font-text first-letter:capitalize'
                inputClass='block w-full outline-blue-700 border-2 p-2 mt-2 rounded-md'
                value={userName}
                setValue={(value) => { setUserName(value as string) }}
                error={{
                    isTrue: (
                        error.toLowerCase().includes('field') ||
                        error.toLowerCase().includes('username')
                    ),
                    errorMsg: error.replace('Error:', '')
                }}
            />
            <Input
                id='signup-email-input'
                type='email'
                inputName='email'
                labelClass='block text-base font-text first-letter:capitalize'
                inputClass='block w-full  outline-blue-700 border-2 p-2 mt-2 rounded-md'
                value={email}
                setValue={(value) => setEmail(value as string)}
                error={{
                    isTrue: (
                        error.toLowerCase().includes('field') ||
                        error.toLowerCase().includes('email')
                    ),
                    errorMsg: error.replace('Error:', '')
                }}
            />
            <span className='block relative'>
                <Input
                    id='signup-password-input'
                    type='password'
                    inputName='password'
                    labelClass='block text-base font-text first-letter:capitalize'
                    inputClass='block w-full  outline-blue-700 border-2 p-2 mt-2 rounded-md'
                    value={passWord}
                    setValue={(value) => setPassWord(value as string)}
                    error={{
                        isTrue: (
                            error.toLowerCase().includes('field') ||
                            error.toLowerCase().includes('password')
                        ),
                        errorMsg: error.replace('Error:', '')
                    }}
                />
                <span className='block relative'>
                <span className='absolute -bottom-5 right-1 text-wrap text-[.8rem] font-text '>
                    Password must be 8 characters long
                    </span>
                </span>
            </span>
            <Input
                id='signup-confirmpassword-input'
                type='password'
                inputName='confirm password'
                labelClass='block text-base font-text first-letter:capitalize'
                inputClass='block w-full  outline-blue-700 border-2 p-2 mt-2 rounded-md'
                value={confirmPassWord}
                setValue={(value) => setConfirmPassWord(value as string)}
                error={{
                    isTrue: (
                        error.toLowerCase().includes('field') ||
                        error.toLowerCase().includes('passwords did not match')
                    ),
                    errorMsg: error.replace('Error:', '')
                }}
            />
            <Button
                id='signin-user-btn'
                buttonClass='w-full font-bold text-white bg-green-500 p-3 border shadow-md shadow-green-200'
                children={loading ? "loading..." : "Sign up"}

            />
        </Inputwrapper>
        <div>
            <span className='block text-center cursor-pointer' onClick={switchPages}>
                Already have an account?
                <p className='text-green-500'>Log in!</p>
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

export default Signupuser
