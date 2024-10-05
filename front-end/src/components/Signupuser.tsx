import React, { useState } from 'react';
import { useUserIsLogin, useValidation, usePostData } from '../hooks';
import tw from 'tailwind-styled-components';
import Input from './Input';
import { Userstatusprops } from '../entities';

type Props = {
    switchPages: () => void
    closePages: () => void
};

const Signupuser = ({ switchPages, closePages }: Props) => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [passWord, setPassWord] = useState('');
    const [confirmPassWord, setConfirmPassWord] = useState('');
    const { postData, loading, error: signUpError } = usePostData();
    const [validationError, setValidationError] = useState(''); // start here
    const url = '/api/signup';
    const { setLoginStatus } = useUserIsLogin();
    const validate = useValidation();

    const handleSignUPUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = { userName, email, password: passWord };
        const error = validate({ userName, email, passWord, confirmPassWord }); // 

        if (error.isTrue) {
            setValidationError(error.msg);
            setPassWord('');
            setConfirmPassWord('');
            return;
        };

        const response = await postData<Userstatusprops>(url, body); // sign up user
        const {ok, data} = response;

        if (ok && data) {
            setLoginStatus({
                isLogin: data.isLogin,
                loginUserName: data.loginUserName,
            });
            setUserName('');
            setEmail('');
            setPassWord('');
            setConfirmPassWord('');
            closePages();
        } else {
            setPassWord('');
            setConfirmPassWord('');
        };
    };

    let error = (validationError || signUpError) ?
        (validationError || signUpError.slice(6)) :
        '';
        
    return <form
        action=""
        onSubmit={handleSignUPUser}
        className='space-y-6'
    >
        <div>
            <h2 className='text-center text-xl capitalize font-primary'>Sign up</h2>
        </div>
        <Inputwrapper >
            <Input
                type='text'
                inputName='username'
                inputClass='block w-full outline-blue-700 border-2 p-2 mt-2 rounded-md'
                value={userName}
                setValue={(value) => { setUserName(value as string) }}
                labelClass='block text-sm'
                error={{
                    isTrue: (error.trim() !== '' &&
                        (error.includes('username') || error.includes('empty field'))
                    ),
                    errorClass: '',
                    errorMsg: error
                }}
            />
            <Input
                type='email'
                inputName='email'
                inputClass='block w-full  outline-blue-700 border-2 p-2 mt-2 rounded-md'
                value={email}
                setValue={(value) => setEmail(value as string)}
                labelClass='block text-sm'
                error={{
                    isTrue: (error.trim() !== '' &&
                        (error.includes('email') || error.includes('empty field'))
                    ),
                    errorClass: '',
                    errorMsg: error
                }}
            />
            <Input
                type='password'
                inputName='password'
                inputClass='block w-full  outline-blue-700 border-2 p-2 mt-2 rounded-md'
                value={passWord}
                setValue={(value) => setPassWord(value as string)}
                labelClass='block text-sm'
                error={{
                    isTrue: (error.trim() !== '' &&
                        (error.includes('password') ||
                            error.includes('password confirmation') ||
                            error.includes('empty field'))
                    ),
                    errorClass: '',
                    errorMsg: error
                }}
            />
            <Input
                type='password'
                inputName='confirm password'
                inputClass='block w-full  outline-blue-700 border-2 p-2 mt-2 rounded-md'
                value={confirmPassWord}
                setValue={(value) => setConfirmPassWord(value as string)}
                labelClass='block text-sm'
                error={{
                    isTrue: (error.trim() !== '' &&
                        (error.includes('password confirmation') ||
                            error.includes('empty field'))
                    ),
                    errorClass: '',
                    errorMsg: error
                }}
            />
            <div>
                <button
                    className='w-full text-base bg-green-600 p-3 border shadow-md shadow-green-200'>
                    {loading ? "loading..." : "Sign up"}
                </button>
            </div>
        </Inputwrapper>
        <div>
            <span className='block text-center cursor-pointer' onClick={switchPages}>Already have an account?
                <p className='text-green-400'>Log in!</p>
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

export default Signupuser
