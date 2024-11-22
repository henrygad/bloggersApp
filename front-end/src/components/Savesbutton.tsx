import { useEffect, useState } from "react";
import Button from "./Button";
import { usePatchData } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { Blogpostprops } from "../entities";
import { saveBlogposts, unSaveBlogpost } from "../redux/slices/userBlogpostSlices";
import { addBlogpostIdToSaves, deleteBlogpostIdFromSaves } from "../redux/slices/userProfileSlices";
import { IoSaveOutline } from "react-icons/io5"


const Savesbutton = ({ saves, blogpost }: { saves: string[], blogpost: Blogpostprops }) => {
    const [isSaved, setIsSaved] = useState(saves.includes(blogpost._id));
    const { patchData, loading: loadingSaves } = usePatchData();
    const dispatch = useAppDispatch();

    useEffect(() => {
       setIsSaved(saves.includes(blogpost._id))
    }, [saves]);

    const handleSaves = async (_id: string) => {
        if (isSaved) return;

        await patchData<{ _id: string }>('/api/profile/saves/add', { _id })
            .then((response) => {
                const { data, ok } = response;
                if (data) {
                    dispatch(addBlogpostIdToSaves({_id}));
                    dispatch(saveBlogposts(blogpost));
                };
            });
    };

    const handleUnSave = async (_id: string) => {
        if (!isSaved) return;

        await patchData('/api/profile/saves/delete', { _id })
            .then((response) => {
                const { data, ok } = response;
                if (data) {
                    dispatch(deleteBlogpostIdFromSaves({_id}));
                    dispatch(unSaveBlogpost({_id}));
                };
            });
    };

    return <Button
        id={'saves-btn'}
        buttonClass={'flex gap-2'}
        children={<><IoSaveOutline color={`${isSaved? 'green' : ''}`} size={20} /> Save</>}
        handleClick={() => { isSaved ? handleUnSave(blogpost._id) : handleSaves(blogpost._id) }}
    />
};

export default Savesbutton;
