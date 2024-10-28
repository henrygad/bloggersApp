import { useRef } from "react";
import { Blogpostprops } from "../entities";
import { useFetchData } from "../hooks";
import { Singleblogpost } from "../components";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { fetchTimelineFeeds } from "../redux/slices/userBlogpostSlices";

const Feed = () => {
    const { userProfile: {
        data: getProfileData
    } } = useAppSelector((state) => state.userProfileSlices);

    const { timelineFeeds: {
        data: timelineFeeds,
        loading: loadingTimelineFeeds
    } } = useAppSelector((state) => state.userBlogpostSlices);
    const appDispatch = useAppDispatch();

    const { fetchData: fetchNewFeedData, loading: loadingNewFeeds } = useFetchData<Blogpostprops[]>(null);
    const { fetchData: fetchMoreFeedData, loading: loadingMoreFeeds } = useFetchData<Blogpostprops[]>(null);


    const handleLoadNewFeeds = async () => {
        if (!getProfileData ||
            !getProfileData.timeline ||
            !getProfileData.timeline.length) return;

        await fetchNewFeedData(`/api/blogposts/timeline/${getProfileData.timeline.join('&')}`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                appDispatch(fetchTimelineFeeds({
                    data,
                    loading: false,
                    error: '',
                }));
            });
    };

    const handleLoadMoreOldFeeds = async () => {
        if (!getProfileData ||
            !getProfileData.timeline ||
            !getProfileData.timeline.length) return;

        await fetchMoreFeedData(`/api/blogposts/timeline/${getProfileData.timeline.join('&')}?status=published&skip=${timelineFeeds?.length}&limit=5`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                appDispatch(fetchTimelineFeeds({
                    data: [...timelineFeeds, ...data],
                    loading: false,
                    error: '',
                }));
            });
    };


    return <div>
        {
            !loadingTimelineFeeds ?
                <>
                    {timelineFeeds &&
                        timelineFeeds.length ?
                        <div id="display-timelineFeeds-wrapper">
                            <span className="cursor-pointer" onClick={handleLoadNewFeeds}>
                                {!loadingNewFeeds ? 'load new feeds' : 'loading...'}
                            </span>
                            <div>
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
                            </div>
                            <span className="cursor-pointer" onClick={handleLoadMoreOldFeeds}>
                                {!loadingMoreFeeds ? 'load more feeds' : 'loading...'}
                            </span>
                        </div> :
                        <div >no blogpost found</div>
                    }
                </> :
                <div>laoding...</div>
        }
    </div>
};

export default Feed;
