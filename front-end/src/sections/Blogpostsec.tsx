import { useEffect } from "react";
import { LandLoading, Singleblogpost } from "../components";
import { Blogpostprops } from "../entities";
import { useScrollPercent } from "../hooks";

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
  const { scrollPercent } = useScrollPercent();

  const handleAutoLoadMoreBlogposts = () => {
    if (scrollPercent === 100 &&
      !moreBlogpostsLoading
    ) {
      if (numberOfBlogposts !== profileBlogposts.length) {
        handleServerLoadMoreBlogposts();
      };
    };

  };

  useEffect(() => {
    handleAutoLoadMoreBlogposts();
  }, [scrollPercent]);

  return <div>
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
            <LandLoading loading={moreBlogpostsLoading} />
          </> :
          null
        }
      </> :
      <div id="loading-blogpost">loading blogpost...</div>}
  </div>
};

export default Blogpostsec;
