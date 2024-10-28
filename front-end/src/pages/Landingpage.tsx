import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { useFetchData } from "../hooks";
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
        <div>
            <Searchform />
        </div>
        {
            !treadingFeedsLoading ?
                <div id="display-blogpost-wrapper">
                    {treading &&
                        treading.length ?
                        <>
                            <span className="cursor-pointer" onClick={handleLoadNewFeeds}>
                                {!loadingNewFeeds ? 'load new feeds' : 'loading...'}
                            </span>
                            <div id="list-treading-blogposts">
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
                            </div>
                            <span className="cursor-pointer" onClick={handleLoadMoreOldFeeds}>
                                {!loadingMoreFeeds ? 'load more feeds' : 'loading...'}
                            </span>
                        </> :
                        <div>no blogpost found</div>
                    }
                </div> :
                <div>laoding...</div>
        }
    </div>
};

export default Landingpage;
