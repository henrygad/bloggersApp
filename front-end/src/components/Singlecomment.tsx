import { useEffect, useState } from "react";
import { useCopyLink, useDeleteData, useFetchData, useNotification, usePostData, useSanitize, useUserIsLogin } from "../hooks";
import Dotnav from "./Dotnav";
import UsershortInfor from "./UsershortInfor";
import Menu from "./Menu";
import Button from "./Button";
import { Commentprops } from "../entities";
import Likebutton from "./Likebutton";
import { addComment, decreaseTotalNumberOfUserComments, deleteComments, increaseTotalNumberOfUserComments } from "../redux/slices/userCommentsSlices";
import { useAppDispatch } from "../redux/slices";
import Trythistexteditor from "../custom-text-editor/App";
import { deleteAll } from "../custom-text-editor/settings";
import tw from "tailwind-styled-components";
import { MdBlock, MdOutlineChatBubbleOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { BsCopy } from "react-icons/bs";
import { TfiFlagAlt2 } from "react-icons/tfi";


type Props = {
  comment: Commentprops
  index?: number
  type?: string
  setDisplayParentComment?: React.Dispatch<React.SetStateAction<Commentprops[]>>

  autoOpenTargetComment: { autoOpen: boolean, commentId: string, commentAddress: string, targetLike: { autoOpen: boolean, commentId: string, like: string } }
};

const Singlecomment = ({
  type = 'text',
  comment,
  index,
  setDisplayParentComment = () => null,

  autoOpenTargetComment = { autoOpen: false, commentId: '', commentAddress: '', targetLike: { autoOpen: false, commentId: '', like: '' } },
}: Props) => {

  const { loginStatus: { loginUserName } } = useUserIsLogin();
  const { _id, blogpostId, parentId, body, authorUserName, parentUrl, likes, children, commentIsAReplyTo } = comment;

  const isAccountOwner = loginUserName === authorUserName; // is user comment

  const { fetchData: fetchChildCommentData, loading: loadingChildComment } = useFetchData<Commentprops[]>('');
  const { deleteData: deleteCommentData, loading: deleteCommentLoading } = useDeleteData();
  const [displayCommentChildren, setDisplayCommentChildren] = useState<Commentprops[]>([]);
  const [getChildCommentContent, setChildGetCommentContent] = useState<{ _html: string, text: string }>()

  const sanitizeHTML = useSanitize();
  const [toggleSideMenu, setToggleSideMenu] = useState('');
  const { copied, handleCopyLink } = useCopyLink(parentUrl + '/' + _id);

  const [toggleDisplayCommentInput, setToggleDisplayCommentInput] = useState(false);
  const [targetComment, setTargetComment] = useState('');

  const { postData: postReply, loading: loadingReplyComment } = usePostData();
  const appDispatch = useAppDispatch();

  const notify = useNotification();

  const generalMenu = [
    {
      name: 'copy comment link',
      to: '',
      content: <Button
        id="copy-comment-link"
        buttonClass="flex items-center gap-2"
        handleClick={() => handleCopyLink()}
        children={<>{copied ? <FaCheck color="green" size={20} /> : <BsCopy size={20} />} Copy</>}
      />
    },
   
  ];

  const intaracttionMenu = [
    ...generalMenu,
    {
        name: 'report',
        to: '',
        content: <Button
            id="report-content-btn"
            buttonClass="flex gap-2"
            children={<><TfiFlagAlt2 size={20} />  Report</>}
            handleClick={() => ''}
        />
    },
    {
        name: 'block',
        to: '',
        content: <Button
            id="report-content-btn"
            buttonClass="flex gap-2"
            children={<><MdBlock size={20} />  Block</>}
            handleClick={() => ''}
        />
    },
];

  const accountOnwerMenuForComment = [
    ...generalMenu,
    {
      name: 'delete',
      to: '',
      content: <Button
        id="share-blogpost-link"
        children={!deleteCommentLoading ? 'Delete' : 'delete loading...'}
        buttonClass="border-b"
        handleClick={() => { handleDeleteComment(comment._id) }}
      />
    },

  ];

  const clearReplyInputArea = () => {
    const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div on page
    contentEditAbleELe.forEach((element) => {
      deleteAll(element as HTMLDivElement)
    });
  };

  const handleChildCommentNotification = (childComment: Commentprops) => {
    const { commentIsAReplyTo, parentUrl, _id } = childComment;

    commentIsAReplyTo.map(async (userNameInvolve) => {
      if (loginUserName === userNameInvolve) return; // don't notify the commentor that he commented on his comment

      const url = '/api/notification/' + userNameInvolve;
      const newBody = {
        typeOfNotification: 'replyComment',
        msg: `replied to ${userNameInvolve === authorUserName ?
          'your' :
          `<span class="font-bold" >${authorUserName?.slice(1)}</span>`} 
                comment, <span class="underline">${body?.text}</span>`,
        url: parentUrl + '/' + _id,
        notifyFrom: loginUserName,
      };

      await notify(url, newBody);
    });
  };

  const handleAddReply = () => {
    if (!blogpostId) return;
    const url = '/api/addcomment';
    const body = {
      blogpostId,
      parentId: _id,
      parentUrl: parentUrl + "/" + _id,
      body: getChildCommentContent || { _html: '', text: '' },
      commentIsAReplyTo: [...commentIsAReplyTo, authorUserName]
    };

    postReply<Commentprops>(url, { ...body })
      .then((req) => {
        const { data } = req;

        if (data) {
          setDisplayParentComment((pre) => pre.map((item) => {
            if (item._id === data.parentId) {
              return { ...item, children: [...item.children, data._id] }
            } else {
              return item;
            };
          }));
          setToggleDisplayCommentInput(false);
          setDisplayCommentChildren((pre) => pre ? [data, ...pre] : pre);
          appDispatch(addComment(data));
          appDispatch(increaseTotalNumberOfUserComments(1));
          clearReplyInputArea();
          handleChildCommentNotification(data);
        };
      });
  };

  const handleDeleteComment = async (_id: string) => {
    if (!_id) return;
    const url = '/api/deletecomment/' + _id;
    const response = await deleteCommentData(url);
    const { data } = response;

    if (data) {
      if (parentId === 'null') {
        setDisplayParentComment((pre) => pre.filter((item) => item._id !== _id));
      } else {
        setDisplayCommentChildren((pre) => pre.filter((item) => item._id !== _id));
      }

      appDispatch(deleteComments({ _id }));
      appDispatch(decreaseTotalNumberOfUserComments(1));
    };
  };

  const handleLoadCommentChildren =
    async ({ blogpostId, commentId, limit }: { blogpostId: string, commentId: string, limit: number }) => {
      fetchChildCommentData(`/api/comments/blogpost/${blogpostId}?parentId=${commentId}&skip=${displayCommentChildren.length}&limit=${limit}`)
        .then((res) => {
          const { data } = res;
          if (data) {
            setDisplayCommentChildren((pre) => pre ? [...pre, ...data] : pre);
          }
        });
    };

  useEffect(() => {
    if (autoOpenTargetComment?.autoOpen) {
      const { commentAddress } = autoOpenTargetComment;
      setTargetComment(autoOpenTargetComment.commentId);

      if (commentAddress) {

        commentAddress.split('/')
          .map((addressId, index) => {
            if (addressId === _id) {

              if (loadingReplyComment) {
                return;
              };

              handleLoadCommentChildren({ blogpostId, commentId: _id, limit: 0 });
            };

          });

      };

      setTimeout(() => {
        setTargetComment(' ');
      }, 3000);

    };
  }, [autoOpenTargetComment, loadingReplyComment]);

  return <Singcommentwrapper id={'blogpost-comment-' + _id} className={_id === targetComment ? 'bg-red-50' : ' '}>
    <div className="relative">
      <Dotnav
        id="comments-nav"
        name={_id}
        toggleSideMenu={toggleSideMenu}
        setToggleSideMenu={setToggleSideMenu}
        children={
          <Menu
            id="MenuForComment"
            parentClass='absolute top-0 -right-2 min-w-[140px] max-w-[320px] backdrop-blur-sm p-3 rounded shadow-sm z-20 cursor-pointer space-y-4'
            childClass=""
            arrOfMenu={!isAccountOwner ?
              intaracttionMenu
              : accountOnwerMenuForComment}
          />
        }
      />
    </div>
    <UsershortInfor
      userName={authorUserName}
    />

    {type === 'text' ?
      <span className="block  text-base font-text first-letter:capitalize">{body?.text}</span> :
      <div dangerouslySetInnerHTML={sanitizeHTML(body?._html)} ></div>
    }
    <div id="comment-statistics" className="flex justify-start items-center gap-4">
      <Button
        id="reply-comment-btn"
        buttonClass="flex items-center gap-2"
        children={<> <MdOutlineChatBubbleOutline size={20} /> {children.length || 0}</>}
        handleClick={() => setToggleDisplayCommentInput(!toggleDisplayCommentInput)}
      />
      <Likebutton
        parentId={_id}
        arrOfLikes={likes}
        apiForLike={'/api/likecomment/' + _id}
        apiForUnlike={'/api/unlikecomment/' + _id}

        autoOpenTargetLike={autoOpenTargetComment.targetLike}

        notificationTitle={body.text}
        userNameToNotify={authorUserName}
        notificationUrl={parentUrl + '/' + _id}
        liking="commentLike"
      />
    </div>
    {toggleDisplayCommentInput ?
      <div id="comment-text-area-wrapper" className="flex flex-col gap-4 justify-center p-2">
        <Trythistexteditor
          id='comment-text-editor'
          placeHolder={`Reply ${isAccountOwner ? 'to your comment' : authorUserName}...`}
          InputWrapperClassName="w-full max-h-[140px] border-2 p-3 rounded-md  overflow-y-auto"
          InputClassName=""
          createNewText={{ IsNew: true }}
          useTextEditors={false}
          inputTextAreaFocus={toggleDisplayCommentInput}
          setGetContent={setChildGetCommentContent}
        />
        <div id="comment-btn" className="flex justify-center">
          <Button
            id="create-comment"
            buttonClass="font-simibold bg-green-800 rounded-md py-2 px-4 border border-green-400 shadow active:bg-green-400 transition-color"
            children={!loadingReplyComment ? 'Reply' : 'loading...'}
            handleClick={() => handleAddReply()}
          />
        </div>
      </div> :
      null}


    {/*  if there is a children, perform nested children comment */}

    <div id={`${_id}-comment-children`}>
      <div className="border-l border-l-gray-400">
        {!loadingChildComment ?
          <>{
            displayCommentChildren &&
              displayCommentChildren.length ?
              displayCommentChildren.map((item, index) =>
                <Singlecomment
                  key={item._id}
                  index={index}
                  type="text"
                  comment={item}

                  autoOpenTargetComment={autoOpenTargetComment}
                />
              ) :
              null
          }</> :
          <div>loading...</div>
        }
      </div>
      <div className="flex items-center justify-center mt-6">
        <Button
          id="view-comment-btn"
          buttonClass="text-slate-500"
          children={"View" + " " + "(" + children.length + ")"}
          handleClick={() => handleLoadCommentChildren({ blogpostId, commentId: _id, limit: 5 })}
        />
      </div>
    </div>
  </Singcommentwrapper>
};

export default Singlecomment;

const Singcommentwrapper = tw.div`
w-full 
space-y-4
px-3 
py-4 
`
