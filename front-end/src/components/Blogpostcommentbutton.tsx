import { useEffect, useRef, useState } from "react";
import { Commentprops } from "../entities"
import Button from "./Button";
import Dialog from "./Dialog";
import Trythistexteditor from "../custom-text-editor/Trythistexteditor";
import { useDeleteData, useFetchData, usePostData } from "../hooks";
import { deleteAllText } from "../custom-text-editor/text-area/Config";
import { useAppDispatch } from "../redux/slices";
import { createComment, deleteComments } from "../redux/slices/userCommentsSlices";
import Singlecomment from "./Singlecomment";

type Props = {
    arrOfcomment: Commentprops[]
    loadingComment: boolean
    blogpostId: string
    blogpostAuthorUserName: string
    blogpostUrl: string
}

const Blogpostcomment = ({ arrOfcomment, blogpostId, loadingComment, blogpostAuthorUserName, blogpostUrl }: Props) => {
    const { fetchData: fetchSeeMoreCommentData, loading: loadingMoreComment } = useFetchData<Commentprops[]>(null);
    const seeMoreBlogpostRef = useRef(2);
    const [displayCommentData, setDisplayCommentData] = useState<Commentprops[] | null>(null);

    const [replying, setReplying] = useState<string[] | null>(null);
    const [parentId, setParentId] = useState<string | null>(null);
    const [getCommentContent, setGetCommentContent] = useState<{ _html: string, text: string } | undefined>(undefined);
    const { postData, loading: postCommentLoading } = usePostData();
    const { deleteData: deleteCommentData, loading: deleteCommentLoading } = useDeleteData();
    const appDispatch = useAppDispatch();

    const [toggleDialog, setToggleDialog] = useState('');
    const [toggleListOfComments, setToggleListOfComments] = useState(false);

    const handleAddComment = async (comment: {
        blogpostId: string,
        parentId: string | null,
        url: string,
        body: { _html: string, text: string },
        commentIsAReplyTo: string[]
    }) => {

        if (comment.blogpostId.trim() === ' ') return;
        const url = '/api/addcomment';
        const body = comment;
        const response = await postData<Commentprops>(url, { ...body });
        const { ok, data } = response;

        if (ok &&
            data) {
            const contentEditAbleELe = document.querySelectorAll("[contenteditable]");  //Get all contenteditable div
            contentEditAbleELe.forEach((element) =>
                deleteAllText(element as HTMLDivElement)
            );


            if (data.parentId) {
                setDisplayCommentData((pre) => pre ? displayChildrenCommentRecursively(pre, response.data) : pre);
            } else {
                setDisplayCommentData((pre) => pre ? [response.data, ...pre] : pre);
            };

            setReplying(null);
            setParentId(null);
            appDispatch(createComment(data));

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
            appDispatch(deleteComments(comment._id));
            setReplying(null);
            setParentId(null);

            if (comment.parentId) {
                setDisplayCommentData((pre) => pre ? deleteChildrenCommentRecursively(pre, comment) : pre);
            } else {
                setDisplayCommentData((pre) => pre ? pre.filter((item) => item._id !== comment._id) : pre);
            };
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
        const { data, ok } = await fetchSeeMoreCommentData(`/api/blogpostcommentsandnestedcomments/${blogpostId}?skip=${seeMoreBlogpostRef.current}&limit=2`);
        if (ok && data) {
            setDisplayCommentData((pre) => pre ? [...pre, ...data] : pre);
            seeMoreBlogpostRef.current += 2;
        };
    };

    useEffect(() => {
        setDisplayCommentData(arrOfcomment);
    }, [arrOfcomment]);

    return <div>
        <div>
            <Button
                id='comment-btn'
                children={<>
                    Comment:
                    <span className="bg-blue-300 p-1" onClick={(e) => { { setToggleDialog('blogpostcommentsdialog'); setToggleListOfComments(true); e.stopPropagation() } }}>
                        {displayCommentData ? displayCommentData.length : 0}
                    </span>
                </>}
                buttonClass="text-sm border px-1 rounded-md"
                handleClick={() => { setToggleListOfComments(false); setToggleDialog('blogpostcommentsdialog') }}
            />
        </div>
        <div className="comment-dialog">
            <Dialog
                id="blogpost-comments-dialog"
                currentDialog="blogpostcommentsdialog"
                parentClass="flex justify-center"
                childClass={`
                    w-full min-w-[280px] sm:min-w-[320px] max-w-[768px] 
                    ${toggleListOfComments ? 'overflow-y-scroll max-h-screen pb-[200px]' : ''}
                ` }
                dialog={toggleDialog}
                setDialog={() => { setToggleDialog(' '); setReplying(null); setParentId(null); }}
                children={
                    <>
                        {toggleListOfComments ?
                            <div className="flex flex-col items-center pt-2">
                                <span>{displayCommentData ? displayCommentData.length : 0}: comments</span>
                                <>
                                    {!loadingComment ?
                                        <>
                                            {displayCommentData &&
                                                displayCommentData.length ?
                                                <>
                                                    <div>
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
                                                                    handleDeleteComment={handleDeleteComment}
                                                                    blogpostId={blogpostId}
                                                                    deletingLoading={deleteCommentLoading}
                                                                />
                                                            )
                                                        }
                                                    </div>
                                                    <span className="cursor-pointer" onClick={handleLoadMoreComments} >
                                                        {!loadingMoreComment ? 'load more' : 'loading...'}
                                                    </span>
                                                </> :
                                                <div>be the first to comment</div>
                                            }
                                        </> :
                                        <div>loading...</div>
                                    }
                                </>
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
                                    editorParentWrapperStyle="w-full"
                                    textAreaStyle="text-base py-3 pl-5 pr-3 border-2 rounded-3xl"
                                    placeHolder="Comment..."
                                    setGetContent={setGetCommentContent}
                                    textAreaConfig={{ addNew: true, body: '' }}
                                    toolBarConfig={{
                                        useToolBar: false,
                                    }}
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
                                        url: blogpostUrl + '/#comments-section/' + Date.now(),
                                        body: getCommentContent ? getCommentContent : { _html: '', text: '' },
                                        commentIsAReplyTo: replying ? replying : [blogpostAuthorUserName],
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

export default Blogpostcomment;
