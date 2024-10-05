import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import Profilesec from "./Profilesec";
import { useFetchData } from "../hooks";
import { addBlogposts } from "../redux/slices/userBlogpostSlices";
import { Advaterprops, Blogpostprops, Commentprops } from "../entities";
import { addComments } from "../redux/slices/userCommentsSlices";
import { addAdvaters } from "../redux/slices/userAdvatersSlices";

const Ownerprofilesec = ({ loginUserName }: { loginUserName: string }) => {

  const { userProfile: {
    data: ownerProfileData,
    loading: ownerProfileDataLoading,
    error: ownerProfileDataError
  } } = useAppSelector((state) => state.userProfileSlices);

  const { userBlogposts: {
    data: ownerBlogposts,
    error: ownerBlogpostsError,
    loading: ownerBlogpostsLoading }
  } = useAppSelector((state) => state.userBlogpostSlices);

  const { userComments: {
    data: ownerComments,
    loading: ownerCommentsLoading,
    error: ownerCommentsError,
  } } = useAppSelector((state) => state.userCommentsSlices);

  const { userAdvaters: {
    data: ownerAdvaters,
    loading: ownerAdvaterLoading,
    error: ownerAdvaterError,
  } } = useAppSelector((state) => state.userAdvatersSlices);

  const { fetchData: fetchMoreBlogpostData, loading: loadingMoreBlogpost, error: errorMoreBlogpost } = useFetchData<Blogpostprops[]>(null);
  const countLoadMoreBlogpostsRef = useRef(5);

  const { fetchData: fetchMoreCommentsData, loading: loadingMoreComments, error: errorMoreComments } = useFetchData<Commentprops[]>(null);
  const countLoadMoreCommentsRef = useRef(6);

  const { fetchData: fetchMoreAdvaterData, loading: loadingMoreAdvater, error: errorMoreAdvater } = useFetchData<Advaterprops[]>(null);
  const counLoadMoreAdvaterRef = useRef(5);

  const appDispatch = useAppDispatch();

  const handleServerLoadMoreBlogposts = async () => {
    const { data, ok } = await fetchMoreBlogpostData(`/api/blogposts/${loginUserName}?skip=${countLoadMoreBlogpostsRef.current}&limit=${countLoadMoreBlogpostsRef.current}`);
    if (!ok || !data) return;
    appDispatch(addBlogposts({ data: [...ownerBlogposts, ...data], loading: false, error: '' }));
    countLoadMoreBlogpostsRef.current += countLoadMoreBlogpostsRef.current;
  };

  const handleServerLoadMoreComments = async () => {
    const { data, ok } = await fetchMoreCommentsData(`/api/usercomments/${loginUserName}?skip=${countLoadMoreCommentsRef.current}&limit=5`);
    if (!ok || !data) return;
    appDispatch(addComments({ data: [...ownerComments, ...data], loading: false, error: '' }));
    countLoadMoreCommentsRef.current += countLoadMoreCommentsRef.current;
  };

  const handleServerLoadMoreAdvaters = async () => {
    const { data, ok } = await fetchMoreAdvaterData(`/api/images/${loginUserName}?skip=${counLoadMoreAdvaterRef.current}&limit=${counLoadMoreAdvaterRef.current}`);
    if (!ok || !data) return;
    appDispatch(addAdvaters({ data: [...ownerAdvaters, ...data], loading: false, error: '' }));
    counLoadMoreAdvaterRef.current += counLoadMoreAdvaterRef.current;
  };

  return <Profilesec

    profileLoading={ownerProfileDataLoading}
    profileError={ownerProfileDataError}
    profileData={ownerProfileData}

    profileBlogposts={ownerBlogposts}
    profileBlogpostsLoading={ownerBlogpostsLoading}
    profileBlogpostsError={ownerBlogpostsError}
    handleServerLoadMoreBlogposts={handleServerLoadMoreBlogposts}
    moreBlogpostsLoading={loadingMoreBlogpost}
    moreBlogpostsError={errorMoreBlogpost}

    profileCommentsData={ownerComments}
    profileCommentsLoading={ownerCommentsLoading}
    profileCommentsError={ownerCommentsError}
    handleServerLoadMoreComments={handleServerLoadMoreComments}
    moreCommentsLoading={loadingMoreComments}
    moreCommentsError={errorMoreComments}

    profileAdvatersData={ownerAdvaters}
    profileAdvatersLoading={ownerAdvaterLoading}
    profileAdvatersError={ownerAdvaterError}
    handleServerLoadMoreAdvaters={handleServerLoadMoreAdvaters}
    moreAdvatersLoading={loadingMoreAdvater}
    moreAdvatersError={errorMoreAdvater}

  />
};

export default Ownerprofilesec;
