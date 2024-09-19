import { useState } from 'react';
import { Advaterprops, Blogpostprops, Commentprops, Userprops } from '../entities';
import { Button, Displayimage, Followbutton, Menu, Tab, Userdotnav } from '../components';
import Blogpostsec from './Blogpostsec';
import CommentSec from './CommentSec';
import Advatersec from './Advatersec';
import { useUserIsLogin } from '../hooks';

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
  profileLoading,
  profileData,

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

  const [currentProfileTab, setCurrentProfileTab] = useState('blogpostssec');

  const profileTabs = [
    {
      menu: {
        name: 'blogpostssec',
        to: '',
        content: <Button children={'Posts'} buttonClass='' handleClick={() => setCurrentProfileTab('blogpostssec')} />,
      },
      tab: {
        name: 'blogpostssec',
        to: '',
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
        to: '',
        content: <Button children={'Comments'} buttonClass='' handleClick={() => setCurrentProfileTab('commentssec')} />,
      },
      tab: {
        name: 'commentssec',
        to: '',
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
        to: '',
        content: <Button children={'Advaters'} buttonClass='' handleClick={() => setCurrentProfileTab('advaterssec')} />,
        tab: <div>Profile images</div>,
      },
      tab: {
        name: 'advaterssec',
        to: '',
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
        to: '',
        content: <Button children={'Groups'} buttonClass='' handleClick={() => setCurrentProfileTab('groupssec')} />,
        tab: <div>Grops</div>,
      },
      tab: {
        name: 'groupssec',
        to: '',
        content: <div>Groups</div>
      },
    },
  ];

  return <>
    {
      !profileLoading ?
        <div>
          {
            (profileData) &&
              Object.keys(profileData).length ?
              <div>
                <div id='profile-datails' className='flex justify-between py-2'>
                  {/* display profile detail */}
                  <div className='space-y-1'>
                    {/* profile data */}

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
                        <Followbutton userName={profileData?.userName} />
                        <Button children={'DM'} buttonClass='border' />
                      </div> :
                      null
                    }
                    <div className='flex flex-wrap items-center justify-end gap-4'>
                      <Button children={
                        <>
                          <span className='border-b pb-1'>Followers</span>
                          <span className='block pt-1'>{profileData?.followers?.length}</span>
                        </>
                      } buttonClass='' />
                      <Button children={
                        <>
                          <span className='border-b pb-1'>Following</span>
                          <span className='block pt-1'>{profileData?.following?.length}</span>
                        </>
                      } buttonClass='' />
                      <Button children={
                        <>
                          <span className='border-b pb-1'>Interests</span>
                          <span className='block pt-1'>100</span>
                        </>
                      } buttonClass='' />
                    </div>
                  </div>
                </div>
                <div id='profile-tabs' className='w-full pt-5'>
                  {/* tabs */}
                  <div id='profile-tab-menus' className='sticky top-0 '>
                    <Menu
                      arrOfMenu={profileTabs.map(item => item.menu)}
                      parentClass="flex justify-between gap-4 border px-2 py-1 shadow-sm"
                      childClass=""
                    />
                  </div>
                  <div id='profile-tabs'>
                    <Tab
                      id={'profile-tab-wrapper'}
                      arrOfTab={profileTabs.map(item => item.tab)}
                      tabClass="flex justify-center pt-5"
                      currentTab={currentProfileTab}
                    />
                  </div>
                </div>
              </div> :
              <div>profile not found</div>
          }
        </div> :
        <div>loading profileData?...</div>
    }
  </>
}

export default Profilesec
