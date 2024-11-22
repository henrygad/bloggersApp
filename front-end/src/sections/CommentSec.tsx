import { Button, Usercomment } from "../components";
import { Commentprops } from "../entities";


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


  return <div>
    {
      !profileCommentsLoading ?
        <>
          {
            profileCommentsData &&
              profileCommentsData.length ?
              <>{
                profileCommentsData.map((item, index) =>
                  <Usercomment
                    key={item._id}
                    comment={item}
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
