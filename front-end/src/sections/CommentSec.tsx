import { useEffect } from "react";
import { Button, LandLoading, Usercomment } from "../components";
import { Commentprops } from "../entities";
import { useScrollPercent } from "../hooks";


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

  const { scrollPercent } = useScrollPercent();

  const handleAutoLoadMoreComments = () => {
    if (scrollPercent === 100 &&
      !moreCommentsLoading
    ) {
      if (numberOfComments !== profileCommentsData.length) {
        handleServerLoadMoreComments();
      };
    };

  };

  useEffect(() => {
    handleAutoLoadMoreComments();
  }, [scrollPercent]);

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
                <LandLoading loading={moreCommentsLoading} />
              </> :
              null
          }
        </> :
        <div>loading comment...</div>
    }
  </div>
}

export default CommentSec
