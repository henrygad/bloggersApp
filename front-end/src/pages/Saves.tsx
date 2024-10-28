import { Singleblogpost } from "../components";
import { useAppSelector } from "../redux/slices"

const Saves = () => {
  const { savedsBlogposts: { data: blogposts, loading: loadingSaves } } = useAppSelector((state) => state.userBlogpostSlices);

  return <div>
    {!loadingSaves ?
      <>
        {blogposts && blogposts.length ?
          <div id="display-saves-wrapper">
            {
              blogposts.map((item, index) =>
                item.status === 'published' ?
                  <Singleblogpost
                    key={item._id}
                    type="text"
                    blogpost={item}
                    index={index}
                  /> :
                  null
              )
            }
          </div> :
          <div>no saves</div>
        }
      </> :
      <div>loading...</div>
    }
  </div>
}

export default Saves
