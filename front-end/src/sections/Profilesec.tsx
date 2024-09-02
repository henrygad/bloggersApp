import React, { useState } from 'react';
import { Blogpostprops, Userprops } from '../entities';
import { Button, Displayimage, Menu, Tab } from '../components';
import { useNavigate } from 'react-router-dom';

type Props = {
  profileLoading: boolean
  profileError: string
  profileData: Userprops
  profileBlogposts: Blogpostprops[]
  profileBlogpostsLoading: boolean
  profileBlogpostsError: string
};


const Profilesec = ({ profileLoading, profileError, profileData, profileBlogposts, profileBlogpostsError, profileBlogpostsLoading }: Props) => {
  const [currentProfileTab, setCurrentProfileTab] = useState('posts');
  const navigate  = useNavigate();

  const arrProfiletabs = [
    {
      name: 'Post',
      to: '',
      content: <Button children={'Post'} buttonClass='' handleClick={() => setCurrentProfileTab('')} />,
      tab: <div>Post</div>
    },
    {
      name: 'Comments',
      to: '',
      content: <Button children={'Comments'} buttonClass='' handleClick={() => setCurrentProfileTab('')} />,
      tab: <div>Comments</div>,
    },
    {
      name: 'Profile images',
      to: '',
      content: <Button children={'Profile images'} buttonClass='' handleClick={() => setCurrentProfileTab('')} />,
      tab: <div>Profile images</div>,
    },
    {
      name: 'Groups',
      to: '',
      content: <Button children={'Groups'} buttonClass='' handleClick={() => setCurrentProfileTab('')} />,
      tab: <div>Grops</div>,
    },
    {
      name: 'Cousers',
      to: '',
      content: <Button children={'Cousers'} buttonClass='' handleClick={() => setCurrentProfileTab('')} />,
      tab: <div>Cousers</div>,
    },
  ];


  const handleEditBlogpost = (blogpost: Blogpostprops)=>{
    navigate('/createpost', {state: {toEdit: true, data: blogpost}});
  };

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
                      imageUrl={"/api/image/" + profileData.displayImage}
                      parentClass='h-14 w-14'
                      imageClass='object-contain rounded-full border-2 border-green-300'
                      onClick={() => ''}
                    />
                    <div className='flex flex-col font-secondary '>
                      <span id='userName' className='text-sm opacity-50 ' >{profileData.userName}</span>
                      <span id='name' className='text-base font-semibold' >{profileData.name}</span>
                    </div>
                    <div className='font-text'>
                      <div className='mt-4' ></div>
                      <span id='bio' className='block text-[0.94rem] md:text-base text-wrap max-w-[320px]'>{profileData.bio}</span>
                    </div>
                    <div className='flex flex-col gap-1 text-sm'>
                      <span id='sex' className=' capitalize' >{profileData.sex}</span>
                      <span id="dateOfBirth">{profileData.dateOfBirth}</span>
                    </div>
                    <div className='flex flex-col gap-1 text-sm'>
                      <div className='mt-1'></div>
                      <span id='email'>{profileData.email}</span>
                      <span id='phoneNumber'>{profileData.phoneNumber}</span>
                      <a id="website" href={profileData.website} className='underline cursor-pointer '>{profileData.website}</a>
                      <span id='country'>{profileData.country}</span>
                    </div>
                  </div>
                  <div className='flex flex-col items-end gap-8 h-full mt-10'>
                    {/* user intertractions */}
                    <div className='flex items-center gap-4 '>
                      <Button children={'Follow'} buttonClass='border' />
                      <Button children={'DM'} buttonClass='border' />
                    </div>
                    <div className='flex flex-wrap items-center justify-end gap-4'>
                      <Button children={
                        <>
                          <span className='border-b pb-1'>Followers</span>
                          <span className='block pt-1'>90</span>
                        </>
                      } buttonClass='' />
                      <Button children={
                        <>
                          <span className='border-b pb-1'>Following</span>
                          <span className='block pt-1'>1000</span>
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
                  <div id='profile-tab-menu' className='relative'>
                    <Menu
                      arrOfMenu={arrProfiletabs}
                      parentClass="flex justify-between gap-4 sticky bottom-0 border px-2 py-1"
                      childClass=""
                    />
                  </div>
                  <div id='profile-tab'>
                    <Tab
                      id={'profileTab'}
                      arrOfTab={[
                        {
                          name: 'posts', content: <div>
                            <div>
                              {!profileBlogpostsLoading ?
                                <div>
                                  {profileBlogposts &&
                                    profileBlogposts.length ?
                                    <div className='space-y-4'>
                                      {profileBlogposts.map(
                                        (item) => <div  key={item._id}
                                        className='border'
                                        >
                                          <div>{item.title}</div>
                                          <div>{item.body}</div>
                                          <button onClick={()=>handleEditBlogpost(item)}  >edit</button>
                                        </div>
                                      )}
                                    </div> :
                                    <div>no blog post</div>
                                  }
                                </div> :
                                <div>loading blogpost...</div>}
                            </div>
                          </div>
                        }
                      ]}
                      parentClass="py-4"
                      currentTab={currentProfileTab}
                    />
                  </div>
                </div>
              </div> :
              <div>profile not found</div>
          }
        </div> :
        <div>loading profileData...</div>
    }
  </>
}

export default Profilesec
