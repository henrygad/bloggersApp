import { Singleblogpost } from "../components";
import { useAppSelector } from "../redux/slices";

const Unpublisheds = () => {
    const { unpublishedBlogposts: { data, loading: loadingUnPublishes } } = useAppSelector((state) => state.userBlogpostSlices);

    const unPublishedBlogposts = data.filter(item => item.status === 'unpublished');

    return <div>
        {!loadingUnPublishes ?
            <div>
                {unPublishedBlogposts &&
                    unPublishedBlogposts.length ?
                    <>{unPublishedBlogposts.map((item, index) =>
                        < Singleblogpost
                            key={item._id}
                            blogpost={item}
                            type='text'
                            index={index}
                        />)
                    }</> :
                    <div>no unPublished</div>
                }
            </div> :
            <div>loading....</div>
        }
    </div>
};

export default Unpublisheds;
