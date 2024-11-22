import { useNavigate } from "react-router-dom";
import { Blogpostprops } from "../entities";
import { useAppSelector } from "../redux/slices";


const Drafts = () => {
    const { userProfile: { data: profileData, loading: loadingProfile } } = useAppSelector((state) => state.userProfileSlices);
    const navigate = useNavigate();

    const handleKeepEditing = (item: Blogpostprops) =>{
        navigate('/createpost', { state: { edit: true, data: item } });
        console.log(item)
    };

    return <div>
        {!loadingProfile ?
            <div>
                {profileData &&
                    profileData.drafts &&
                    profileData.drafts.length ?
                    <div id="archived-blogpost-wrapper">
                        {profileData.drafts
                            .map((item, index) =>
                                <article key={item._id} className="flex flex-col gap-3">
                                    <span>{item.title}</span>
                                    <span>{item.body}</span>
                                    <button className="border p-1 rounded-sm" onClick={()=>handleKeepEditing(item)}>
                                        keep editing
                                    </button>
                                </article>
                            )}
                    </div> :
                    <div id="no-draft-found">no draft</div>
                }
            </div> :
            <div id="loading-draft">loading....</div>
        }
    </div>
};

export default Drafts;
