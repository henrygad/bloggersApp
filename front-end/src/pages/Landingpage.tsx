import { useEffect, useState } from "react";
import { useScrollPercent, useFetchData } from "../hooks";
import { Blogpostprops } from "../entities";
import { Searchform, Singleblogpost } from "../components";

type Props = {
    treadingFeedsData: Blogpostprops[]
    treadingFeedsLoading: boolean
    treadingFeedsError: string
};

const Landingpage = ({
    treadingFeedsData,
    treadingFeedsLoading,
    treadingFeedsError,
}: Props) => {

    const [treading, setTreading] = useState<Blogpostprops[]>([]);

    const { fetchData: fetchRefreshFeedData, loading: loadingRefreshFeeds } = useFetchData<Blogpostprops[]>(null);
    const { fetchData: fetchMoreFeedData, loading: loadingMoreFeeds, error } = useFetchData<Blogpostprops[]>(null);

    const handleRefreshFeed = async () => {
        await fetchRefreshFeedData(`/api/blogposts?status=published&skip=0&limit=${treading.length}`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                setTreading(data);
            });
    };

    const handleLoadMoreFeeds = async () => {
        console.log(treading.length)
        await fetchMoreFeedData(`/api/blogposts?status=published&skip=${treading.length}&limit=10`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                setTreading((pre) => [...pre, ...data]);
            });
    };

    useScrollPercent((getScollPercentage) => {
        if (getScollPercentage === 0) {
            handleRefreshFeed();
        };

        if (getScollPercentage === 100) {
            handleLoadMoreFeeds();
        };
    });

    useEffect(() => {
        if (treadingFeedsData) setTreading(treadingFeedsData);
    }, [treadingFeedsData]);

    return <div>
        <div id="search-form-wrapper" className="relative flex justify-center w-full">
            <div className="absolute -top-8">
                <Searchform />
            </div>
        </div>
        <div id="display-blogpost-wrapper" className="flex justify-center py-10">
            {
                !treadingFeedsLoading ?
                    <>
                        {treading &&
                            treading.length ?
                            <div>
                                <span className={`block text-center ${!loadingRefreshFeeds ? '' : 'h-5'} cursor-pointer mt-8`}>
                                    {!loadingRefreshFeeds ? null : 'loading...'}
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
                                <span className={`block text-center ${!loadingMoreFeeds ? 'h-0' : 'h-5'} cursor-pointer mt-8`}>
                                    {!loadingMoreFeeds ? null : 'loading...'}
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

export default Landingpage;
