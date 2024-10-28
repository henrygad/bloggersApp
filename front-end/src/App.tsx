import { Routes, Route, Navigate, Link } from "react-router-dom";
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
import { useFetchData, useUserIsLogin } from "./hooks";
import { Menu, Conpanylogo, Dialog, Tab, Signinuser, Signupuser, Button } from "./components";
import { Homeicon, Notificationsicon, Penicon, Profileicon, Searchicon } from "./components/Icons";
import tw from "tailwind-styled-components";
import { fetchProfile } from "./redux/slices/userProfileSlices";
import { fetchArchivedBlogposts, fetchPublishedBlogposts, fetchSavedsBlogpost, fetchTimelineFeeds, fetchTotalNumberOfPublishedBlogposts, fetchUnpublishedBlogposts } from "./redux/slices/userBlogpostSlices";
import { useAppDispatch, useAppSelector } from "./redux/slices";
import { fetchComments, fetchTotalNumberOfUserComments } from "./redux/slices/userCommentsSlices";
import { Imageprops, Blogpostprops, Commentprops, Userprops } from "./entities";
import { fetchAvaters, fetchBlogpostImages, fetchTotalNumberOfUserAvaters } from "./redux/slices/userImageSlices";

const App = () => {
  const { loginStatus: { isLogin, loginUserName, greetings, searchHistory } } = useUserIsLogin();

  const { data: treadingFeedsData, loading: treadingFeedsLoading, error: treadingFeedsError } = useFetchData<Blogpostprops[]>('/api/blogposts?status=published&skip=0&limit=5');
  const { fetchData: fetchProfileData } = useFetchData<Userprops>(null);
  const { fetchData: fetchPublishedBlogpostData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchTotalNumberOfPublishedBlogpostData } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchArchivedBlogpostData } = useFetchData<Blogpostprops[]>(null);
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
      name: 'profile',
      to: '',
      content: <Link to={'/' + loginUserName} >
        <Profileicon width="30px" height="30px" />
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

    appDispatch(fetchArchivedBlogposts({
      data: [],
      loading: true,
      error: '',
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

        appDispatch(fetchProfile({
          data,
          loading,
          error: '',
        }));

        if (data) { // if user data is fetched

          if (data.saves?.length) { // fetch saveds Blogposts

            await fetchSavesBlogpostsData('/api/blogposts/saves/' + data.saves.join('&'))
              .then((res) => {
                const { data, loading } = res;
                if (!data) return;

                appDispatch(fetchSavedsBlogpost({
                  data,
                  loading: false,
                  error: '',
                }));
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
                if (!data) return;

                appDispatch(fetchTimelineFeeds({
                  data,
                  loading,
                  error: '',
                }));
              });
          } else {

            appDispatch(fetchTimelineFeeds({
              data: [],
              loading: false,
              error: '',
            }));
          };

        };

      });

    await fetchTotalNumberOfPublishedBlogpostData('/api/blogposts/' + loginUserName + '?status=published')
      .then((res) => {
        const { data } = res;
        if (!data) return;

        appDispatch(fetchTotalNumberOfPublishedBlogposts({
          data: data.length,
          error: '',
          loading: false
        }))
      });

    await fetchPublishedBlogpostData('/api/blogposts/' + loginUserName + '?status=published&skip=0&limit=5')
      .then((res) => {
        const { data, loading } = res;
        if (!data) return;

        appDispatch(fetchPublishedBlogposts({
          data,
          loading,
          error: '',
        }));
      });

    await fetchArchivedBlogpostData('/api/blogposts/' + loginUserName + '?status=archived')
      .then((res) => {
        const { data } = res;
        if (!data) return;
        appDispatch(fetchArchivedBlogposts({
          data,
          loading: false,
          error: '',
        }));

      });

    await fetchUnpublishedBlogpostData('/api/blogposts/' + loginUserName + '?status=unpublished')
      .then((res) => {
        const { data } = res;
        if (!data) return;
        appDispatch(fetchUnpublishedBlogposts({
          data,
          loading: false,
          error: '',
        }));
      });

    await fetchTotalNumberOfCommentData('/api/usercomments/' + loginUserName)
      .then((res) => {
        const { data } = res;
        if (!data) return;

        appDispatch(fetchTotalNumberOfUserComments({
          data: data.length,
          loading: false,
          error: ''
        }));
      });

    await fetchCommentData('/api/usercomments/' + loginUserName + '?skip=0&limit=5')
      .then((res) => {
        const { data, loading } = res;
        if (!data) return;

        appDispatch(fetchComments({
          data,
          loading,
          error: '',
        }));
      });

    await fetchTotalNumberOfAvatersData('/api/images/' + loginUserName + '?fieldname=avater')
      .then((res) => {
        const { data } = res;
        if (!data) return;

        appDispatch(fetchTotalNumberOfUserAvaters({
          data: data.length,
          loading: false,
          error: ''
        }));
      });

    await fetchAvatersData('/api/images/' + loginUserName + '?fieldname=avater&skip=0&limit=5')
      .then((res) => {
        const { data, loading } = res;
        if (!data) return;

        appDispatch(fetchAvaters({
          data,
          loading,
          error: '',
        }));
      });

    await fetchBlogpostImagesData('/api/images/' + loginUserName + '?fieldname=blogpostimage&skip=0&limit=5')
      .then((res) => {
        const { data } = res;
        if (!data) return;

        appDispatch(fetchBlogpostImages({
          data,
          loading: false,
          error: '',
        }));
      });

  };

  useEffect(() => {
    isLogin && handleFetchProfileData();
  }, [isLogin]);

  return <Appwrapper>
    <header className="container w-full">
      <nav id="header-nav" className="relative h-[50px] flex items-center gap-5 justify-between">
        <Conpanylogo />
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
                parentClass="container flex justify-center items-center"
                childClass=""
                currentDialog="authenticationDialog"
                children={
                  <div className="relative min-w-[320px] sm:min-w-[420px] md:min-w-[620px]  min-h-[480px] border p-3 rounded-sm space-y-10">
                    <span className="block">
                      <Button
                        id="authentication-dialog-close-btn"
                        buttonClass='absolute top-1 right-1 text-red-800 cursor-pointer'
                        children={<>close</>}
                        handleClick={() => { setAuthenticationDialog(''); setAuthenticationCurrentTabOn('login') }}
                      />
                    </span>
                    <span className='block text-center'>
                      <Conpanylogo />
                      <span className="block text-4xl font-primary capitalize mt-2">
                        Wellcome back!
                      </span>
                    </span>
                    <Tab
                      id="authentication-tab"
                      tabClass=""
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
                  </div>
                }
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
