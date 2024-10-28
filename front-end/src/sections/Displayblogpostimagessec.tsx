import { Button, SingleImage } from "../components";
import { Imageprops } from "../entities";
import { useFetchData, useUserIsLogin } from "../hooks";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { fetchBlogpostImages } from "../redux/slices/userImageSlices";

const Displayblogpostimagessec = () => {

    const { loginStatus: { loginUserName } } = useUserIsLogin();

    const { userBlogpostimage: {
        data: blogpostImages,
        loading: blogpostImagesLoading,
        error: blogpostImagesError,
    } } = useAppSelector(state => state.userImageSlices);

    const {
        fetchData: fetchMoreBlogpostImagesData,
        loading: loadingMoreBlogpostImages,
        error: errorMoreBlogpostImages } = useFetchData<Imageprops[]>(null);
    const appDispatch = useAppDispatch();


    const handleServerLoadMoreAvaters = async () => { // load more avater
        if (!blogpostImages.length) return;

        await fetchMoreBlogpostImagesData(`/api/images/${loginUserName}?fieldname=blogpostimage&skip=${blogpostImages.length}&limit=5`)
            .then((res) => {
                const { data } = res;
                if (!data) return;

                appDispatch(fetchBlogpostImages({
                    data: [...blogpostImages, ...data],
                    loading: false,
                    error: ''
                }));
            });
    };


    return <div id="profile-advater">
        {
            !blogpostImagesLoading ?
                <>{
                    blogpostImages &&
                        blogpostImages.length ?
                        <>{
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 " >
                                {blogpostImages.map((item, index) =>
                                    <SingleImage
                                        key={item._id || index}
                                        image={item}
                                        index={index}
                                        placeHolder=""
                                    />
                                )}
                            </div>
                        }
                            <Button
                                id="load-more-advater"
                                children={!loadingMoreBlogpostImages ? 'load more' : 'loading...'}
                                buttonClass=" "
                                handleClick={handleServerLoadMoreAvaters}
                            />
                        </> :
                        <div>no advater</div>
                }</> :
                <div>advater loading...</div>
        }
    </div>
};

export default Displayblogpostimagessec;
