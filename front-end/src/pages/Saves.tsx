import { Backwardnav, Singleblogpost } from "../components";
import { useAppSelector } from "../redux/slices"

const Saves = () => {
  const { savedsBlogposts: { data: blogposts, loading: loadingSaves } } = useAppSelector((state) => state.userBlogpostSlices);

  return <div >
    <Backwardnav  pageName="Saves" />
    <div className="flex justify-center">
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
            null
          }
        </> :
        <div>loading...</div>
      }
    </div>
  </div>
}

export default Saves
