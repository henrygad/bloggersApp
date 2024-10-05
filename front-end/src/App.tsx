import { Routes, Route, Navigate, Link } from "react-router-dom";
import {
  Feed,
  About,
  Contact,
  Search,
  Profile,
  Editeprofile,
  Post,
  Singleblogpostpage,
  Page404,
  Settings,
  Landingpage,
  Notification,
  Directmessage,
  Pageloading
} from './pages';
import { Suspense, useEffect, useState } from "react";
import { useFetchData, useUserIsLogin } from "./hooks";
import { Menu, Conpanylogo, Dialog, Tab, Signinuser, Signupuser } from "./components";
import { Homeicon, Mailicon, Notificationsicon, Penicon, Profileicon, Searchicon } from "./components/Icons";
import tw from "tailwind-styled-components";
import { addProfile } from "./redux/slices/userProfileSlices";
import { addBlogposts } from "./redux/slices/userBlogpostSlices";
import { useAppDispatch, useAppSelector } from "./redux/slices";
import { addComments } from "./redux/slices/userCommentsSlices";
import { Advaterprops, Blogpostprops, Commentprops, Userprops } from "./entities";
import { addAdvaters } from "./redux/slices/userAdvatersSlices";

const App = () => {

  const [authenticationDialog, setAuthenticationDialog] = useState('');
  const [authenticationCurrentTabOn, setAuthenticationCurrentTabOn] = useState('login');
  const { loginStatus: { isLogin, loginUserName } } = useUserIsLogin();
  const { data: getProfileData, error: profileError, loading: profileLoading } = useFetchData<Userprops>(isLogin ? '/api/authorizeduser' : null, [isLogin]);
  const { data: getBlogpostData, error: blogpostError, loading: blogpostLoading } = useFetchData<Blogpostprops[]>(isLogin ? `/api/blogposts/${loginUserName}?skip=0&limit=5` : null, [isLogin]);
  const { data: getCommentData, error: commentError, loading: commentLoading } = useFetchData<Commentprops[]>(isLogin ? '/api/usercomments/' + loginUserName + '?skip=0&limit=5' : null, [isLogin]);
  const { data: getAdvaterData, error: advaterError, loading: advaterLoading } = useFetchData<Advaterprops[]>(isLogin ? '/api/images/' + loginUserName + '?skip=0&limit=5' : null, [isLogin]);
  const { userProfile: { data: profileData } } = useAppSelector((state) => state.userProfileSlices);
  const appDispatch = useAppDispatch();

  const handleDisplayValidationPage = (item: string) => {
    setAuthenticationDialog('authenticationDialog');
    setAuthenticationCurrentTabOn(item);
  };

  const logOutHeaderMenu = [
    {
      name: 'login',
      to: '',
      content: <button onClick={() => handleDisplayValidationPage('login')}>login</button>
    },
    {
      name: 'sign up',
      to: '',
      content: <button onClick={() => handleDisplayValidationPage('signup')}>sign up</button>
    },
    {
      name: 'help',
      to: '/help',
      content: ''
    },
  ];

  const loginHeaderMenu = [
    { name: 'saves', to: '/saves' },
    {
      name: 'notifications',
      to: '',
      content: <Link to='/notifications' className="relative block">
        {
          profileData && profileData.notifications ?
            profileData.notifications.filter((item) => item.checked === false).length ?
              <span className="absolute flex justify-center items-center text-[.6rem] w-4 h-4 font-bold text-white rounded-full bg-red-400">{
                profileData.notifications.filter((item) => item.checked === false).length
              }</span> :
              null
            :
            null
        }
        <Notificationsicon width="30px" height="30px" />
      </Link>
    },
    { name: 'settings', to: '/settings' },
    { name: 'help', to: '/help' }
  ];

  const logOutFooterMenu = [
    { name: 'contact us', to: '/contact', content: '' },
    { name: 'about', to: '/about-us', content: '' },
    { name: 'help', to: '/help', content: '' },
    { name: 'policy', to: '/policy', content: '' },
    { name: 'cookies', to: '/cookies', content: '' },
    { name: 'FAQ', to: '/FAQ', content: '' },
  ];

  const loginFooterMenu = [
    {
      name: 'home',
      to: '',
      content: <Link to='/home'>
        <Homeicon width="30px" height="30px" />
      </Link>
    },
    {
      name: 'search',
      to: '',
      content: <Link to='/search' >
        <Searchicon width="30px" height="30px" />
      </Link>
    },
    {
      name: 'createpost',
      to: '',
      content: <Link to='/createpost' >
        <Penicon width="30px" height="30px" />
      </Link>
    },
    {
      name: 'directmessages',
      to: '',
      content: <Link to='/directmessages' >
        <Mailicon width="30px" height="30px" />
      </Link>
    },
    {
      name: 'profile',
      to: '',
      content: <Link to={'/' + loginUserName} >
        <Profileicon width="30px" height="30px" />
      </Link>
    },

  ];

  const authenticationTabs = [
    {
      name: 'login',
      content: <Signinuser switchPages={() => setAuthenticationCurrentTabOn('signup')} closePages={() => { setAuthenticationDialog(''); setAuthenticationCurrentTabOn('login') }} />,
    },
    {
      name: 'signup',
      content: <Signupuser switchPages={() => setAuthenticationCurrentTabOn('login')} closePages={() => { setAuthenticationDialog(''); setAuthenticationCurrentTabOn('login') }} />
    }
  ];

  const handleFetchUserProfileData = () => {
    appDispatch(addProfile({
      data: getProfileData,
      loading: profileLoading,
      error: profileError,
    }));

    appDispatch(addBlogposts({
      data: getBlogpostData || [],
      loading: blogpostLoading,
      error: blogpostError
    }));

    appDispatch(addComments({
      data: getCommentData || [],
      loading: commentLoading,
      error: commentError
    }));

    appDispatch(addAdvaters({
      data: getAdvaterData || [],
      loading: advaterLoading,
      error: advaterError
    }));

  };

  useEffect(() => {
    isLogin && handleFetchUserProfileData();
  }, [
    isLogin,
    getProfileData, profileLoading, profileError,
    getBlogpostData, blogpostLoading, blogpostError,
    getCommentData, commentLoading, commentError,
    getAdvaterData, advaterLoading, advaterError,
  ]);

  return <Appwrapper>
    <header className="container w-full">
      <div className="py-2">
        {isLogin ?
          <nav id="login-header-nav" className="flex items-center gap-5 justify-between">
            <Conpanylogo />
            <Menu
              arrOfMenu={loginHeaderMenu}
              parentClass="flex item-center gap-4 text-sm"
              childClass="hover:text-green-400 active:bg-green-400"
            />
          </nav> :
          <nav id="logout-header-nav" className="flex items-center gap-5 justify-between">
            <Conpanylogo />
            <Menu
              arrOfMenu={logOutHeaderMenu}
              parentClass="flex item-center gap-4 text-sm"
              childClass="hover:text-green-400 active:bg-green-400"
            />
          </nav>
        }
      </div>
    </header>
    <main className="container w-full pb-20">
      <Suspense fallback={<Pageloading />}>
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/:authorUserName/:slug" element={<Singleblogpostpage />} />
          <Route path="/" element={isLogin ? <Navigate to={`/${loginUserName}`} /> : <Landingpage />} />
          <Route path="/home" element={isLogin ? <Feed /> : <Navigate to="/" />} />
          <Route path="/:userName" element={isLogin ? <Profile /> : <Navigate to={'/'} />} />
          <Route path="/createpost" element={isLogin ? <Post /> : <Navigate to={'/'} />} />
          <Route path="/notifications" element={isLogin ? <Notification /> : <Navigate to={'/'} />} />
          <Route path="/editprofile" element={isLogin ? <Editeprofile /> : <Navigate to={'/'} />} />
          <Route path="/search" element={isLogin ? <Search /> : <Navigate to={'/'} />} />
          <Route path="/settings" element={isLogin ? <Settings /> : <Navigate to={'/'} />} />
          <Route path="/directmessages" element={isLogin ? <Directmessage /> : <Navigate to={'/'} />} />
        </Routes>
      </Suspense>
    </main>
    <footer className="container relative w-full ">
      <div>
        {isLogin ?
          <nav id="login-footer-nav" className="container fixed bottom-0 right-0 left-0 w-ful py-2">
            <Menu
              arrOfMenu={loginFooterMenu}
              parentClass="w-full flex justify-around items-center"
              childClass="cursor-pointer"
            />
          </nav> :
          <nav id="logout-footer-nav">
            <Conpanylogo />
            <Menu
              arrOfMenu={logOutFooterMenu}
              parentClass="space-y-3 max-w-[480px]"
              childClass="block border-b"
            />
            <div>
              {/* authentication dialog */}
              <Dialog
                id="authenticationDialog"
                currentDialog="authenticationDialog"
                children={
                  <div className="border p-4 rounded-sm">
                    <div
                      className="flex justify-end text-red-800 cursor-pointer"
                      onClick={() => { setAuthenticationDialog(''); setAuthenticationCurrentTabOn('login') }}
                    >close </div>
                    <Tab
                      id="authentication-tab"
                      arrOfTab={authenticationTabs}
                      tabClass=""
                      currentTab={authenticationCurrentTabOn}
                    />
                  </div>
                }
                parentClass="container flex justify-center items-center"
                childClass=""
                dialog={authenticationDialog}
                setDialog={setAuthenticationDialog}
              />
            </div>
            <div><p>copy write</p></div>
          </nav>
        }
      </div>
    </footer>
  </Appwrapper>
};

export default App;

const Appwrapper = tw.div`
bg-white
text-stone-800
dark:bg-stone-900 
dark:text-white 
 min-h-screen
 w-full
`
