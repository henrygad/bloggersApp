import { useLocation, useParams } from "react-router-dom";
import { Singleblogpost } from "../components";
import { useFetchData } from "../hooks";
import { Blogpostprops, Commentprops, Searchresultprops } from "../entities";
import { useEffect, useState } from "react";

const Singleblogpostpage = () => {
  const { authorUserName, slug } = useParams();
  const { state } = useLocation();

  const commentNotification = state?.commentNotification;
  const targetCommentLike = commentNotification?.targetCommentLike;

  const blogpostLikeNotification = state?.blogpostLikeNotification;

  const blogpostUrl = authorUserName + '/' + slug;
  if (!blogpostUrl) return;

  // get single blogpost
  const { data: singleBlogpostData, loading: loaidngSinglgeBlogpost, error: singleBlogpostError, } =
    useFetchData<Blogpostprops>('/api/blogpost/' + blogpostUrl, [blogpostUrl]);

  // for targeting a specific comment / comment like or blogpost like data
  const { data: notificationComment, loading: loadingNotificationComment } =
    useFetchData<Commentprops>(commentNotification?.autoOpenComment ? '/api/comments/' + commentNotification?.parentCommentId : '', [commentNotification?.parentCommentId]);

  // for fetching similar blogpost with the same catigory or title
  const { fetchData: fetchSimilarBlogpost, loading: loadingSimilarBlogposts } = useFetchData<Searchresultprops>();
  const { fetchData: fetchMoreSimilarBlogpost, loading: loadingMoreSimilarBlogposts } = useFetchData<Searchresultprops>();
  const [similarBlogposts, setSimilarBlogposts] = useState<Blogpostprops[]>();

  const handleFetchSimilarBlogposts = async () => { // func to handle similar blogpost
    if (singleBlogpostData) {
      fetchSimilarBlogpost(`/api/search?body=${singleBlogpostData.title}&catigory=${singleBlogpostData.catigory}&skip=0&limit=10`)
        .then((res) => {
          const { data } = res;
          if (data) {
            const { blogpostSearchResult } = data;
            setSimilarBlogposts(blogpostSearchResult);
          };
        });
    };
  };

  const handleSeeMoreSimilarBlogpost = async () => {
    if (!singleBlogpostData || !similarBlogposts) return;
    fetchMoreSimilarBlogpost(`/api/search?body=${singleBlogpostData.title}&catigory=${singleBlogpostData.catigory}&skip=${similarBlogposts.length}&limit=10`)
      .then((res) => {
        const { data } = res;
        if (data) {
          const { blogpostSearchResult } = data;
          setSimilarBlogposts((pre) => pre ? { ...pre, ...blogpostSearchResult } : pre);
        };
      });
  };

  useEffect(() => {
    handleFetchSimilarBlogposts();
  }, [singleBlogpostData]);

  return <div>
    {!(loaidngSinglgeBlogpost || loadingNotificationComment) ?
      <div id="display-single-blogpost-wrapper">
        <>
          {singleBlogpostError.trim() ?
            <div id="not-found-blogpost">error, blogpost not found</div> :
            <>
              {singleBlogpostData &&
                singleBlogpostData.status === 'published' ?
                <Singleblogpost
                  blogpost={singleBlogpostData}
                  type="html"
                  index={0}

                  autoOpenTargetComment={{
                    autoOpen: commentNotification?.autoOpenComment,
                    commentId: commentNotification?.commentId,
                    commentAddress: commentNotification?.commentAddress,
                    comment: notificationComment,
                    blogpostId: singleBlogpostData?._id,
                    targetLike: {
                      autoOpen: targetCommentLike?.autoOpenCommentLike,
                      commentId: targetCommentLike?.likeCommentId,
                      like: targetCommentLike?.commentlike
                    }
                  }}

                  autoOpenTargetBlogpostLike={{
                    autoOpen: blogpostLikeNotification?.autoOpenBlogpostLike,
                    blogpostId: singleBlogpostData?._id,
                    like: blogpostLikeNotification?.blogpostlike
                  }}
                /> :
                <div>blogpost has been brought down by the author</div>
              }
            </>
          }
        </>
        <div id="similar-blogpost-sec">
          {!loadingSimilarBlogposts ?
            <>

              {
                similarBlogposts &&
                  similarBlogposts.length ?
                  <>
                    <span>Similar Blogpost</span>
                    <div>
                      <div>
                        {similarBlogposts &&
                          similarBlogposts.map((item, index) =>
                            item._id === singleBlogpostData?._id ?
                              null :

                              <Singleblogpost
                                key={item._id}
                                type={'text'}
                                index={index}
                                blogpost={item}
                              />
                          )
                        }
                        <span className="" onClick={handleSeeMoreSimilarBlogpost}>see more</span>
                      </div>
                    </div>
                  </> :
                  null
              }
            </> :
            null
          }

        </div>
      </div> :
      <div>loading single blogpost...</div>
    }
  </div>
};

export default Singleblogpostpage;

