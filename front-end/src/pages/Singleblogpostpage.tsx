import { useParams } from "react-router-dom";
import { Singleblogpost } from "../components";
import { useFetchData } from "../hooks";
import { Blogpostprops } from "../entities";

const Singleblogpostpage = () => {
  const { authorUserName, slug } = useParams();
  const blogpostUrl = authorUserName + '/' + slug;
  if (!blogpostUrl) return;
  const { data: singleBlogpostData, loading: loaidngSinglgeBlogpost } = useFetchData<Blogpostprops>('/api/blogposts/' + blogpostUrl, [blogpostUrl]);
  
  return <div>
    {
      !loaidngSinglgeBlogpost ?
        <>

          {singleBlogpostData &&
            Object.keys(singleBlogpostData) &&
            (singleBlogpostData.status === 'published' || singleBlogpostData.status === 'republished') ?
            <Singleblogpost
              blogpost={singleBlogpostData}
              type="html"
              index={0}
            /> :
            <div>blogpost has been brought down by the author</div>
          }
        </> :
        <div>loading single blogpost</div>
    }

  </div>
};

export default Singleblogpostpage;

