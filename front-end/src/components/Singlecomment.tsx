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
  blogpostId?: string
  setParentId?: React.Dispatch<React.SetStateAction<string | null>>
  setReplying?: React.Dispatch<React.SetStateAction<string[] | null>>
  handleDeleteComment: (comment: Commentprops) => void
  deletingLoading: boolean
};


const Singlecomment = ({
  comment,
  type = 'text',
  setReplying = () => null,
  handleDeleteComment = (comment) => null,
  deletingLoading,
  allowNested = true,
  blogpostId,
  setParentId = () => null,
}: Props) => {

  const { _id, body, authorUserName, url, likes, children, commentIsAReplyTo } = comment;

  const { loginStatus: { loginUserName } } = useUserIsLogin();
  const isAccountOwner = loginUserName === authorUserName;
  const sanitizeHTML = useSanitize();
  const [toggleSideMenu, setToggleSideMenu] = useState('');
  const { copied, handleCopyLink } = useCopyLink(url);
  const [seeMoreReplies, setSeeMoreReplies] = useState(0);

  const generalMenuForComment = [
    {
      name: 'share',
      to: '',
      content: <Button
        id="share-blogpost-link"
        children={'share'}
        buttonClass="border-b"
        handleClick={() => handleShareComment('', '')}
      />
    },
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

  const handleShareComment = (whatToShare: string, PlaceToShareDataTo: string) => {
    console.log('shared');
  };

  const handleSeeReplies = () => {
    const totalChildrenComment = children.length;

    if (seeMoreReplies >= totalChildrenComment) return;
    if (totalChildrenComment < 2) {
      setSeeMoreReplies(totalChildrenComment);
    };

    setSeeMoreReplies((pre) => pre += 2);
  };


  return <div className={`relative w-full min-w-[280px] sm:min-w-[320px] md:min-w-[480px] max-w-[480xp] rounded-md px-3 py-4 space-y-2`}>
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
      <span className="cursor-pointer" onClick={() => {
        setParentId(_id); setReplying(
          commentIsAReplyTo.includes(authorUserName) ?
            commentIsAReplyTo :
            [...commentIsAReplyTo, authorUserName]
        )
      }} >
        reply : {children ? children.length : 0}
      </span>
      <Likebutton
        arrOfLikes={likes}
        apiForLike={'/api/likecomment/' + _id}
        apiForUnlike={'/api/unlikecomment/' + _id}
      />
      <Button
        id="share-comment-btn"
        children={'Share: 4'}
        buttonClass="border-b"
        handleClick={() => handleShareComment(_id, 'facebook')}
      />
    </div>

    {/*  if there is a children, recursive Singlecomment function component */}
    <>
      {allowNested &&
        children &&
        children.length ?
        <div className=" ml-2 border-l">
          {children.map((item, index) => {
            if (index < seeMoreReplies) {
              return <Singlecomment
                key={item._id || index}
                type="text"
                comment={item}
                index={index}
                setParentId={setParentId}
                setReplying={setReplying}
                blogpostId={blogpostId}
                handleDeleteComment={handleDeleteComment}
                deletingLoading={deletingLoading}
                allowNested={allowNested}
              />
            } else {
              return;
            }

          }
          )}
          <div className="flex items-center justify-center">
            {(children.length - seeMoreReplies) > 0 ?
              <span className="cursor-pointer" onClick={handleSeeReplies}>{
                'View' + ' ' + (children.length - seeMoreReplies) + ' ' + 'replies'
              }</span> :

              <span className="cursor-pointer" onClick={() => setSeeMoreReplies(0)}>close replies</span>
            }
          </div>
        </div> :
        null
      }
    </>
  </div>
};

export default Singlecomment;
