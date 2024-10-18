import { useEffect, useRef, useState } from "react";
import { Blogpostprops } from "../entities";
import { useFetchData } from "../hooks";
import { Singleblogpost } from "../components";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { addTimelineFeeds } from "../redux/slices/userTimelineFeedSlices";

const Feed = () => {
    const initialLoadingFeedAmount = 5
    const { userProfile: { data: getProfileData } } = useAppSelector((state) => state.userProfileSlices);
    const { userTimelineFeeds: { data: getTimelineFeed, loading: loadingTimelineFeeds } } = useAppSelector((state) => state.userTimelineFeedSlices);
    const appDispatch = useAppDispatch();

    const { fetchData: fetchNewFeedData, loading: loadingNewFeeds } = useFetchData<Blogpostprops[] | null>(null);

    const { fetchData: fetchMoreFeedData, loading: loadingMoreFeeds } = useFetchData<Blogpostprops[] | null>(null);
    const skipCountRef = useRef(initialLoadingFeedAmount);

    const handleLoadMoreFeeds = async () => {
        const response = await fetchMoreFeedData(
            getProfileData.timeline &&
                getProfileData.timeline.length ? `/api/blogposts/timeline/${getProfileData.timeline.join('&')}?skip=${skipCountRef.current}&limit=1` :
                ' ');

        const { ok, data } = response;
        if (ok && data) {
            appDispatch(addTimelineFeeds((pre: { data: Blogpostprops[], }) => pre ? { ...pre, data: [...pre.data, data] } : pre));
            skipCountRef.current += initialLoadingFeedAmount
        };
    };

    const handleLoadNewFeeds = async () => {
        const response = await fetchNewFeedData(
            getProfileData.timeline &&
                getProfileData.timeline.length ? `/api/blogposts/timeline/${getProfileData.timeline.join('&')}?skip=0&limit=${skipCountRef.current}` :
                ' '
        );
        const { ok, data } = response;
        if (ok && data) {
            appDispatch(addTimelineFeeds((pre: { data: Blogpostprops[], }) => pre ? { ...pre, data: [...pre.data, data] } : pre));
        };
    };

    return <div>
        {
            !loadingTimelineFeeds ?
                <>
                    {getTimelineFeed &&
                        getTimelineFeed.length ?
                        <>
                            <span className="cursor-pointer" onClick={handleLoadNewFeeds}>
                                {!loadingNewFeeds ? 'load new feeds' : 'loading...'}
                            </span>
                            <div>
                                {
                                    getTimelineFeed.map((item, index) =>
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
                            </div>
                            <span className="cursor-pointer" onClick={handleLoadMoreFeeds}>
                                {!loadingMoreFeeds ? 'load more feeds' : 'loading...'}
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
