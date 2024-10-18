import { Button, Singlecomment } from "../components";
import { Commentprops } from "../entities";
import { useDeleteData } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { deleteComments } from "../redux/slices/userCommentsSlices";


type Props = {
  profileCommentsData: Commentprops[]
  profileCommentsLoading: boolean
  profileCommentsError: string
  handleServerLoadMoreComments: () => void
  moreCommentsLoading: boolean
  moreCommentsError: string

};

const CommentSec = ({
  profileCommentsData,
  profileCommentsLoading,
  profileCommentsError,
  handleServerLoadMoreComments,
  moreCommentsLoading,
  moreCommentsError,
}: Props) => {

  const { deleteData: deleteCommentData, loading: deleteCommentLoading } = useDeleteData();
  const appDispatch = useAppDispatch();

  const handleDeleteComment = async (_id: string) => {
    const url = '/api/deletecomment';
    const response = await deleteCommentData(url + "/" + _id);

    if (response.ok) {
      appDispatch(deleteComments(_id));
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
                  />
                )
              }
                <Button

                  id="loading-more-comment"
                  buttonClass=""
                  children={!moreCommentsLoading ? 'load more' : 'loading more...'}
                  handleClick={handleServerLoadMoreComments}
                />
              </> :
              <div>no comments yet</div>
          }
        </> :

        <div>loading comment...</div>
    }
  </div>
}

export default CommentSec
