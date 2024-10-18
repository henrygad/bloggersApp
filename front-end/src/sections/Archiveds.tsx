import { Singleblogpost } from "../components";
import { useAppSelector } from "../redux/slices";


const Archiveds = () => {
    const { userBlogposts: { data, loading: loadingArchives } } = useAppSelector((state) => state.userBlogpostSlices);

    const archivedBlogposts = data.filter(item => item.status === 'archived');

    return <div>
        {!loadingArchives ?
            <div>
                {archivedBlogposts &&
                    archivedBlogposts.length ?
                    <>{archivedBlogposts.map((item, index) =>
                            < Singleblogpost
                                key={item._id}
                                blogpost={item}
                                type='text'
                                index={index}
                            />
                    )}</> :
                    <div>no archived</div>
                }
            </div> :
            <div>loading....</div>
        }
    </div>
};

export default Archiveds;
