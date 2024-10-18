import { useEffect, useState } from "react";
import Button from "./Button";
import { usePatchData } from "../hooks";
import { useAppDispatch } from "../redux/slices";
import { createSaves, deleteSaves } from "../redux/slices/userSavesSlices";
import { saveId, unSaveId } from "../redux/slices/userProfileSlices";
import { Blogpostprops } from "../entities";

const Savesbutton = ({ saves, blogpost }: { saves: string[], blogpost: Blogpostprops }) => {
    const [isSaved, setIsSaved] = useState(saves.includes(blogpost._id));
    const { patchData, loading: loadingSaves } = usePatchData<{ _id: string }>();
    const dispatch = useAppDispatch();

    useEffect(() => {
       setIsSaved(saves.includes(blogpost._id))
    }, [saves]);

    const handleSaves = async (_id: string) => {
        if (isSaved) return;

        await patchData('/api/profile/saves/add', { _id })
            .then((response) => {
                const { data, ok } = response;
                if (data) {
                    dispatch(createSaves(blogpost));
                    dispatch(saveId(_id));
                };
            });
    };

    const handleUnSave = async (_id: string) => {
        if (!isSaved) return;

        await patchData('/api/profile/saves/delete', { _id })
            .then((response) => {
                const { data, ok } = response;
                if (data) {
                    dispatch(deleteSaves(_id));
                    dispatch(unSaveId(_id));
                };
            });
    };

    return <Button
        id={'svaes-btn'}
        buttonClass={'border-b'}
        children={!loadingSaves ?
            (isSaved ? 'unSave' : 'Save') :
            'loading...'
        }
        handleClick={() => { isSaved ? handleUnSave(blogpost._id) : handleSaves(blogpost._id) }}
    />
};

export default Savesbutton;
