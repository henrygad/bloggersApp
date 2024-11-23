import { useState } from 'react';
import { Imageprops, Blogpostprops, Commentprops, Userprops } from '../entities';
import { Button, Dialog, Displayimage, Followbutton, Menu, Tab, Userdotnav } from '../components';
import Blogpostsec from './Blogpostsec';
import CommentSec from './CommentSec';
import { useUserIsLogin } from '../hooks';
import Followerssec from './Followerssec';
import Followingsec from './Followingsec';
import Interentssec from './Interentssec';
import { Link } from 'react-router-dom';
import Avatersec from './Avatersec';
import avaterPlaceholder from '../assert/avaterplaceholder.svg'
import { IoMdArrowRoundBack } from 'react-icons/io';

type Props = {
  profileLoading: boolean
  profileError: string
  profileData: Userprops

  profileBlogposts: Blogpostprops[]
  profileBlogpostsLoading: boolean
  profileBlogpostsError: string
  handleServerLoadMoreBlogposts: () => void
  moreBlogpostsLoading: boolean
  moreBlogpostsError: string
  numberOfBlogposts: number
  numberOfBlogpostsLoading: boolean

  profileCommentsData: Commentprops[]
  profileCommentsLoading: boolean
  profileCommentsError: string
  handleServerLoadMoreComments: () => void
  moreCommentsLoading: boolean
  moreCommentsError: string
  numberOfComments: number
  numberOfCommentsLoading: boolean


  profileAvatersData: Imageprops[],
  profileAvatersLoading: boolean,
  profileAvatersError: string,
  handleServerLoadMoreAvaters: () => void,
  moreAvatersLoading: boolean,
  moreAvatersError: string,
  numberOfAvaters: number
  numberOfAvatersLoading: boolean
};


const Profilesec = (
  {
    profileData,
    profileLoading,

    profileBlogposts,
    profileBlogpostsLoading,
    profileBlogpostsError,
    handleServerLoadMoreBlogposts,
    moreBlogpostsLoading,
    moreBlogpostsError,
    numberOfBlogposts,
    numberOfBlogpostsLoading,

    profileCommentsData,
    profileCommentsLoading,
    profileCommentsError,
    handleServerLoadMoreComments,
    moreCommentsLoading,
    moreCommentsError,
    numberOfComments,
    numberOfCommentsLoading,

    profileAvatersData,
    profileAvatersLoading,
    profileAvatersError,
    handleServerLoadMoreAvaters,
    moreAvatersLoading,
    moreAvatersError,
    numberOfAvaters,
    numberOfAvatersLoading,
  }: Props) => {
  const { loginStatus: { loginUserName } } = useUserIsLogin();
  const isAccountOwner = profileData && profileData?.userName === loginUserName;

  const [profileDialog, setProfileDialog] = useState(' ');

  const [currentProfileDialogTab, setCurreentProfileDialogTab] = useState('followerssec');
  const [currentProfileContentTab, setCurrentProfileContentTab] = useState<string>(() => localStorage.getItem('currentProfileContentTab') || 'blogpostssec');

  const profileAtivitiesTabs = [
    {
      menu: {
        name: 'blogpostssec',
        content: <Button children={` Post (${!numberOfBlogpostsLoading ? numberOfBlogposts : 0}) `}
          buttonClass='' handleClick={() => handleCurrentProfileContentTab('blogpostssec')} />,
      },
      tab: {
        name: 'blogpostssec',
        content: <Blogpostsec
          profileBlogposts={profileBlogposts}
          profileBlogpostsLoading={profileBlogpostsLoading}
          profileBlogpostsError={profileBlogpostsError}
          handleServerLoadMoreBlogposts={handleServerLoadMoreBlogposts}
          moreBlogpostsLoading={moreBlogpostsLoading}
          moreBlogpostsError={moreBlogpostsError}
          numberOfBlogposts={numberOfBlogposts}
        />
      }
    },
    {
      menu: {
        name: 'commentssec',
        content: <Button children={`Comment (${!numberOfCommentsLoading ? numberOfComments : 0})`}
          buttonClass='' handleClick={() => handleCurrentProfileContentTab('commentssec')} />,
      },
      tab: {
        name: 'commentssec',
        content: <CommentSec
          profileCommentsData={profileCommentsData}
          profileCommentsLoading={profileCommentsLoading}
          profileCommentsError={profileCommentsError}
          handleServerLoadMoreComments={handleServerLoadMoreComments}
          moreCommentsLoading={moreCommentsLoading}
          moreCommentsError={moreCommentsError}
          numberOfComments={numberOfComments}
        />
      },
    },
    {
      menu: {
        name: 'advaterssec',
        content: <Button children={`Advater (${!numberOfAvatersLoading ? numberOfAvaters : 0}) `}
          buttonClass='' handleClick={() => handleCurrentProfileContentTab('advaterssec')} />,
        tab: <div>Profile images</div>,
      },
      tab: {
        name: 'advaterssec',
        content: <Avatersec
          profileAvatersData={profileAvatersData}
          profileAvatersLoading={profileAvatersLoading}
          profileAvatersError={profileAvatersError}
          handleServerLoadMoreAvaters={handleServerLoadMoreAvaters}
          moreAvatersLoading={moreAvatersLoading}
          moreAvatersError={moreAvatersError}
          numberOfAvaters={numberOfAvaters}
        />
      },
    },
  ];

  const handleCurrentProfileContentTab = (sec: string) => {
    setCurrentProfileContentTab(sec);
    localStorage.setItem('currentProfileContentTab', sec);
  };

  return <div>
    {
      !profileLoading ?
        <div>
          {
            (profileData) &&
              Object.keys(profileData).length ?
              <div id='profile-data-display-wrapper'>
                <div id='profile-datails' className='flex justify-between py-2'>
                  {/* display profile detail */}
                  <div className='space-y-1'>
                    {/* profile data */}
                    <Link to={isAccountOwner ? '/editprofile' : ''} className='' >
                      <Displayimage
                        placeHolder={avaterPlaceholder}
                        id={'avater'}
                        imageId={profileData?.displayImage}
                        parentClass='h-14 w-14'
                        imageClass='object-contain rounded-full'
                        onClick={() => ''}
                      />
                      <div className='flex flex-col font-secondary '>
                        <span id='name' className='text-base font-semibold' >{profileData?.name}</span>
                        <span id='userName' className='text-sm opacity-50 ' >{profileData?.userName}</span>
                      </div>
                    </Link>
                    <div id='bio' className='font-text'>
                      <div className='mt-4' ></div>
                      <span className='block text-[0.94rem] md:text-base text-wrap max-w-[480px]'>{profileData?.bio}</span>
                    </div>
                    <div id='sex-dateOfBirth' className='flex flex-col gap-1 text-sm'>
                      <span className=' capitalize' >{profileData?.sex || ''}</span>
                      <span >{profileData?.dateOfBirth || ''}</span>
                    </div>
                    <div id="email-phoneNumber-website" className='flex flex-col gap-1 text-sm'>
                      <div className='mt-1'></div>
                      <span>{profileData?.email || ''}</span>
                      <span>{profileData?.phoneNumber || ''}</span>
                      <a href={profileData?.website || ''} className='underline cursor-pointer' target='_blank'>
                        {profileData?.website || ''}
                      </a>
                      <span id='country'>{profileData?.country}</span>
                    </div>
                  </div>
                  <div className='flex flex-col items-end gap-8 relative h-full'>
                    {/* user intertractions */}
                    <Userdotnav
                      userName={profileData?.userName}
                    />
                    <div id='space'></div>
                    {!isAccountOwner ?
                      <Followbutton userNameToFollow={profileData?.userName} /> :
                      null
                    }
                    <div className='flex flex-wrap items-center justify-end gap-4'>
                      <Button
                        id='followers-btn'
                        buttonClass='font-text hover:text-green-500 transition-color'
                        handleClick={() => { setProfileDialog('profiledialog'); setCurreentProfileDialogTab('followerssec') }}
                        children={
                          <>
                            <span>Followers</span>
                            <span className='block text-center'>{profileData?.followers?.length || 0}</span>
                          </>
                        }
                      />
                      <Button
                        id='following-btn'
                        buttonClass='font-text hover:text-green-500 transition-color'
                        handleClick={() => { setProfileDialog('profiledialog'); setCurreentProfileDialogTab('followingsec') }}
                        children={
                          <>
                            <span>Following</span>
                            <span className='block text-center'>{profileData?.following?.length || 0}</span>
                          </>
                        }
                      />
                    </div>
                  </div>
                </div>
                <div id='profile-activities-tabs' className='w-full pt-5'>
                  {/* tabs */}
                  <div id='profile-tab-menus' className='sticky top-0 '>
                    <Menu
                      arrOfMenu={profileAtivitiesTabs.map(item => item.menu)}
                      parentClass="flex justify-between gap-4 border px-2 py-1 shadow-sm"
                      childClass=""
                    />
                  </div>
                  <Tab
                    id='profile-activities-tab'
                    tabClass="flex justify-center pt-5"
                    currentTab={currentProfileContentTab}
                    arrOfTab={profileAtivitiesTabs.map(item => item.tab)}
                  />
                </div>
                <Dialog
                  id="profile-intertractions-dialog"
                  parentClass=""
                  childClass="container relative rounded-sm space-y-2 w-full h-full py-8 bg-white dark:bg-stone-800 dark:text-white overflow-hidden"
                  currentDialog="profiledialog"
                  dialog={profileDialog}
                  setDialog={setProfileDialog}
                  children={
                    <>
                      <div className='flex gap-4'>
                        <Button
                          id="authentication-dialog-close-btn"
                          buttonClass='flex gap-3 items-center'
                          children={<IoMdArrowRoundBack size={20} />}
                          handleClick={() => setProfileDialog(' ')}
                        />
                        <span className="text-xl font-secondary font-bold capitalize">
                          {currentProfileDialogTab.slice(0, -3)}
                        </span>
                      </div>
                      <Tab
                        id='profile-tab'
                        tabClass=""
                        currentTab={currentProfileDialogTab}
                        arrOfTab={[
                          {
                            name: 'followerssec',
                            content: <Followerssec arrOfFollowers={profileData.followers} />
                          },
                          {
                            name: 'followingsec',
                            content: <Followingsec arrOfFollowing={profileData.following} />
                          },
                          {
                            name: 'interestssec',
                            content: <Interentssec arrOfInterents={profileData.interests} />
                          }
                        ]}
                      />
                    </>
                  }
                />
              </div>
              :
              <div id='user-not-found'>profile not found</div>
          }
        </div> :
        <div id='loading-profile'>loading profileData?...</div>
    }
  </div>
};

export default Profilesec;
