import { useAppDispatch, useAppSelector } from "../redux/slices";
import Profilesec from "./Profilesec";
import { useFetchData, useUserIsLogin } from "../hooks";
import { Imageprops, Blogpostprops, Commentprops, Userprops } from "../entities";
import { fetchPublishedBlogposts } from "../redux/slices/userBlogpostSlices";
import { fetchComments } from "../redux/slices/userCommentsSlices";
import { fetchAvaters } from "../redux/slices/userImageSlices";

type Props = {
  data: Userprops
  loading: boolean
  error: string
};

const Ownerprofilesec = ({
  data: profileData,
  loading: profileLoading,
  error: profileError, }: Props) => {

    const { loginStatus: { loginUserName } } = useUserIsLogin();

  const { totalNumberOfPublishedBlogposts: { // get total number of published blogposts
    data: totalNumberOfPublishedBlogposts,
    loading: totalNumberOfPublishedBlogpostsLoading
  } } = useAppSelector(state => state.userBlogpostSlices);

  const { publishedBlogposts: { // get blogposts
    data: blogposts,
    error: blogpostsError,
    loading: blogpostsLoading }
  } = useAppSelector((state) => state.userBlogpostSlices);

  const { totalNumberOfUserComments: { // get total number of published comments
    data: totalNumberOfUserComments,
    loading: totalNumberOfUserCommentsLoading
  } } = useAppSelector(state => state.userCommentsSlices);

  const { userComments: { // get comments
    data: comments,
    loading: commentsLoading,
    error: commentsError,
  } } = useAppSelector((state) => state.userCommentsSlices);

  const { totalNumberOfUserAvaters: { // get total number of published comments
    data: totalNumberOfUserAvaters,
    loading: totalNumberOfUserAvatersLoading
  } } = useAppSelector(state => state.userImageSlices);

  const { userAvaters: { // get avaters
    data: avaters,
    loading: avaterLoading,
    error: avaterError,
  } } = useAppSelector((state) => state.userImageSlices);

  const { fetchData: fetchMoreBlogpostData, loading: loadingMoreBlogpost, error: errorMoreBlogpost } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchMoreCommentsData, loading: loadingMoreComments, error: errorMoreComments } = useFetchData<Commentprops[]>(null);
  const { fetchData: fetchMoreAdvaterData, loading: loadingMoreAdvater, error: errorMoreAdvater } = useFetchData<Imageprops[]>(null);

  const appDispatch = useAppDispatch();

  const handleServerLoadMoreBlogposts = async () => { // load more blogposts
    if (!blogposts.length) return;

    await fetchMoreBlogpostData(`/api/blogposts/${loginUserName}?status=published&skip=${blogposts.length}&limit=5`)
      .then((res) => {
        const { data } = res;
        if (!data) return;

        appDispatch(fetchPublishedBlogposts({
          data: [...blogposts, ...data],
          loading: false,
          error: '',
        }));

      });
  };

  const handleServerLoadMoreComments = async () => { // load more comments
    if (!comments.length) return;

    await fetchMoreCommentsData(`/api/usercomments/${loginUserName}?skip=${comments.length}&limit=5`)
      .then((res) => {
        const { data } = res;
        if (!data) return;

        appDispatch(fetchComments({
          data: [ ...comments, ...data],
          loading: false,
          error: ''
        }));
      });
  };

  const handleServerLoadMoreAvaters = async () => { // load more avater
    if (!avaters.length) return;

    await fetchMoreAdvaterData(`/api/images/${loginUserName}?fieldname=avater&skip=${avaters.length}&limit=5`)
      .then((res) => {
        const { data } = res;
        if (!data) return;

        appDispatch(fetchAvaters({
          data: [...avaters, ...data],
          loading: false,
          error: ''
        }));
      });
  };

  return <Profilesec

    profileData={profileData}
    profileLoading={profileLoading}
    profileError={profileError}

    profileBlogposts={blogposts}
    profileBlogpostsLoading={blogpostsLoading}
    profileBlogpostsError={blogpostsError}
    handleServerLoadMoreBlogposts={handleServerLoadMoreBlogposts}
    moreBlogpostsLoading={loadingMoreBlogpost}
    moreBlogpostsError={errorMoreBlogpost}
    numberOfBlogposts={totalNumberOfPublishedBlogposts}
    numberOfBlogpostsLoading={totalNumberOfPublishedBlogpostsLoading}

    profileCommentsData={comments}
    profileCommentsLoading={commentsLoading}
    profileCommentsError={commentsError}
    handleServerLoadMoreComments={handleServerLoadMoreComments}
    moreCommentsLoading={loadingMoreComments}
    moreCommentsError={errorMoreComments}
    numberOfComments={totalNumberOfUserComments}
    numberOfCommentsLoading={totalNumberOfUserCommentsLoading}

    profileAvatersData={avaters}
    profileAvatersLoading={avaterLoading}
    profileAvatersError={avaterError}
    handleServerLoadMoreAvaters={handleServerLoadMoreAvaters}
    moreAvatersLoading={loadingMoreAdvater}
    moreAvatersError={errorMoreAdvater}
    numberOfAvaters={totalNumberOfUserAvaters}
    numberOfAvatersLoading={totalNumberOfUserAvatersLoading}

  />
};

export default Ownerprofilesec;
