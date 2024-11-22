import { Button, SingleImage } from "../components";
import { Imageprops } from "../entities";
import { useFetchData, useImageGalary, useUserIsLogin } from "../hooks";
import { useAppDispatch, useAppSelector } from "../redux/slices";
import { fetchBlogpostImages } from "../redux/slices/userImageSlices";

const Displayblogpostimagessec = ({ selection = false }: { selection?: boolean }) => {
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

    const { imageGalary, setImageGalary } = useImageGalary();

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

    const handleSelectImage = (_id: string) => {
        if (_id) {
            if (imageGalary.selectedImages.includes(_id)) {
                setImageGalary((pre) => pre ? { ...pre, selectedImages: pre.selectedImages.filter(item => item !== _id) } : pre);
            } else {
                setImageGalary((pre) => pre ? { ...pre, selectedImages: [...pre.selectedImages, _id] } : pre);
            };
        };
    };

    return <div id="blogpost-images">
        {
            !blogpostImagesLoading ?
                <>{
                    blogpostImages &&
                        blogpostImages.length ?
                        <>{
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 " >
                                {blogpostImages.map((item, index) =>
                                    <div className="relative" key={item._id}>
                                        {selection ?
                                            <span id="select-image-btn"
                                                className={`absolute top-1 left-1 h-4 w-4 ${imageGalary.selectedImages.includes(item._id) ?
                                                    'bg-green-400' :
                                                    'bg-gray-50'} rounded-full border-2 border-white z-20 cursor-pointer` }
                                                onClick={() => handleSelectImage(item._id)} >
                                            </span> :
                                            null
                                        }
                                        <SingleImage                                    
                                            image={item}
                                            index={index}
                                            placeHolder=""
                                        />
                                    </div>
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
                        null
                }</> :
                <div>loading...</div>
        }
    </div>
};

export default Displayblogpostimagessec;
