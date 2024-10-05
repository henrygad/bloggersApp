import { useEffect, useState } from "react";
import { useCopyLink, useSanitize, useUserIsLogin } from "../hooks";
import Dotnav from "./Dotnav";
import UsershortInfor from "./UsershortInfor";
import Menu from "./Menu";
import Button from "./Button";
import { Commentprops } from "../entities";
import Likebutton from "./Likebutton";

type Props = {
  comment: Commentprops
  index?: number
  type?: string
  allowNested: boolean
  handleDeleteComment: (comment: Commentprops) => void
  deletingLoading: boolean

  setParentId?: React.Dispatch<React.SetStateAction<string | null>>
  setReplying?: React.Dispatch<React.SetStateAction<string[] | null>>
  setParentComment?: React.Dispatch<React.SetStateAction<Commentprops | null>>

  autoOpenTargetComment: { autoOpen: boolean, commentId: string, commentAddress: string, targetLike: { autoOpen: boolean, commentId: string, like: string } }
};

const Singlecomment = ({
  comment,
  type = 'text',
  deletingLoading,
  allowNested = true,

  setParentId = () => null,
  setReplying = () => null,
  setParentComment = () => null,
  handleDeleteComment = (comment: Commentprops) => null,

  autoOpenTargetComment = { autoOpen: false, commentId: '', commentAddress: '', targetLike: { autoOpen: false, commentId: '', like: '' } },
}: Props) => {
  const { _id, body, authorUserName, parentUrl, likes, children, commentIsAReplyTo } = comment;

  const { loginStatus: { loginUserName } } = useUserIsLogin();
  const isAccountOwner = loginUserName === authorUserName;
  const sanitizeHTML = useSanitize();
  const [toggleSideMenu, setToggleSideMenu] = useState('');
  const { copied, handleCopyLink } = useCopyLink(parentUrl + '/' + _id);

  const [seeMore, setSeeMore] = useState(0);
  const [targetComment, setCommentTarget] = useState(' ');

  const generalMenuForComment = [
    {
      name: 'copy link',
      to: '',
      content: <Button
        id="copy-comment-link"
        children={<>
          Copy link {copied ? <span className="text-green-500">Copied</span> : null}
        </>}
        buttonClass="border-b"
        handleClick={() => handleCopyLink()}
      />
    },
  ];

  const accountOnwerMenuForComment = [
    ...generalMenuForComment,
    {
      name: 'delete',
      to: '',
      content: <Button
        id="share-blogpost-link"
        children={!deletingLoading ? 'Delete' : 'delete loading...'}
        buttonClass="border-b"
        handleClick={() => { handleDeleteComment(comment) }}
      />
    },

  ];

  const handeCreateReply = () => {
    setParentId(_id);
    setReplying(
      commentIsAReplyTo.includes(authorUserName) ?
        commentIsAReplyTo :
        [...commentIsAReplyTo, authorUserName]
    );
    setParentComment(comment);
    
    handleSeeMoreComment([_id], children?.length);
  };

  const handleSeeMoreComment = (commentId: string[], seeMore: number) => {
    if (commentId.includes(_id)) {
      setSeeMore(seeMore);
    } else {
      setSeeMore(0);
    };
  };

  useEffect(() => {
    if (autoOpenTargetComment?.autoOpen &&
      autoOpenTargetComment?.commentAddress
    ) {
      const getCommentAddress: string[] = [];
      const commentAddress = autoOpenTargetComment.commentAddress.split('&');
      commentAddress.map((item, index) => {
        getCommentAddress.push(item);
        handleSeeMoreComment(getCommentAddress, children?.length);

        if (index === (commentAddress.length - 1)) {
          setTimeout(() => {
            setCommentTarget(' ');
          }, 2000);
        };
      });
    }

    setCommentTarget(
      autoOpenTargetComment?.autoOpen ?
        autoOpenTargetComment?.commentId :
        '');

  }, [
    autoOpenTargetComment?.autoOpen,
    autoOpenTargetComment?.commentAddress
  ]);

  return <div
    id={'blogpost-comment-' + _id}
    className={`relative w-full min-w-[280px] sm:min-w-[320px] md:min-w-[480px] max-w-[480xp] rounded-md px-3 py-4 space-y- 2 
      ${_id === targetComment ? 'bg-red-50' : ''}
    `}>
    <Dotnav
      id="commentsNav"
      name={_id}
      toggleSideMenu={toggleSideMenu}
      setToggleSideMenu={setToggleSideMenu}
      children={
        <Menu
          arrOfMenu={!isAccountOwner ?
            generalMenuForComment
            : accountOnwerMenuForComment}
          id="MenuForComment"
          parentClass='flex-col gap-2 absolute top-0 -right-2 min-w-[140px] max-w-[320px] backdrop-blur-sm p-3 rounded shadow-sm z-20 cursor-pointer'
          childClass=""
        />
      }
    />
    <UsershortInfor
      userName={authorUserName}
    />
    {type === 'text' ?
      <span className="block  text-base font-text first-letter:capitalize">{body?.text}</span> :
      <div dangerouslySetInnerHTML={sanitizeHTML(body?._html)} ></div>}
    <div id="comment-statistics" className="flex justify-center items-center gap-4">
      <span
        id="reply-comment"
        className="cursor-pointer"
        onClick={handeCreateReply} >
        reply : {children ? children.length : 0}
      </span>
      <Likebutton
        parentId={_id}
        arrOfLikes={likes}
        apiForLike={'/api/likecomment/' + _id}
        apiForUnlike={'/api/unlikecomment/' + _id}

        autoOpenTargetLike={autoOpenTargetComment.targetLike}

        notificationTitle={body.text}
        userNameToNotify={authorUserName}
        notificationUrl={parentUrl + '&' + _id}
        liking="commentLike"
      />
    </div>

    {/*  if there is a children, recursive Singlecomment function component */}
    <>
      {allowNested &&
        children &&
        children.length ?
        <div id={_id}>
          <div className="ml-1 border-l">
            {
              children.map((item, index) => {
                if (index === seeMore) {
                  return;
                } else {
                  return <Singlecomment
                    key={item._id || index}
                    type="text"
                    comment={item}
                    index={index}
                    allowNested={allowNested}
                    setParentId={setParentId}
                    setReplying={setReplying}
                    setParentComment={setParentComment}
                    handleDeleteComment={handleDeleteComment}
                    deletingLoading={deletingLoading}

                    autoOpenTargetComment={autoOpenTargetComment}
                  />
                }
              })
            }
          </div>

          <div className="flex items-center justify-center">
            {(children.length - seeMore) > 0 ?
              <span className="cursor-pointer" onClick={() => handleSeeMoreComment([_id], children.length)}>{
                'View' + ' ' + (children.length) + ' ' + 'replies'
              }</span> :

              <span className="cursor-pointer" onClick={() => setSeeMore(0)}>close replies</span>
            }
          </div>
        </div> :
        null
      }
    </>
  </div>
};

export default Singlecomment;
