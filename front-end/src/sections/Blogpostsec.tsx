import { Singleblogpost } from "../components";
import { Blogpostprops } from "../entities";

type Props = {
  profileBlogposts: Blogpostprops[]
  profileBlogpostsLoading: boolean
  profileBlogpostsError: string,
  handleServerLoadMoreBlogposts: () => void
  moreBlogpostsLoading: boolean
  moreBlogpostsError: string
  numberOfBlogposts: number
};


const Blogpostsec = ({
  profileBlogposts,
  profileBlogpostsLoading,
  profileBlogpostsError,
  handleServerLoadMoreBlogposts,
  moreBlogpostsLoading,
  moreBlogpostsError,
  numberOfBlogposts,
}: Props) => {

  return <div id="profile-blogpost-wrapper">
    {!profileBlogpostsLoading ?
      <div>
        {profileBlogposts &&
          profileBlogposts.length ?
          <div id="display-blogpost">
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
            {numberOfBlogposts !== profileBlogposts.length ?
              <button onClick={handleServerLoadMoreBlogposts}>
                {
                  !moreBlogpostsLoading ?
                    'load more' :
                    'loading...'
                }
              </button> :
              null
            }
          </div> :
          <div id="no-blogpost-found">no blog post</div>
        }
      </div> :
      <div id="loading-blogpost">loading blogpost...</div>}
  </div>
};

export default Blogpostsec;
