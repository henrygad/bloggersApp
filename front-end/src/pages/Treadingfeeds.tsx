import { useEffect, useState } from "react";
import { useFetchData } from "../hooks";
import { Blogpostprops } from "../entities";
import { Searchform, Singleblogpost } from "../components";

type Props = {
  treadingFeedsData: Blogpostprops[]
  treadingFeedsLoading: boolean
  treadingFeedsError: string
};

const Treadingfeeds = ({
  treadingFeedsData,
  treadingFeedsLoading,
  treadingFeedsError,
}: Props) => {

  const [treading, setTreading] = useState<Blogpostprops[]>([])

  const { fetchData: fetchNewFeedData, loading: loadingNewFeeds } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchMoreFeedData, loading: loadingMoreFeeds } = useFetchData<Blogpostprops[]>(null);

  const handleLoadNewFeeds = async () => {
    await fetchNewFeedData('/api/blogposts?status=published')
      .then((res) => {
        const { data } = res;
        if (!data) return;
        setTreading(data);
      });
  };

  const handleLoadMoreOldFeeds = async () => {
    await fetchMoreFeedData(`/api/blogposts?status=published&skip=${treading.length}&limit=5`)
      .then((res) => {
        const { data } = res;
        if (!data) return;
        setTreading((pre) => [...pre, ...data]);
      });
  };

  useEffect(() => {
    if (treadingFeedsData) setTreading(treadingFeedsData);
  }, [treadingFeedsData,]);


  return <div>
    <div id="search-form-wrapper" className="relative flex justify-center w-full">
      <div className="absolute -top-8">
        <Searchform />
      </div>
    </div>
    <div id="display-blogpost-wrapper"
      className="flex justify-center py-10">
      {
        !treadingFeedsLoading ?
          <>
            {treading &&
              treading.length ?
              <div>
                <span className="block text-center cursor-pointer mb-8" onClick={handleLoadNewFeeds}>
                  {!loadingNewFeeds ? 'load new feeds' : 'loading...'}
                </span>
                <>
                  {
                    treading.map((item, index) =>
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
                <span className="block text-center cursor-pointer mb-8" onClick={handleLoadMoreOldFeeds}>
                  {!loadingMoreFeeds ? 'load more feeds' : 'loading...'}
                </span>
              </div> :
              null
            }
          </> :
          <div>laoding...</div>
      }
    </div>
  </div>
};

export default Treadingfeeds;
