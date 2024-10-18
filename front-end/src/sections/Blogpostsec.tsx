import { Singleblogpost } from "../components";
import { Blogpostprops } from "../entities";

type Props = {
  profileBlogposts: Blogpostprops[]
  profileBlogpostsLoading: boolean
  profileBlogpostsError: string,
  handleServerLoadMoreBlogposts: () => void
  moreBlogpostsLoading: boolean
  moreBlogpostsError: string
};


const Blogpostsec = ({
  profileBlogposts,
  profileBlogpostsLoading,
  profileBlogpostsError,
  handleServerLoadMoreBlogposts,
  moreBlogpostsLoading,
  moreBlogpostsError,
}: Props) => {

  return <div id="profile-blogpost-wrapper">
    {!profileBlogpostsLoading ?
      <>
        {profileBlogposts &&
          profileBlogposts.length ?
          <>
            {profileBlogposts.map((item, index) =>
             item.status === 'published' ?
              < Singleblogpost
                key={item._id}
                blogpost={item}
                type='text'
                index={index}
              /> : 
              null
            )}
            {!moreBlogpostsError.trim() &&
              <button onClick={handleServerLoadMoreBlogposts}>
                {
                  !moreBlogpostsLoading ?
                    'load more' :
                    'loading more blogposts'
                }
              </button>}
          </> :
          <div>no blog post</div>
        }
      </> :
      <div>loading blogpost...</div>}
  </div>
};

export default Blogpostsec;
