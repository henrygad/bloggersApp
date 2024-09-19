import { useEffect, useRef, useState } from "react";
import { Advaterprops, Blogpostprops, Commentprops, Userprops } from "../entities";
import { useFetchData } from "../hooks";
import Profilesec from "./Profilesec";


const Othersprofilesec = ({ userName }: { userName: string }) => {

  const {
    data: getOthersProfile,
    loading: getOthersProfileLoading,
    error: getOthersProfileError,
  } = useFetchData<Userprops>(`/api/users/${userName}`, [userName]);

  const {
    data: getOthersBlogposts,
    loading: getOthersBlogpostsLoading,
    error: getOthersBlogpostsError,
  } = useFetchData<Blogpostprops[]>(`/api/blogposts/${userName}?skip=0&limit=5`, [userName]);

  const {
    data: getOthersComments,
    loading: getOthersCommentsLoading,
    error: getOthersCommentsError,
  } = useFetchData<Commentprops[]>(`/api/usercomments/${userName}?skip=0&limit=5`, [userName])

  const {
    data: getOthersAdvaters,
    loading: getOthersAdvatersLoading,
    error: getOthersAdvatersError,
  } = useFetchData<Advaterprops[]>(`/api/images/${userName}?skip=0&limit=5`, [userName])

  const [othersBlogposts, setOthersBlogposts] = useState<Blogpostprops[] | null>(null);
  const countLoadMoreBlogpostsRef = useRef(5);

  const [othersComments, setOthersComments] = useState<Commentprops[] | null>(null);
  const countLoadMoreCommentsRef = useRef(6);

  const [othersAdvaters, setOthersAdvaters] = useState<Advaterprops[] | null>(null);
  const countLoadMoreAdvatersRef = useRef(5);

  // load more data

  const { fetchData: fetchMoreBlogpostsData, loading: loadingMoreBlogposts, error: errorMoreBlogposts } = useFetchData(null)
  const { fetchData: fetchMoreCommentsData, loading: loadingMoreComments, error: errorMoreComments } = useFetchData(null)
  const { fetchData: fetchMoreAdvatersData, loading: loadingMoreAdvaters, error: errorMoreAdvaters } = useFetchData(null)

  const handleServerLoadMoreBlogposts = async () => {
    await fetchMoreBlogpostsData(`/api/blogposts/${userName}?skip=${countLoadMoreBlogpostsRef.current}&limit=${countLoadMoreBlogpostsRef.current}`);
    countLoadMoreBlogpostsRef.current += countLoadMoreBlogpostsRef.current;
  };

  const handleServerLoadMoreComments = async () => {
    await fetchMoreCommentsData(`/api/usercomments/${userName}?skip=${countLoadMoreCommentsRef.current}&limit=5`);
    countLoadMoreCommentsRef.current += countLoadMoreCommentsRef.current;
  };

  const handleServerLoadMoreAdvaters = async () => {
    await fetchMoreAdvatersData(`/api/images/${userName}?skip=${countLoadMoreAdvatersRef.current}&limit=${countLoadMoreAdvatersRef.current}`);
    countLoadMoreAdvatersRef.current += countLoadMoreAdvatersRef.current;
  };

  useEffect(() => {
    if (!getOthersBlogposts) return;
    setOthersBlogposts(getOthersBlogposts);
    if (!getOthersComments) return;
    setOthersComments(getOthersComments);
    if (!getOthersAdvaters) return;
    setOthersAdvaters(getOthersAdvaters);
  }, [getOthersBlogposts, getOthersComments, getOthersAdvaters]);


  return < Profilesec
    profileData={getOthersProfile as Userprops}
    profileLoading={getOthersProfileLoading}
    profileError={getOthersProfileError}

    profileBlogposts={othersBlogposts as Blogpostprops[]}
    profileBlogpostsLoading={getOthersBlogpostsLoading}
    profileBlogpostsError={getOthersBlogpostsError}
    handleServerLoadMoreBlogposts={handleServerLoadMoreBlogposts}
    moreBlogpostsLoading={loadingMoreBlogposts}
    moreBlogpostsError={errorMoreBlogposts}

    profileCommentsData={othersComments as Commentprops[]}
    profileCommentsLoading={getOthersCommentsLoading}
    profileCommentsError={getOthersCommentsError}
    handleServerLoadMoreComments={handleServerLoadMoreComments}
    moreCommentsLoading={loadingMoreComments}
    moreCommentsError={errorMoreComments}

    profileAdvatersData={othersAdvaters as Advaterprops[]}
    profileAdvatersLoading={getOthersAdvatersLoading}
    profileAdvatersError={getOthersAdvatersError}
    handleServerLoadMoreAdvaters={handleServerLoadMoreAdvaters}
    moreAdvatersLoading={loadingMoreAdvaters}
    moreAdvatersError={errorMoreAdvaters}
  />
};

export default Othersprofilesec;
