import { Singleblogpost } from "../components";
import { useAppSelector } from "../redux/slices"

const Saves = () => {
  const { userSaves: { data: blogposts, loading: loadingSaves } } = useAppSelector((state) => state.userSavesSlices);

  return <div>
    {!loadingSaves ?
      <>
        {blogposts && blogposts.length ?
          <>{
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
          }</> :
          <div>no saves</div>
        }
      </> :
      <div>loading...</div>
    }
  </div>
}

export default Saves
