import { useEffect, useRef, useState } from "react";
import { Blogpostprops } from "../entities";
import { useFetchData } from "../hooks";
import { Singleblogpost } from "../components";
import { useAppSelector } from "../redux/slices";

const Feed = () => {
    const initialLoadingFeedAmount = 5
    const { userProfile: { data: getProfileData } } = useAppSelector(state => state.userProfileSlices);

    const { data: getFeedData, loading: laodingFeeds } = useFetchData<Blogpostprops[] | null>(
        getProfileData &&
            getProfileData.timeline &&
            getProfileData.timeline.length ? `/api/feed/timeline/${getProfileData.timeline.join('&')}?skip=0&limit=${initialLoadingFeedAmount}` :
            null,
        [getProfileData?.timeline?.length]
    );
    const [feeds, setFeeds] = useState<Blogpostprops[] | null>(null);

    const { fetchData: fetchMoreFeedData, loading: loadingMoreFeeds } = useFetchData<Blogpostprops[] | null>(null);
    const skipCountRef = useRef(initialLoadingFeedAmount);

    const { fetchData: fetchNewFeedData, loading: loadingNewFeeds } = useFetchData<Blogpostprops[] | null>(null);

    const handleLoadMoreFeeds = async () => {
        const response = await fetchMoreFeedData(
            getProfileData &&
                getProfileData.timeline &&
                getProfileData.timeline.length ? `/api/feed/timeline/${getProfileData.timeline.join('&')}?skip=${skipCountRef.current}&limit=1` :
                ' ');

        const { ok, data } = response;
        if (ok && data) {
            setFeeds(pre => pre ? [...pre, ...data] : pre);
            skipCountRef.current += initialLoadingFeedAmount
        };
    };

    const handleLoadNewFeeds = async () => {
        const response = await fetchNewFeedData(
            getProfileData &&
                getProfileData.timeline &&
                getProfileData.timeline.length ? `/api/feed/timeline/${getProfileData.timeline.join('&')}?skip=0&limit=${skipCountRef.current}` :
                ' '
        );
        const { ok, data } = response;
        if (ok && data) {
            setFeeds(pre => pre ? [...pre, ...data] : pre);
        };
    };

    useEffect(() => {
        setFeeds(getFeedData);
    }, [getFeedData]);

    return <div>
        {
            !laodingFeeds ?
                <>
                    {feeds &&
                        feeds.length ?
                        <>
                            <span className="cursor-pointer" onClick={handleLoadNewFeeds}>
                              {!loadingNewFeeds ? 'load new feeds' : 'loading...'}  
                            </span>
                            <div>
                                {
                                    feeds.map((item, index) =>
                                        <Singleblogpost
                                            type={'text'}
                                            index={index}
                                            blogpost={item}
                                        />
                                    )
                                }
                            </div>
                            <span className="cursor-pointer" onClick={handleLoadMoreFeeds}>
                                {!loadingMoreFeeds ? 'load more feed' : 'loading...'}
                            </span>
                        </> :
                        <div>no blogpost found</div>
                    }
                </> :
                <div>laoding...</div>
        }
    </div>
};

export default Feed;
