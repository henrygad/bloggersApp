import { useEffect, useState } from "react";
import { Imageprops, Blogpostprops, Commentprops, Userprops } from "../entities";
import { useFetchData } from "../hooks";
import Profilesec from "./Profilesec";

type Props = {
  data: Userprops
  loading: boolean
  error: string
  userName: string
};


const Addprofilesec = ({
  data: profileData,
  loading: profileLoading,
  error: profileError,
  userName
}: Props) => {

  const { // fetch total number of published blogposts
    data: totalNumberOfPublishedBlogposts,
    loading: totalNumberOfPublishedBlogpostsLoading
  } = useFetchData<Blogpostprops[]>(null);

  const { // fetch blogposts
    data: blogposts,
    loading: blogpostsLoading,
    error: blogpostsError,
  } = useFetchData<Blogpostprops[]>(`/api/blogposts/${userName}?skip=0&limit=5`, [userName]);

  const { // fetch total number of comments
    data: totalNumberOfUserComments,
    loading: totalNumberOfUserCommentsLoading
  } = useFetchData<Commentprops[]>(null);

  const { // fetch comments
    data: comments,
    loading: commentsLoading,
    error: commentsError,
  } = useFetchData<Commentprops[]>(`/api/usercomments/${userName}?skip=0&limit=5`, [userName]);

  const { // fetch total number of avater
    data: totalNumberOfUserAvaters,
    loading: totalNumberOfUserAvatersLoading
  } = useFetchData<Commentprops[]>(null);

  const { // fetch avaters
    data: avaters,
    loading: avatersLoading,
    error: avatersError,
  } = useFetchData<Imageprops[]>(`/api/images/${userName}?skip=0&limit=5`, [userName]);

  const [addBlogposts, setAddBlogposts] = useState<Blogpostprops[]>([]);
  const [addComments, setAddComments] = useState<Commentprops[]>([]);
  const [addAvaters, setAddAvaters] = useState<Imageprops[]>([]);

  const { fetchData: fetchMoreBlogpostsData, loading: loadingMoreBlogposts, error: errorMoreBlogposts } = useFetchData<Blogpostprops[]>(null);
  const { fetchData: fetchMoreCommentsData, loading: loadingMoreComments, error: errorMoreComments } = useFetchData<Commentprops[]>(null);
  const { fetchData: fetchMoreAvatersData, loading: loadingMoreAvaters, error: errorMoreAvaters } = useFetchData<Imageprops[]>(null);

  const handleServerLoadMoreBlogposts = async () => {// fetch more blogposts
    if (!blogposts?.length) return;

    await fetchMoreBlogpostsData(`/api/blogposts/${userName}?skip=${blogposts.length}&limit=5`)
      .then((res) => {
        const { data } = res;
        if (!data) return;

        setAddBlogposts((pre) => pre ? [...pre, ...data] : pre);
      });

  };

  const handleServerLoadMoreComments = async () => { // fetch more comments
    if (!comments?.length) return;

    await fetchMoreCommentsData(`/api/usercomments/${userName}?skip=${comments.length}&limit=5`)
      .then((res) => {
        const { data } = res;
        if (!data) return;

        setAddComments((pre) => pre ? [...pre, ...data] : pre);
      });
  };

  const handleServerLoadMoreAvaters = async () => {// fetch more avaters
    if (!avaters?.length) return;

    await fetchMoreAvatersData(`/api/images/${userName}?skip=${avaters.length}&limit=5`)
      .then((res) => {
        const { data } = res;
        if (!data) return;

        setAddAvaters((pre) => pre ? [...pre, ...data] : pre);
      });
  };

  useEffect(() => {
    if (blogposts) setAddBlogposts(blogposts);
    if (comments) setAddComments(comments);
    if (avaters) setAddAvaters(avaters);
  }, [
    blogposts,
    comments,
    avaters
  ]);


  return < Profilesec
    profileData={profileData}
    profileLoading={profileLoading}
    profileError={profileError}

    profileBlogposts={addBlogposts}
    profileBlogpostsLoading={blogpostsLoading}
    profileBlogpostsError={blogpostsError}
    handleServerLoadMoreBlogposts={handleServerLoadMoreBlogposts}
    moreBlogpostsLoading={loadingMoreBlogposts}
    moreBlogpostsError={errorMoreBlogposts}
    numberOfBlogposts={totalNumberOfPublishedBlogposts?.length || 0}
    numberOfBlogpostsLoading={totalNumberOfPublishedBlogpostsLoading}

    profileCommentsData={addComments}
    profileCommentsLoading={commentsLoading}
    profileCommentsError={commentsError}
    handleServerLoadMoreComments={handleServerLoadMoreComments}
    moreCommentsLoading={loadingMoreComments}
    moreCommentsError={errorMoreComments}
    numberOfComments={totalNumberOfUserComments?.length || 0}
    numberOfCommentsLoading={totalNumberOfUserCommentsLoading}

    profileAvatersData={addAvaters}
    profileAvatersLoading={avatersLoading}
    profileAvatersError={avatersError}
    handleServerLoadMoreAvaters={handleServerLoadMoreAvaters}
    moreAvatersLoading={loadingMoreAvaters}
    moreAvatersError={errorMoreAvaters}
    numberOfAvaters={totalNumberOfUserAvaters?.length || 0}
    numberOfAvatersLoading={totalNumberOfUserAvatersLoading}
  />

};

export default Addprofilesec;
