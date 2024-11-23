import { useEffect, useState } from "react";
import { useScrollPercent, useFetchData } from "../hooks";
import { Blogpostprops } from "../entities";
import { LandLoading, Searchform, Singleblogpost } from "../components";

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
    const { scrollPercent } = useScrollPercent();
    const [treading, setTreading] = useState<Blogpostprops[]>([]);

    const { fetchData: fetchRefreshFeedData, loading: loadingRefreshFeeds } = useFetchData<Blogpostprops[]>(null);
    const { fetchData: fetchMoreFeedData, loading: loadingMoreFeeds } = useFetchData<Blogpostprops[]>(null);

    const handleRefreshFeeds = async () => {
        fetchRefreshFeedData(`/api/blogposts?status=published&skip=0&limit=${treading.length}`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                setTreading(data);
            });
    };

    const handleLoadMoreFeeds = async () => {
        fetchMoreFeedData(`/api/blogposts?status=published&skip=${treading.length}&limit=10`)
            .then((res) => {
                const { data } = res;
                if (!data) return;
                setTreading((pre) => [...pre, ...data]);
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

    useEffect(() => {
        if (treadingFeedsData) setTreading(treadingFeedsData);
    }, [treadingFeedsData]);

    useEffect(() => {
        handleLoadFeedsOnScroll();
    }, [scrollPercent]);

    return <div >
        <Searchform />
        <div id="display-blogpost-wrapper" className="flex justify-center py-10">
            {
                !treadingFeedsLoading ?
                    <>
                        {treading &&
                            treading.length ?
                            <div>
                                <LandLoading loading={loadingRefreshFeeds} />
                                <>
                                    {
                                        treading.map((item, index) =>
                                            item.status === 'published' ?
                                                <Singleblogpost
                                                    key={item._id}
                                                    type={'text'}
                                                    index={index}
                                                    blogpost={item}
                                                    callBack={({ _id }) => setTreading(pre => pre.filter(item => item._id !== _id))}
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
    </div>
};

export default Landingpage;
