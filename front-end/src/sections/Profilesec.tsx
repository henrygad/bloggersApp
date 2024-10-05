import { useState } from 'react';
import { Advaterprops, Blogpostprops, Commentprops, Userprops } from '../entities';
import { Button, Dialog, Displayimage, Followbutton, Menu, Tab, Userdotnav } from '../components';
import Blogpostsec from './Blogpostsec';
import CommentSec from './CommentSec';
import Advatersec from './Advatersec';
import { useUserIsLogin } from '../hooks';
import Followerssec from './Followerssec';
import Followingsec from './Followingsec';
import Interentssec from './Interentssec';
import { Link } from 'react-router-dom';

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

  profileCommentsData: Commentprops[]
  profileCommentsLoading: boolean
  profileCommentsError: string
  handleServerLoadMoreComments: () => void
  moreCommentsLoading: boolean
  moreCommentsError: string


  profileAdvatersData: Advaterprops[],
  profileAdvatersLoading: boolean,
  profileAdvatersError: string,
  handleServerLoadMoreAdvaters: () => void,
  moreAdvatersLoading: boolean,
  moreAdvatersError: string,
};


const Profilesec = ({
  profileData,
  profileLoading,

  profileBlogposts,
  profileBlogpostsLoading,
  profileBlogpostsError,
  handleServerLoadMoreBlogposts,
  moreBlogpostsLoading,
  moreBlogpostsError,

  profileCommentsData,
  profileCommentsLoading,
  profileCommentsError,
  handleServerLoadMoreComments,
  moreCommentsLoading,
  moreCommentsError,

  profileAdvatersData,
  profileAdvatersLoading,
  profileAdvatersError,
  handleServerLoadMoreAdvaters,
  moreAdvatersLoading,
  moreAdvatersError,

}: Props) => {
  const { loginStatus: { loginUserName } } = useUserIsLogin();
  const isAccountOwner = profileData && profileData?.userName === loginUserName;

  const [profileDialog, setProfileDialog] = useState(' ');
  const [currentProfileTab, setCurrentProfileTab] = useState('followerssec');
  const [currentProfileAtivitiesTab, setCurrentProfileAtivitiesTab] = useState('blogpostssec');

  const profileAtivitiesTabs = [
    {
      menu: {
        name: 'blogpostssec',
        content: <Button children={<>
          Post <span>{profileBlogposts && profileBlogposts.length ? profileBlogposts.length : 0}</span>
        </>} buttonClass='' handleClick={() => setCurrentProfileAtivitiesTab('blogpostssec')} />,
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
        />
      }
    },
    {
      menu: {
        name: 'commentssec',
        content: <Button children={<>
          Comment <span>{profileCommentsData && profileCommentsData.length ? profileCommentsData.length : 0}</span>
        </>} buttonClass='' handleClick={() => setCurrentProfileAtivitiesTab('commentssec')} />,
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
        />
      },
    },
    {
      menu: {
        name: 'advaterssec',
        content: <Button children={<>
          Advater <span>{profileAdvatersData && profileAdvatersData.length ? profileAdvatersData.length : 0}</span>
        </>} buttonClass='' handleClick={() => setCurrentProfileAtivitiesTab('advaterssec')} />,
        tab: <div>Profile images</div>,
      },
      tab: {
        name: 'advaterssec',
        content: <Advatersec
          profileAdvatersData={profileAdvatersData}
          profileAdvatersLoading={profileAdvatersLoading}
          profileAdvatersError={profileAdvatersError}
          handleServerLoadMoreAdvaters={handleServerLoadMoreAdvaters}
          moreAdvatersLoading={moreAdvatersLoading}
          moreAdvatersError={moreAdvatersError}
        />
      },
    },
    {
      menu: {
        name: 'groupssec',
        content: <Button children={<>
          Groups <span>{0}</span>
        </>} buttonClass='' handleClick={() => setCurrentProfileAtivitiesTab('groupssec')} />,
        tab: <div>Grops</div>,
      },
      tab: {
        name: 'groupssec',
        content: <div>Groups</div>
      },
    },
  ];

  return <>
    {
      !profileLoading ?
        <>
          {
            (profileData) &&
              Object.keys(profileData).length ?
              <div id='profile-wrapper'>
                <div id='profile-datails' className='flex justify-between py-2'>
                  {/* display profile detail */}
                  <div className='space-y-1'>
                    {/* profile data */}
                    <Link to='/editprofile' className='' >
                      <Displayimage
                        id={'avater'}
                        imageUrl={"/api/image/" + profileData?.displayImage}
                        parentClass='h-14 w-14'
                        imageClass='object-contain rounded-full border-2 border-green-300'
                        onClick={() => ''}
                      />
                      <div className='flex flex-col font-secondary '>
                        <span id='name' className='text-base font-semibold' >{profileData?.name}</span>
                        <span id='userName' className='text-sm opacity-50 ' >{profileData?.userName}</span>
                      </div>
                    </Link>
                    <div className='font-text'>
                      <div className='mt-4' ></div>
                      <span id='bio' className='block text-[0.94rem] md:text-base text-wrap max-w-[480px]'>{profileData?.bio}</span>
                    </div>
                    <div className='flex flex-col gap-1 text-sm'>
                      <span id='sex' className=' capitalize' >{profileData?.sex}</span>
                      <span id="dateOfBirth">{profileData?.dateOfBirth}</span>
                    </div>
                    <div className='flex flex-col gap-1 text-sm'>
                      <div className='mt-1'></div>
                      <span id='email'>{profileData?.email}</span>
                      <span id='phoneNumber'>{profileData?.phoneNumber}</span>
                      <a id="website" href={profileData?.website} className='underline cursor-pointer '>{profileData?.website}</a>
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
                      <div className='flex items-center gap-4'>
                        <Followbutton userNameToFollow={profileData?.userName} />
                        <Button children={'DM'} buttonClass='border' />
                      </div> :
                      null
                    }
                    <div className='flex flex-wrap items-center justify-end gap-4'>
                      <Button
                        buttonClass=''
                        handleClick={() => { setProfileDialog('profiledialog'); setCurrentProfileTab('followerssec') }}
                        children={
                          <>
                            <span className='border-b pb-1'>Followers</span>
                            <span className='block pt-1'>{profileData?.followers?.length}</span>
                          </>
                        }
                      />
                      <Button
                        buttonClass=''
                        handleClick={() => { setProfileDialog('profiledialog'); setCurrentProfileTab('followingsec') }}
                        children={
                          <>
                            <span className='border-b pb-1'>Following</span>
                            <span className='block pt-1'>{profileData?.following?.length}</span>
                          </>
                        }
                      />
                      <Button
                        buttonClass=''
                        handleClick={() => { setProfileDialog('profiledialog'); setCurrentProfileTab('interestssec') }}
                        children={
                          <>
                            <span className='border-b pb-1'>Interests</span>
                            <span className='block pt-1'>100</span>
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
                    id={'profile-activities-tab'}
                    arrOfTab={profileAtivitiesTabs.map(item => item.tab)}
                    tabClass="flex justify-center pt-5"
                    currentTab={currentProfileAtivitiesTab}
                  />
                </div>
                <Dialog
                  id="profile-intertractions-dialog"
                  parentClass="flex justify-center"
                  childClass=""
                  currentDialog="profiledialog"
                  dialog={profileDialog}
                  setDialog={setProfileDialog}
                  children={
                    <>
                      <Tab
                        id='profile-tab'
                        tabClass=" flex justify-center items-center"
                        currentTab={currentProfileTab}
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
              <div>profile not found</div>
          }
        </> :
        <div>loading profileData?...</div>
    }
  </>
}

export default Profilesec
