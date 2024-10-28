import { Button, Singlecomment } from "../components";
import { Commentprops } from "../entities";
import { useDeleteData } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { decreaseTotalNumberOfUserComments, deleteComments } from "../redux/slices/userCommentsSlices";


type Props = {
  profileCommentsData: Commentprops[]
  profileCommentsLoading: boolean
  profileCommentsError: string
  handleServerLoadMoreComments: () => void
  moreCommentsLoading: boolean
  moreCommentsError: string
  numberOfComments: number

};

const CommentSec = ({
  profileCommentsData,
  profileCommentsLoading,
  profileCommentsError,
  handleServerLoadMoreComments,
  moreCommentsLoading,
  moreCommentsError,
  numberOfComments,
}: Props) => {

  const { deleteData: deleteCommentData, loading: deleteCommentLoading } = useDeleteData();
  const appDispatch = useAppDispatch();

  const handleDeleteComment = async (_id: string) => {
    const url = '/api/deletecomment';
    const response = await deleteCommentData(url + "/" + _id);

    if (response.ok) {
      appDispatch(deleteComments({ _id }));
      appDispatch(decreaseTotalNumberOfUserComments(1));
    };
  };

  return <div>
    {
      !profileCommentsLoading ?
        <>
          {
            profileCommentsData &&
              profileCommentsData.length ?
              <>{
                profileCommentsData.map((item, index) =>
                  <Singlecomment
                    key={item._id}
                    comment={item}
                    type={'_html'}
                    index={index}
                    handleDeleteComment={() => handleDeleteComment(item._id)}
                    deletingLoading={deleteCommentLoading}
                    allowNested={false}
                    autoOpenTargetComment={{
                      autoOpen: false,
                      commentId: '',
                      commentAddress: '',
                      targetLike: {
                        autoOpen: false,
                        commentId: '',
                        like: '',
                      }
                    }
                    }
                  />
                )
              }
                {numberOfComments !== profileCommentsData.length ?
                  <Button
                    id="loading-more-comment"
                    buttonClass=""
                    children={!moreCommentsLoading ? 'load more' : 'loading...'}
                    handleClick={handleServerLoadMoreComments}
                  /> :
                  null
                }
              </> :
              <div>no comments yet</div>
          }
        </> :

        <div>loading comment...</div>
    }
  </div>
}

export default CommentSec
