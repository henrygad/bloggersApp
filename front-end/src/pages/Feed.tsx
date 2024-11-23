import { useEffect, useState } from "react";
import { Blogpostprops, Userprops } from "../entities";
import { useEventSource, useFetchData, useScrollPercent } from "../hooks";
import { Button, Displayimage, LandLoading, Singleblogpost } from "../components";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { fetchTimelineFeeds } from "../redux/slices/userBlogpostSlices";
import { Link } from "react-router-dom";
import avaterPlaceholder from '../assert/avaterplaceholder.svg'

const Feed = () => {
    const { scrollPercent } = useScrollPercent();

    const { userProfile: {
        data: getProfileData
    } } = useAppSelector((state) => state.userProfileSlices);

    const { data: users, loading: loadingUsers } =
        useFetchData<Userprops[]>(getProfileData && getProfileData.following.length <= 0 ? '/api/users?skip=0&limit=10' : null, 
            [getProfileData && getProfileData.following]);
    const [peopleToFollow, setPeopleToFollow] = useState<Userprops[]>([]);

    const { timelineFeeds: {
        data: timelineFeeds,
        loading: loadingTimelineFeeds
    } } = useAppSelector((state) => state.userBlogpostSlices);

    const appDispatch = useAppDispatch();

    const { fetchData: fetchStreamNewFeedData, data: streamedFeeds, setData: setStreamedFeeds, loading } = useEventSource<Blogpostprops>('');
    const { fetchData: fetchMoreFeedsData, loading: loadingMoreFeeds } = useFetchData<Blogpostprops[]>(null);
    const { fetchData: fetchRefreshFeedData, loading: loadingRefreshFeeds } = useFetchData<Blogpostprops[]>(null);

    const handleStreamNewFeeds = async () => {
        if (!getProfileData ||
            !getProfileData.timeline) return;

        fetchStreamNewFeedData(`/api/stream/changes/blogposts/timeline/${getProfileData && getProfileData.timeline.join('&')}`);
    };

    const handleRefreshFeeds = async () => {
        if (!getProfileData ||
            !getProfileData.timeline) return;

        fetchRefreshFeedData(`/api/blogposts/timeline/${getProfileData.timeline.join('&')}?status=published&skip=0&limit=${timelineFeeds?.length}`)
            .then((res) => {

                const { data } = res;
                if (data) {
                    appDispatch(fetchTimelineFeeds({
                        data,
                        loading: false,
                        error: '',
                    }));
                };
            });
    };

    const handleLoadMoreFeeds = async () => {
        if (!getProfileData ||
            !getProfileData.timeline) return;

        fetchMoreFeedsData(`/api/blogposts/timeline/${getProfileData.timeline.join('&')}?status=published&skip=${timelineFeeds?.length}&limit=10`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                setStreamedFeeds(null);
                appDispatch(fetchTimelineFeeds({
                    data: [...timelineFeeds, ...data],
                    loading: false,
                    error: '',
                }));
            });
    };

    const handleLoadFeedsOnScroll = () => {
        if (scrollPercent === 0) {
            if (loadingMoreFeeds) return;
            handleRefreshFeeds();
        } else if (scrollPercent === 100) {
            if (loadingRefreshFeeds) return;
            handleLoadMoreFeeds();
        };
    };

    const handleAddStreamFeeds = () => {
        if (streamedFeeds) {
            appDispatch(fetchTimelineFeeds({
                data: [streamedFeeds, ...timelineFeeds],
                loading: false,
                error: '',
            }));
            setStreamedFeeds(null);
        };
    };

    useEffect(() => {
        if (users &&
            getProfileData
        ) {
            setPeopleToFollow(users.filter(item=> item.userName !== getProfileData.userName));
        };
    }, [users, getProfileData?.userName]);

    useEffect(() => {
        handleStreamNewFeeds();
    }, [getProfileData]);

    useEffect(() => {
        handleLoadFeedsOnScroll();
    }, [scrollPercent]);


    return <div className="relative flex flex-col items-center gap-8 justify-center">
        {
            getProfileData &&
                getProfileData.following.length <= 0 ?
                <div id="list-of-user-you-might-know">
                    {
                        !loadingUsers ?
                            <>
                                <span className="text-2xl font-primary font-semibold">
                                    People you might know
                                </span>
                                <div className="flex items-center gap-6 w-full max-w-full py-2 overflow-x-auto">
                                    {peopleToFollow ?
                                        peopleToFollow.map((user) =>
                                            <Link key={user.userName} to={'/' + user.userName} className="flex items-start justify-start gap-3 min-w-[180px]">
                                                <Displayimage
                                                    id={'avater'}
                                                    placeHolder={avaterPlaceholder}
                                                    imageId={user.displayImage}
                                                    parentClass='h-11 w-11'
                                                    imageClass='object-contain rounded-full'
                                                />
                                                <div className='flex flex-col font-secondary '>
                                                    <span id='name' className='text-base font-semibold'>{user.name}</span>
                                                    <span id='userName' className='text-[0.8rem] opacity-50'>{user.userName}</span>
                                                </div>
                                            </Link>
                                        ) :
                                        null
                                    }
                                </div>
                            </> :
                            <div>loading...</div>
                    }
                </div> :
                null
        }
        {
            !loadingTimelineFeeds ?
                <>
                    {timelineFeeds &&
                        timelineFeeds.length ?
                        <div>
                            {streamedFeeds ?
                                <Button
                                    id="load-new-feeds"
                                    buttonClass="absolute top-0 right-0 left-0 p-1 rounded-xl bg-green-500 z-10"
                                    children="New blogpost is avaliable"
                                    handleClick={handleAddStreamFeeds}
                                />
                                :
                                null
                            }
                            <LandLoading loading={loadingRefreshFeeds} />
                            <>
                                {
                                    timelineFeeds.map((item, index) =>
                                        item.status === 'published' ?
                                            <Singleblogpost
                                                key={item._id}
                                                type={'text'}
                                                index={index}
                                                blogpost={item}
                                            /> :
                                            null
                                    )
                                }
                            </>
                            <LandLoading loading={loadingMoreFeeds} />
                        </div> :
                        null
                    }
                </> :
                <div>laoding...</div>
        }
    </div>
};

export default Feed;
