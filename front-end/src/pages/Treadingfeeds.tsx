import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { useFetchData } from "../hooks";
import { Blogpostprops } from "../entities";
import { Singleblogpost } from "../components";
import { addTreadingFeeds } from "../redux/slices/treadingFeedsSlices";

const Treadingfeeds = () => {
  const initialLoadingFeedAmount = 5
  const { treadingFeeds: { data: getTreadingFeeds, loading: loadingTreadingFeeds } } = useAppSelector((state) => state.treadingfeedsSlices);
  const appDispatch = useAppDispatch();

  const { fetchData: fetchNewFeedData, loading: loadingNewFeeds } = useFetchData<Blogpostprops[] | null>(null);

  const { fetchData: fetchMoreFeedData, loading: loadingMoreFeeds } = useFetchData<Blogpostprops[] | null>(null);
  const skipCountRef = useRef(initialLoadingFeedAmount);

  const handleLoadMoreFeeds = async () => {
    const response = await fetchMoreFeedData('/api/blogposts');

    const { ok, data } = response;
    if (ok && data) {
      appDispatch(addTreadingFeeds((pre: { data: Blogpostprops[], }) => pre ? { ...pre, data: [...pre.data, data] } : pre));
      skipCountRef.current += initialLoadingFeedAmount
    };
  };

  const handleLoadNewFeeds = async () => {
    const response = await fetchNewFeedData('/api/blogposts');
    const { ok, data } = response;
    if (ok && data) {
      appDispatch(addTreadingFeeds((pre: { data: Blogpostprops[], }) => pre ? { ...pre, data: [...pre.data, data] } : pre));
    };
  };


  return <div>
    {
      !loadingTreadingFeeds ?
        <>
          {getTreadingFeeds &&
            getTreadingFeeds.length ?
            <>
              <span className="cursor-pointer" onClick={handleLoadNewFeeds}>
                {!loadingNewFeeds ? 'load new feeds' : 'loading...'}
              </span>
              <div>
                {
                  getTreadingFeeds.map((item, index) =>
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

export default Treadingfeeds;
