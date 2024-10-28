import { useEffect, useRef, useState } from "react";
import { Commentprops } from "../entities"
import Button from "./Button";
import Dialog from "./Dialog";
import Trythistexteditor from "../custom-text-editor/App";
import { useDeleteData, useFetchData, useNotification, usePostData, useUserIsLogin } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { addComment, decreaseTotalNumberOfUserComments, deleteComments, increaseTotalNumberOfUserComments } from "../redux/slices/userCommentsSlices";
import Singlecomment from "./Singlecomment";
import { deleteAll } from "../custom-text-editor/settings";

type Props = {
    arrOfcomment: Commentprops[]
    loadingComment: boolean

    blogpostId: string
    blogpostAuthorUserName: string
    blogpostUrl: string
    blogpostTitle: string

    autoOpenTargetComment?: { autoOpen: boolean, commentId: string, commentAddress: string, comment: Commentprops | null, blogpostId: string, targetLike: { autoOpen: boolean, commentId: string, like: string } }
}

const Commentbutton = ({
    arrOfcomment,
    loadingComment,

    blogpostId,
    blogpostAuthorUserName,
    blogpostTitle,
    blogpostUrl,

    autoOpenTargetComment = { autoOpen: false, commentId: '', commentAddress: '', comment: null, blogpostId: '', targetLike: { autoOpen: false, commentId: '', like: '' } },
}: Props) => {

    const { loginStatus: { loginUserName } } = useUserIsLogin()

    const { fetchData: fetchSeeMoreCommentData, loading: loadingMoreComment } = useFetchData<Commentprops[]>(null);
    const [displayCommentData, setDisplayCommentData] = useState<Commentprops[]>([]);

    const [getCommentContent, setGetCommentContent] = useState<{ _html: string, text: string } | null>(null);
    const [parentComment, setParentCpmment] = useState<Commentprops | null>(null);
    const [replying, setReplying] = useState<string[] | null>([]);
    const [parentId, setParentId] = useState<string | null>(null);

    const { postData, loading: postCommentLoading } = usePostData();
    const { deleteData: deleteCommentData, loading: deleteCommentLoading } = useDeleteData();
    const appDispatch = useAppDispatch();

    const notify = useNotification();

    const [toggleCommentDialog, setToggleCommentDialog] = useState(' ');
    const [toggleListOfComments, setToggleListOfComments] = useState(false);

    const clearInputArea = () => {
        const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div on page
        contentEditAbleELe.forEach((element) => {
            deleteAll(element as HTMLDivElement)
        });
    };

    const handleAddComment = async (comment: {
        blogpostId: string,
        parentId: string | null,
        parentUrl: string,
        body: { _html: string, text: string },
        commentIsAReplyTo: string[]
    }) => {

        if (!comment.blogpostId.trim()) return;

        const url = '/api/addcomment';
        const body = comment;
        const response = await postData<Commentprops>(url, { ...body });
        const { ok, data } = response;

        if (data) {

            if (parentId) {
                setDisplayCommentData((pre) => pre ? displayChildrenCommentRecursively(pre, data) : pre);
            } else {
                setDisplayCommentData((pre) => pre ? [data, ...pre] : pre);
            };

            setReplying(null)
            setParentId(null);
            appDispatch(addComment(data));
            clearInputArea();
            appDispatch(increaseTotalNumberOfUserComments(1));

            handleNotification(data?.parentId || '', data);
        };
    };

    const displayChildrenCommentRecursively = (arrData: Commentprops[], data: Commentprops): Commentprops[] => {
        return [...arrData.map(item => {
            if (item._id === data.parentId ||
                (item.children && item.children.length)
            ) {
                if (item._id === data.parentId) {
                    return { ...item, children: [data, ...item.children] };
                } else {
                    return { ...item, children: displayChildrenCommentRecursively(item.children, data) };
                }
            } else {
                return item;
            }
        })];
    };

    const handleDeleteComment = async (comment: Commentprops) => {
        if (!comment._id) return;
        const url = '/api/deletecomment';
        const response = await deleteCommentData(url + "/" + comment._id);

        if (response.ok) {
            appDispatch(deleteComments({ _id: comment._id }));
            setReplying(null);
            setParentId(null);

            if (comment.parentId) {
                setDisplayCommentData((pre) => pre ? deleteChildrenCommentRecursively(pre, comment) : pre);
            } else {
                setDisplayCommentData((pre) => pre ? pre.filter((item) => item._id !== comment._id) : pre);
            };

            appDispatch(decreaseTotalNumberOfUserComments(1));
        };
    };

    const deleteChildrenCommentRecursively = (arrData: Commentprops[], data: Commentprops): Commentprops[] => {
        return [...arrData.map(item => {
            if (item._id === data.parentId ||
                (item.children && item.children.length)
            ) {
                if (item._id === data.parentId) {
                    return { ...item, children: item.children.filter((item) => item._id !== data._id) };
                } else {
                    return { ...item, children: deleteChildrenCommentRecursively(item.children, data) };
                }
            } else {
                return item;
            }
        })];
    };

    const handleLoadMoreComments = async () => {
        await fetchSeeMoreCommentData(`/api/blogpostcommentsandnestedcomments/${blogpostId}?skip=${displayCommentData.length}&limit=5`)
            .then((res) => {
                const { data } = res;
                if (data) {
                    setDisplayCommentData((pre) => pre ? [...pre, ...data] : pre);
                };
            });
    };

    const handleNotification = async (parentId: string, comment: Commentprops) => {
        const { commentIsAReplyTo, authorUserName, parentUrl, _id } = comment;

        if (parentId) { // for notifying all users involve in this comment

            commentIsAReplyTo.map(async (item) => {
                const isCommentAuthor = authorUserName === item;
                if (isCommentAuthor) return;

                const url = '/api/notification/' + item;
                const body = {
                    typeOfNotification: 'replyComment',
                    msg: `replied to ${item === parentComment?.authorUserName ?
                        'your' :
                        `<span class="font-bold" >${parentComment?.authorUserName?.slice(1)}</span>`
                        } comment, <span class="underline">${parentComment?.body.text}</span>`,
                    url: parentUrl + '&' + _id,
                    notifyFrom: loginUserName,
                };

                await notify(url, body);
            });

        } else { // for notifying just the author of the bloppost

            const isCommentAuthor = authorUserName === blogpostAuthorUserName;
            if (isCommentAuthor) return;

            const url = '/api/notification/' + blogpostAuthorUserName;
            const body = {
                typeOfNotification: 'blogpostComment',
                msg: `commmented on your post, <span class="underline">${blogpostTitle}</span>`,
                url: parentUrl + '&' + _id,
                notifyFrom: loginUserName,
            };

            await notify(url, body);
        };

    };

    useEffect(() => {
        setDisplayCommentData(
            autoOpenTargetComment?.autoOpen &&
                autoOpenTargetComment?.comment ?
                [autoOpenTargetComment.comment, ...arrOfcomment.filter(item => item._id !== autoOpenTargetComment.comment?._id)] :
                arrOfcomment
        );
    }, [
        arrOfcomment,
        autoOpenTargetComment?.autoOpen,
        autoOpenTargetComment.blogpostId,
    ]);

    useEffect(() => {
        setTimeout(() => {
            setToggleCommentDialog(autoOpenTargetComment?.autoOpen ? autoOpenTargetComment.blogpostId : '');
            setToggleListOfComments(autoOpenTargetComment?.autoOpen ? true : false);
        }, 1000);
    }, [
        autoOpenTargetComment?.autoOpen,
        autoOpenTargetComment.blogpostId,
    ]);
   


    return <div>
        <div>
            <Button
                id='comment-btn'
                children={<>
                    Comment:
                    <span className="bg-blue-300 p-1"
                        onClick={(e) => { { setToggleCommentDialog(blogpostId); setToggleListOfComments(true); e.stopPropagation() } }}
                    >
                        {displayCommentData ? displayCommentData.length : 0}
                    </span>
                </>}
                buttonClass="text-sm border px-1 rounded-md"
                handleClick={() => { setToggleListOfComments(false); setToggleCommentDialog(blogpostId) }}
            />
        </div>
        <div className="comment-dialog">
            <Dialog
                id="blogpost-comments-dialog"
                currentDialog={blogpostId}
                parentClass="flex justify-center"
                childClass={`
                    w-full min-w-[280px] sm:min-w-[320px] max-w-[768px] 
                    ${toggleListOfComments ? 'overflow-y-scroll max-h-screen pb-[200px]' : ''}
                ` }
                dialog={toggleCommentDialog}
                setDialog={() => { setToggleCommentDialog(' '); setReplying(null); setParentId(null); }}
                children={
                    <>
                        {toggleListOfComments ?
                            <div className="flex flex-col items-center pt-2">
                                <span id="comment-title">
                                    {displayCommentData ? displayCommentData.length : 0}: comments
                                </span>
                                <div id="display-comments-wrapper">
                                    {!loadingComment ?
                                        <div id="list-comments">
                                            {displayCommentData &&
                                                displayCommentData.length ?
                                                <>
                                                    {
                                                        displayCommentData.map((item, index) =>
                                                            <Singlecomment
                                                                key={index}
                                                                index={index}
                                                                type="text"
                                                                allowNested={true}
                                                                comment={item}
                                                                setParentId={setParentId}
                                                                setReplying={setReplying}
                                                                setParentComment={setParentCpmment}
                                                                handleDeleteComment={handleDeleteComment}
                                                                deletingLoading={deleteCommentLoading}

                                                                autoOpenTargetComment={autoOpenTargetComment}
                                                            />
                                                        )
                                                    }
                                                    <span className="cursor-pointer" onClick={handleLoadMoreComments} >
                                                        {!loadingMoreComment ? 'load more' : 'loading...'}
                                                    </span>
                                                </> :
                                                <div id="comment-not-found">be the first to comment</div>
                                            }
                                        </div> :
                                        <div id="loaidng-comment">loading...</div>
                                    }
                                </div>
                            </div> :
                            null
                        }
                        <div id="comment-textarea-wrapper" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-full h-[180px] max-w-[280px] sm:max-w-[320px] md:max-w-[420px] space-y-4 p-4 z-50">
                            <div className="space-y-2">
                                {replying &&
                                    <span className="block text-[.8rem] px-4 ">
                                        Replying to
                                        <span className="text-blue-500 space-x-1 ml-1">
                                            {replying.map(item => <span key={item}>{item}</span>)}
                                        </span>
                                    </span>
                                }
                                <Trythistexteditor
                                    id='comment-text-editor'
                                    placeHolder="Reply..."
                                    InputWrapperClassName="border-2 p-3 rounded-full"
                                    InputClassName=""
                                    createNewText={{ IsNew: true }}
                                    useTextEditors={false}
                                    inputTextAreaFocus={true}
                                    setGetContent={setGetCommentContent}
                                />
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    id="create-comment"
                                    children={!postCommentLoading ? 'Add comment' : 'loading...'}
                                    buttonClass=" bg-green-400 py-2 px-4"
                                    handleClick={() => handleAddComment({
                                        blogpostId: blogpostId,
                                        parentId: parentId || null,
                                        parentUrl: parentComment?.parentUrl ? (parentComment.parentUrl + '&' + parentComment._id) : blogpostUrl,
                                        body: getCommentContent || { _html: '', text: '' },
                                        commentIsAReplyTo: replying || [blogpostAuthorUserName],
                                    })}
                                />
                            </div>
                        </div>
                    </>
                }
            />
        </div>
    </div>
};

export default Commentbutton;
