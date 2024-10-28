import { Singleblogpost } from "../components";
import { useAppSelector } from "../redux/slices";


const Archiveds = () => {
    const { archivedBlogposts: { data, loading: loadingArchives } } = useAppSelector((state) => state.userBlogpostSlices);

    const archivedBlogposts = data.filter(item => item.status === 'archived');

    return <div>
        {!loadingArchives ?
            <div>
                {archivedBlogposts &&
                    archivedBlogposts.length ?
                    <div id="archived-blogpost-wrapper">
                        {archivedBlogposts
                            .map((item, index) =>
                                < Singleblogpost
                                    key={item._id}
                                    blogpost={item}
                                    type='text'
                                    index={index}
                                />
                            )}
                    </div> :
                    <div id="no-archived-found">no archived</div>
                }
            </div> :
            <div id="loading-archived">loading....</div>
        }
    </div>
};

export default Archiveds;
