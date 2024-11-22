import React, { useState } from 'react';
import { useUserIsLogin, usePostData } from '../hooks';
import tw from 'tailwind-styled-components';
import Input from './Input';
import { Userstatusprops } from '../entities';
import Button from './Button';
import Cookies from 'js-cookie';

type Props = {
    switchPages: () => void
    closePages: () => void
};

const Signupuser = ({ switchPages, closePages }: Props) => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [passWord, setPassWord] = useState('');
    const [confirmPassWord, setConfirmPassWord] = useState('');
    const [emailToVerify, setEmailToVerify] = useState('');
    const [emailOTPToken, setEmailOTPToken] = useState('');

    const { postData: SingUpPostData, loading: loadingSignUp, error: errorSignUP } = usePostData();
    const { postData: verifyEmailPostData, loading: loadingVerifyEmail, error: errorVerifyEmail } = usePostData();
    const { setLoginStatus } = useUserIsLogin();
    const setCookie = (myCookieValue: string) => { // create cookies to keep user login
        Cookies.set('blogbackclient', myCookieValue, {
            expires: 1, // Cookie expires in 1 days
            secure: true, // Ensures the cookie is only sent over HTTPS
            sameSite: 'Strict', // Prevents cross-site request forgery (adjust as needed)
        });
    };

    const handleSignUpUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = '/api/signup';
        const body = { userName, email, password: passWord, comfirmPassword: confirmPassWord };

        await SingUpPostData<Userstatusprops>(url, body)// sign up user
            .then((res) => {
                const { data, ok } = res;
                if (data) {
                    setEmailToVerify(email);
                    setUserName('');
                    setEmail('');
                    setPassWord('');
                    setConfirmPassWord('');
                } else {
                    setPassWord('');
                    setConfirmPassWord('');
                };
            })
    };

    const handleVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (emailToVerify.trim()) {
            const url = '/api/verifyemail';
            const body = {
                OTP: emailOTPToken,
            };

            await verifyEmailPostData<Userstatusprops>(url, body)
                .then((res) => {
                    const { data } = res;
                    if (data) {
                        setCookie(data.loginUserName);
                        setLoginStatus({ ...data });
                        closePages();
                    };
                });
        };
    };

    return <div>
        {!emailToVerify.trim() ?
            <form
                action=""
                onSubmit={handleSignUpUser}
                className='space-y-12'
            >
                <div className='space'></div>
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
                                errorSignUP.toLowerCase().includes('field') ||
                                errorSignUP.toLowerCase().includes('username')
                            ),
                            errorMsg: '',
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
                                errorSignUP.toLowerCase().includes('field') ||
                                errorSignUP.toLowerCase().includes('email')
                            ),
                            errorMsg: '',
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
                                    errorSignUP.toLowerCase().includes('field') ||
                                    errorSignUP.toLowerCase().includes('password')
                                ),
                                errorMsg: '',
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
                                errorSignUP.toLowerCase().includes('field') ||
                                errorSignUP.toLowerCase().includes('passwords did not match')
                            ),
                            errorMsg: '',
                        }}
                    />
                    <span className='block'>
                        <Button
                            id='signin-user-btn'
                            buttonClass='w-full font-bold text-white bg-green-800 rounded-md p-3 shadow-md'
                            children={loadingSignUp ? "loading..." : "Sign up"}

                        />
                        <ol className='list-decimal py-1' >
                            {[...new Set(errorSignUP.replace('Error:', '').split('.'))].map((errorSignUP) =>
                                <li key={errorSignUP} className='block text-red-500 text-sm text-wrap'>
                                    {errorSignUP}
                                </li>
                            )}
                        </ol>
                    </span>
                </Inputwrapper>
                <div>
                    <span className='block text-center cursor-pointer' onClick={switchPages}>
                        Already have an account?
                        <p className='text-green-500'>Log in!</p>
                    </span>
                </div>
            </form> :
            <form
                action=""
                className='space-y-12'
                onSubmit={handleVerifyEmail}
            >
                <div></div>
                <Inputwrapper>
                    <span className='block text-2xl font-primary text-center capitalize'>Email Verification</span>
                    <Input
                        id='verify-email-input'
                        type='email'
                        inputName='email'
                        labelClass='block text-base font-text first-letter:capitalize'
                        inputClass='block w-full  outline-blue-700 border-2 p-2 mt-2 rounded-md'
                        value={emailToVerify}
                        setValue={(value) => ''}
                    />
                    <span className='block '>
                        <Input
                            id='email-otp-verificaation-token-input'
                            type='text'
                            inputName='Enter OTP'
                            labelClass='block text-base font-text first-letter:capitalize'
                            inputClass='block w-full  outline-blue-700 border-2 p-2 mt-2 rounded-md'
                            value={emailOTPToken}
                            setValue={(value) => setEmailOTPToken(value as string)}
                            error={{
                                isTrue: (
                                    errorVerifyEmail.trim() !== ""
                                ),
                                errorMsg: errorVerifyEmail.trim(),
                            }}
                        />
                        <span className='text-sm'>OTP Token Has Been Sent to Your Email: {emailToVerify}</span>
                    </span>
                    <Button
                        id='signin-user-btn'
                        buttonClass='w-full font-bold text-white bg-green-800 rounded-md p-3 shadow-md'
                        children={loadingVerifyEmail ? "loading..." : "Sign up"}

                    />
                </Inputwrapper>
            </form>
        }
    </div>
};

const Inputwrapper = tw.div`
p-8
border 
shadow-md
space-y-6
`

export default Signupuser
