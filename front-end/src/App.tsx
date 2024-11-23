import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import {
  Feed,
  Contact,
  Searchresult,
  Treadingfeeds,
  Profile,
  Editeprofile,
  Post,
  Singleblogpostpage,
  Page404,
  Settings,
  Landingpage,
  Notification,
  Pageloading,
  Saves
} from './pages';
import { Suspense, useEffect, useState } from "react";
import { useChangeMode, useFetchData, useUserIsLogin } from "./hooks";
import { Menu, Conpanylogo, Dialog, Tab, Signinuser, Signupuser, Button, Displayimage } from "./components";
import tw from "tailwind-styled-components";
import { fetchProfile } from "./redux/slices/userProfileSlices";
import { fetchPublishedBlogposts, fetchSavedsBlogpost, fetchTimelineFeeds, fetchTotalNumberOfPublishedBlogposts, fetchUnpublishedBlogposts } from "./redux/slices/userBlogpostSlices";
import { useAppDispatch, useAppSelector } from "./redux/slices";
import { fetchComments, fetchTotalNumberOfUserComments } from "./redux/slices/userCommentsSlices";
import { Imageprops, Blogpostprops, Commentprops, Userprops } from "./entities";
import { fetchAvaters, fetchBlogpostImages, fetchTotalNumberOfUserAvaters } from "./redux/slices/userImageSlices";
import { MdDarkMode } from "react-icons/md"
import { IoIosNotificationsOutline, IoMdArrowRoundBack } from "react-icons/io";
import { GoHome } from "react-icons/go";
import { TfiWrite } from "react-icons/tfi";
import avaterPlaceholder from './assert/avaterplaceholder.svg';
import { GrStatusPlaceholder } from "react-icons/gr";
import { IoSaveOutline, IoSettingsOutline } from "react-icons/io5";

const App = () => {
  const location = useLocation();
  const { mode: changeBgMode, handleToggleTheme } = useChangeMode('themMode', 'light');
  const { loginStatus: { isLogin, loginUserName } } = useUserIsLogin();
  
  const { data: treadingFeedsData, loading: treadingFeedsLoading, error: treadingFeedsError } = useFetchData<Blogpostprops[]>('/api/blogposts?status=published&skip=0&limit=5', []);
  const { fetchData: fetchProfileData } = useFetchData<Userprops>(null);
  const { fetchData: fetchPublishedBlogpostData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchTotalNumberOfPublishedBlogpostData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchUnpublishedBlogpostData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchBlogpostImagesData } = useFetchData<Imageprops[]>(null);
  const { fetchData: fetchAvatersData } = useFetchData<Imageprops[]>(null);
  const { fetchData: fetchTotalNumberOfAvatersData } = useFetchData<Imageprops[]>(null);
  const { fetchData: fetchCommentData } = useFetchData<Commentprops[]>(null);
  const { fetchData: fetchTotalNumberOfCommentData } = useFetchData<Commentprops[]>(null);
  const { fetchData: fetchTimelineFeedData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchSavesBlogpostsData } = useFetchData<Blogpostprops[]>(null);

  const { userProfile: { data: getProfileData } } = useAppSelector((state) => state.userProfileSlices);
  const appDispatch = useAppDispatch();

  const [authenticationDialog, setAuthenticationDialog] = useState('');
  const [authenticationCurrentTabOn, setAuthenticationCurrentTabOn] = useState('login');

  const handleDisplayValidationPage = (item: string) => {
    setAuthenticationDialog('authenticationDialog');
    setAuthenticationCurrentTabOn(item);
  };

  const logOutHeaderMenu = [
    {
      name: 'login',
      to: '',
      content: <Button
        id="login"
        buttonClass="hover:text-green-400 active:text-green-800"
        children={'Login'}
        handleClick={() => handleDisplayValidationPage('login')} />
    },
    {
      name: 'sign up',
      to: '',
      content: <Button
        id="login"
        buttonClass="hover:text-green-400 active:text-green-800"
        children={'Sign up'}
        handleClick={() => handleDisplayValidationPage('signup')} />
    }
  ];

  const loginHeaderMenu = [
    {
      name: 'notifications',
      to: '',
      content: <Link to='/notifications' className="relative block">
        {
          getProfileData && getProfileData.notifications ?
            getProfileData.notifications.filter((item) => item.checked === false).length ?
              <span className="absolute flex justify-center items-center text-[.6rem] w-4 h-4 font-bold text-white rounded-full bg-red-400">{
                getProfileData.notifications.filter((item) => item.checked === false).length
              }</span> :
              null
            :
            null
        }
        <IoIosNotificationsOutline size={28} />
      </Link>
    },
    {
      name: 'saves',
      to: '',
      content: <Link to='/saves'>
        <IoSaveOutline size={22} />
      </Link>
    },
    {
      name: 'settings',
      to: '',
      content: <Link to='/settings'>
        <IoSettingsOutline size={23} />
      </Link>
    }
  ];

  const logOutFooterMenu = [
    { name: 'contact us', to: '/contact', content: '' },
    { name: 'help', to: '/help', content: '' },
    { name: 'policy', to: '/policy', content: '' },
    { name: 'cookies', to: '/cookies', content: '' },
    { name: 'FAQ', to: '/FAQ', content: '' },
  ];

  const loginFooterMenu = [
    {
      name: 'feeds',
      to: '',
      content: <Link to='/feeds'>
        <GoHome size={29}
          className={`${location.pathname === '/feeds' ? 'text-green-500' : ''}`} />
      </Link>
    },
    {
      name: 'treading',
      to: '',
      content: <Link to='/treading' >
        <GrStatusPlaceholder size={24}
          className={`${location.pathname === '/treading' ? 'text-green-500' : ''}`} />
      </Link>
    },
    {
      name: 'createpost',
      to: '',
      content: <Link to='/createpost'
        className={`${location.pathname === '/createpost' ? 'text-green-500' : ''}`}>
        <TfiWrite size={22} />
      </Link>
    },
    {
      name: 'profile',
      to: '',
      content: <Link to={'/' + loginUserName} >
        <Displayimage
          id="profilw-nav-avater"
          imageId={getProfileData ? getProfileData.displayImage : ''}
          parentClass={`h-8 w-8 border border-gray-800 rounded-full
             ${location.pathname === '/' + loginUserName ? 'border-green-500' : ''}`}
          imageClass='object-contain rounded-full'
          placeHolder={avaterPlaceholder}
        />
      </Link>
    },

  ];

  const handleFetchProfileData = async () => {

    appDispatch(fetchProfile({
      data: null,
      loading: true,
      error: ''
    }));

    appDispatch(fetchTotalNumberOfPublishedBlogposts({
      data: 0,
      error: '',
      loading: true
    }))

    appDispatch(fetchPublishedBlogposts({
      data: [],
      loading: true,
      error: ''
    }));

    appDispatch(fetchUnpublishedBlogposts({
      data: [],
      loading: true,
      error: '',
    }));

    appDispatch(fetchTotalNumberOfUserComments({
      data: 0,
      loading: true,
      error: ''
    }));

    appDispatch(fetchComments({
      data: [],
      loading: true,
      error: ''
    }));

    appDispatch(fetchAvaters({
      data: [],
      loading: true,
      error: ''
    }));

    appDispatch(fetchTotalNumberOfUserAvaters({
      data: 0,
      loading: true,
      error: ''
    }));

    appDispatch(fetchBlogpostImages({
      data: [],
      loading: true,
      error: '',
    }));

    appDispatch(fetchSavedsBlogpost({
      data: [],
      loading: true,
      error: ''
    }));

    appDispatch(fetchTimelineFeeds({
      data: [],
      loading: true,
      error: ''
    }));

    await fetchProfileData('/api/authorizeduser')
      .then(async (res) => {
        const { data, loading } = res;

        if (data) { // if user data is fetched

          appDispatch(fetchProfile({
            data,
            loading: false,
            error: '',
          }));

          if (data.saves?.length) { // fetch saveds Blogposts

            await fetchSavesBlogpostsData('/api/blogposts/saves/' + data.saves.join('&'))
              .then((res) => {
                const { data, loading } = res;
                if (data) {
                  appDispatch(fetchSavedsBlogpost({
                    data,
                    loading: false,
                    error: '',
                  }));
                } else {
                  appDispatch(fetchSavedsBlogpost({
                    data: [],
                    loading: false,
                    error: '',
                  }));
                };
              });
          } else {

            appDispatch(fetchSavedsBlogpost({
              data: [],
              loading: false,
              error: ''
            }));
          };

          if (data.timeline?.length) { // fetch timeline feed blogpost

            await fetchTimelineFeedData(`/api/blogposts/timeline/${data?.timeline.join('&')}?status=published&skip=0&limit=5`)
              .then((res) => {
                const { data, loading } = res;
                if (data) {
                  appDispatch(fetchTimelineFeeds({
                    data,
                    loading: false,
                    error: '',
                  }));
                } else {
                  appDispatch(fetchTimelineFeeds({
                    data: [],
                    loading: false,
                    error: '',
                  }));
                };
              });
          } else {
            appDispatch(fetchTimelineFeeds({
              data: [],
              loading: false,
              error: '',
            }));
          };

        } else {
          appDispatch(fetchProfile({
            data: null,
            loading: false,
            error: '',
          }));
        };

      });

    await fetchTotalNumberOfPublishedBlogpostData('/api/blogposts/' + loginUserName + '?status=published')
      .then((res) => {
        const { data } = res;

        if (data) {
          appDispatch(fetchTotalNumberOfPublishedBlogposts({
            data: data.length,
            error: '',
            loading: false
          }));
        } else {
          appDispatch(fetchTotalNumberOfPublishedBlogposts({
            data: 0,
            error: '',
            loading: false
          }));
        };

      });

    await fetchPublishedBlogpostData('/api/blogposts/' + loginUserName + '?status=published&skip=0&limit=5')
      .then((res) => {
        const { data } = res;

        if (data) {
          appDispatch(fetchPublishedBlogposts({
            data,
            loading: false,
            error: '',
          }));
        } else {
          appDispatch(fetchPublishedBlogposts({
            data: [],
            loading: false,
            error: '',
          }));
        }


      });

    await fetchUnpublishedBlogpostData('/api/blogposts/' + loginUserName + '?status=unpublished')
      .then((res) => {
        const { data } = res;
        if (data) {
          appDispatch(fetchUnpublishedBlogposts({
            data,
            loading: false,
            error: '',
          }));

        } else {
          appDispatch(fetchUnpublishedBlogposts({
            data: [],
            loading: false,
            error: '',
          }));
        };

      });

    await fetchTotalNumberOfCommentData('/api/usercomments/' + loginUserName)
      .then((res) => {
        const { data } = res;
        if (data) {
          appDispatch(fetchTotalNumberOfUserComments({
            data: data.length,
            loading: false,
            error: ''
          }));
        } else {

          appDispatch(fetchTotalNumberOfUserComments({
            data: 0,
            loading: false,
            error: ''
          }));
        };


      });

    await fetchCommentData('/api/usercomments/' + loginUserName + '?skip=0&limit=5')
      .then((res) => {
        const { data, loading } = res;
        if (data) {
          appDispatch(fetchComments({
            data,
            loading,
            error: '',
          }));
        } else {
          appDispatch(fetchComments({
            data: [],
            loading,
            error: '',
          }));
        };
      });

    await fetchTotalNumberOfAvatersData('/api/images/' + loginUserName + '?fieldname=avater')
      .then((res) => {
        const { data } = res;
        if (data) {
          appDispatch(fetchTotalNumberOfUserAvaters({
            data: data.length,
            loading: false,
            error: ''
          }));
        } else {
          appDispatch(fetchTotalNumberOfUserAvaters({
            data: 0,
            loading: false,
            error: ''
          }));
        };
      });

    await fetchAvatersData('/api/images/' + loginUserName + '?fieldname=avater&skip=0&limit=5')
      .then((res) => {
        const { data } = res;
        if (data) {
          appDispatch(fetchAvaters({
            data,
            loading: false,
            error: '',
          }));
        } else {
          appDispatch(fetchAvaters({
            data: [],
            loading: false,
            error: '',
          }));
        };
      });

    await fetchBlogpostImagesData('/api/images/' + loginUserName + '?fieldname=blogpostimage&skip=0&limit=5')
      .then((res) => {
        const { data } = res;
        if (data) {
          appDispatch(fetchBlogpostImages({
            data,
            loading: false,
            error: '',
          }));
        } else {
          appDispatch(fetchBlogpostImages({
            data: [],
            loading: false,
            error: '',
          }));
        };
      });

  };

  useEffect(() => {
    if (isLogin) {
      handleFetchProfileData();
    };
  }, [isLogin]);

  return <Appwrapper>
    <header className="container w-full">
      <nav id="header-nav" className="flex justify-between items-center h-12">
        <Conpanylogo />
        <div className="flex items-start gap-6">
          <Menu
            parentClass="flex item-center gap-4"
            childClass=""
            arrOfMenu={isLogin ? loginHeaderMenu : logOutHeaderMenu}
          />
          <Button
            id="change-bg-mode"
            buttonClass={''}
            children={<MdDarkMode color={changeBgMode === 'light' ? 'black' : 'white'} size={24} />}
            handleClick={handleToggleTheme}
          />
        </div>

      </nav>
    </header>
    <main className={`container w-full ${isLogin ? 'pb-16' : ''}`}>
      <Suspense fallback={<Pageloading />}>
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/searchresult" element={<Searchresult />} />
          <Route path="/:authorUserName/:slug" element={<Singleblogpostpage />} />
          <Route path="/" element={isLogin ?
            <Navigate to={`/${loginUserName}`} /> :
            <Landingpage
              treadingFeedsData={treadingFeedsData || []}
              treadingFeedsLoading={treadingFeedsLoading}
              treadingFeedsError={treadingFeedsError}
            />
          } />
          <Route path="/feeds" element={isLogin ? <Feed /> : <Navigate to="/" />} />
          <Route path="/:userName" element={isLogin ? <Profile /> : <Navigate to={'/'} />} />
          <Route path="/createpost" element={isLogin ? <Post /> : <Navigate to={'/'} />} />
          <Route path="/notifications" element={isLogin ? <Notification /> : <Navigate to={'/'} />} />
          <Route path="/treading" element={isLogin ?
            <Treadingfeeds
              treadingFeedsData={treadingFeedsData || []}
              treadingFeedsLoading={treadingFeedsLoading}
              treadingFeedsError={treadingFeedsError}
            /> :
            <Navigate to={'/'} />}
          />
          <Route path="/editprofile" element={isLogin ? <Editeprofile /> : <Navigate to={'/'} />} />
          <Route path="/settings" element={isLogin ? <Settings /> : <Navigate to={'/'} />} />
          <Route path="/saves" element={isLogin ? <Saves /> : <Navigate to={'/'} />} />
        </Routes>
      </Suspense>
    </main>
    <Footer>
      {isLogin ?
        <nav id="login-footer-nav" className="container fixed bottom-0 right-0 left-0 bg-inherit py-2 border-t">
          <Menu
            arrOfMenu={loginFooterMenu}
            parentClass="w-full flex justify-between items-center"
            childClass="cursor-pointer"
          />
        </nav>
        :
        <nav id="logout-footer-nav" className="space-y-3">
          <Conpanylogo />
          <Menu
            arrOfMenu={logOutFooterMenu}
            parentClass="capitalize space-y-3 max-w-[480px]"
            childClass="block text-start"
          />
          {/* authentication dialog */}
          <Dialog
            id="authenticationDialog"
            parentClass=""
            childClass="container relative rounded-sm space-y-2 w-full h-full"
            currentDialog="authenticationDialog"
            children={
              <>
                <Button
                  id="authentication-dialog-close-btn"
                  buttonClass='absolute top-1 left-1'
                  children={<IoMdArrowRoundBack size={20} />}
                  handleClick={() => { setAuthenticationDialog(''); setAuthenticationCurrentTabOn('login') }}
                />
                <Tab
                  id="authentication-tab"
                  tabClass="pt-20"
                  currentTab={authenticationCurrentTabOn}
                  arrOfTab={[
                    {
                      name: 'login',
                      content: <Signinuser
                        switchPages={() => setAuthenticationCurrentTabOn('signup')}
                        closePages={() => { setAuthenticationDialog(''); setAuthenticationCurrentTabOn('login') }} />,
                    },
                    {
                      name: 'signup',
                      content: <Signupuser
                        switchPages={() => setAuthenticationCurrentTabOn('login')}
                        closePages={() => { setAuthenticationDialog(''); setAuthenticationCurrentTabOn('login') }} />
                    }
                  ]}
                />
              </>
            }
            dialog={authenticationDialog}
            setDialog={setAuthenticationDialog}
          />
          <div className="w-full flex justify-center items-center py-4">
            <p> © {new Date().getFullYear()} Blogback. All rights reserved</p>
          </div>
        </nav>
      }
    </Footer>
  </Appwrapper>
};

export default App;

const Appwrapper = tw.div`
overflow-hidden
bg-white
dark:bg-stone-800 
dark:text-white
w-full
min-h-screen
`
const Footer = tw.div`
container 
relative w-full
bg-white
dark:bg-stone-800 
dark:text-white
`
