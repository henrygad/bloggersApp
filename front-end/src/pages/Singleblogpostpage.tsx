import { useLocation, useParams } from "react-router-dom";
import { Singleblogpost } from "../components";
import { useFetchData } from "../hooks";
import { Blogpostprops, Commentprops } from "../entities";

const Singleblogpostpage = () => {
  const { authorUserName, slug } = useParams();
  const { state } = useLocation();

  const commentNotification = state?.commentNotification;
  const targetCommentLike = commentNotification?.targetCommentLike;

  const blogpostLikeNotification = state?.blogpostLikeNotification;

  const blogpostUrl = authorUserName + '/' + slug;
  if (!blogpostUrl) return;

  // get single blogpost
  const { data: singleBlogpostData, loading: loaidngSinglgeBlogpost } = useFetchData<Blogpostprops>('/api/blogposts/' + blogpostUrl, [blogpostUrl]);

  // for targeting a specific comment / comment like or blogpost like data
  const { data: notificationComment, loading: loadingNotificationComment } = useFetchData<Commentprops>(commentNotification?.autoOpenComment ? '/api/comments/' + commentNotification?.parentCommentId : null, [commentNotification?.parentCommentId]);

  return <div>
    <>
      {
        !loaidngSinglgeBlogpost && !loadingNotificationComment ?
          <>
            {singleBlogpostData &&
              Object.keys(singleBlogpostData) &&
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
          </> :
          <div>loading single blogpost...</div>
      }
    </>
  </div>
};

export default Singleblogpostpage;

