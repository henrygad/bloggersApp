import { Routes, Route, Navigate, Link } from "react-router-dom";
import {
  Feed,
  About,
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
  Directmessage,
  Pageloading,
  Saves
} from './pages';
import { Suspense, useEffect, useState } from "react";
import { useFetchData, useUserIsLogin } from "./hooks";
import { Menu, Conpanylogo, Dialog, Tab, Signinuser, Signupuser, Searchform } from "./components";
import { Homeicon, Mailicon, Notificationsicon, Penicon, Profileicon, Searchicon } from "./components/Icons";
import tw from "tailwind-styled-components";
import { addProfile } from "./redux/slices/userProfileSlices";
import { addBlogposts } from "./redux/slices/userBlogpostSlices";
import { useAppDispatch, useAppSelector } from "./redux/slices";
import { addComments } from "./redux/slices/userCommentsSlices";
import { Imageprops, Blogpostprops, Commentprops, Userprops } from "./entities";
import { addAdvaters } from "./redux/slices/userAdvatersSlices";
import { addTimelineFeeds } from "./redux/slices/userTimelineFeedSlices";
import { addTreadingFeeds } from "./redux/slices/treadingFeedsSlices";
import { addSaves } from "./redux/slices/userSavesSlices";

const App = () => {
  const { loginStatus: { isLogin, loginUserName } } = useUserIsLogin();

  const { fetchData: fetchgProfileData } = useFetchData<Userprops>(null);
  const { fetchData: fetchgAdvaterData } = useFetchData<Imageprops[]>(null);
  const { fetchData: fetchgCommentData } = useFetchData<Commentprops[]>(null);
  const { fetchData: fetchgBlogpostData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchTimelineFeedData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchTreadingFeedData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchSavesBlogpostsData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchDisplayBlogpostImagesData } = useFetchData<Imageprops[]>(null);

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
          getProfileData && getProfileData.notifications ?
            getProfileData.notifications.filter((item) => item.checked === false).length ?
              <span className="absolute flex justify-center items-center text-[.6rem] w-4 h-4 font-bold text-white rounded-full bg-red-400">{
                getProfileData.notifications.filter((item) => item.checked === false).length
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
      name: 'feeds',
      to: '',
      content: <Link to='/feeds'>
        <Homeicon width="30px" height="30px" />
      </Link>
    },
    {
      name: 'treading',
      to: '',
      content: <Link to='/treading' >
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

  const handleFetchProfileData = async () => {
    if (isLogin) {
      appDispatch(addProfile({
        loading: true,
      }));

      appDispatch(addBlogposts({
        loading: true,
      }));

      appDispatch(addComments({
        loading: true,
      }));

      appDispatch(addAdvaters({
        loading: true,
      }));

      appDispatch(addSaves({
        loading: true,
      }));

      appDispatch(addTimelineFeeds({
        loading: true,
      }));

      appDispatch(addTreadingFeeds({
        loading: true
      }));

      await fetchgProfileData('/api/authorizeduser').then((response) => {
        const { data, loading } = response;

        appDispatch(addProfile({
          data,
          loading,
          error: '',
        }));

        const handleFetchSavesBlogpost = async () => {
          if (data?.saves.length) {

            await fetchSavesBlogpostsData('/api/blogposts/saves/' + data.saves.join('&'))
              .then((response) => {
                const { data, loading } = response;
                appDispatch(addSaves({
                  data,
                  loading: false,
                  error: '',
                }));
              });

          } else {

            appDispatch(addSaves({
              loading: false,
            }));
          };

        };

        const handleFetchTimelineFeeds = async () => {
          if (!data?.timeline.length) return;

          await fetchTimelineFeedData(`/api/blogposts/timeline/${data.timeline.join('&')}?skip=0&limit=5`).then((response) => {
            const { data, loading } = response;

            appDispatch(addTimelineFeeds({
              data,
              loading,
              error: '',
            }));
          });

        };

        handleFetchSavesBlogpost();
        handleFetchTimelineFeeds();

      });

      await fetchgBlogpostData('/api/blogposts/' + loginUserName + '?skip=0&limit=5').then((response) => {
        const { data, loading } = response;

        appDispatch(addBlogposts({
          data,
          loading,
          error: '',
        }));
      });

      await fetchgCommentData('/api/usercomments/' + loginUserName + '?skip=0&limit=5').then((response) => {
        const { data, loading } = response;

        appDispatch(addComments({
          data,
          loading,
          error: '',
        }));
      });

      await fetchgAdvaterData('/api/images/' + loginUserName + '?skip=0&limit=5').then((response) => {
        const { data, loading } = response;

        appDispatch(addAdvaters({
          data,
          loading,
          error: '',
        }));
      });

      await fetchTreadingFeedData('/api/blogposts').then((response) => {
        const { data, loading } = response;

        appDispatch(addTreadingFeeds({
          data,
          loading,
          error: ''
        }));
      });
    };
  };


  useEffect(() => {
    handleFetchProfileData();
  }, [isLogin === true]);

  return <Appwrapper>
    <header className="container w-full">
      <nav id="header-nav" className="relative h-[50px] flex items-center gap-5 justify-between">
        <Conpanylogo />
        <Searchform />
        {isLogin ?
          <>
            <Menu
              arrOfMenu={loginHeaderMenu}
              parentClass="flex item-center gap-4 text-sm"
              childClass="hover:text-green-400 active:bg-green-400"
            />
          </> :
          <>
            <Menu
              arrOfMenu={logOutHeaderMenu}
              parentClass="flex item-center gap-4 text-sm"
              childClass="hover:text-green-400 active:bg-green-400"
            />
          </>}
      </nav>
    </header>
    <main className="container w-full pb-20">
      <Suspense fallback={<Pageloading />}>
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/searchresult" element={<Searchresult />} />
          <Route path="/:authorUserName/:slug" element={<Singleblogpostpage />} />
          <Route path="/" element={isLogin ? <Navigate to={`/${loginUserName}`} /> : <Landingpage />} />
          <Route path="/feeds" element={isLogin ? <Feed /> : <Navigate to="/" />} />
          <Route path="/:userName" element={isLogin ? <Profile /> : <Navigate to={'/'} />} />
          <Route path="/createpost" element={true ? <Post /> : <Navigate to={'/'} />} />
          <Route path="/notifications" element={isLogin ? <Notification /> : <Navigate to={'/'} />} />
          <Route path="/treading" element={isLogin ? <Treadingfeeds /> : <Navigate to={'/'} />} />
          <Route path="/editprofile" element={isLogin ? <Editeprofile /> : <Navigate to={'/'} />} />
          <Route path="/settings" element={isLogin ? <Settings /> : <Navigate to={'/'} />} />
          <Route path="/directmessages" element={isLogin ? <Directmessage /> : <Navigate to={'/'} />} />
          <Route path="/saves" element={isLogin ? <Saves /> : <Navigate to={'/'} />} />
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
