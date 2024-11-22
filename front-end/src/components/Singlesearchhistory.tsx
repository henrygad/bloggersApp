import { useDeleteData, useUserIsLogin } from "../hooks";
import Button from "./Button";
import Input from "./Input";
import { FaHistory } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md";

type Props = {
    history: { _id: string, searched: string }
    settings?: boolean
    selectMultipleSelections?: boolean
    setGetSearchInput: React.Dispatch<React.SetStateAction<string>>
    multipleSearchHistorySelection: string[]
    setMultipleSearchHistorySelection: React.Dispatch<React.SetStateAction<string[]>>
}

const Singlesearchhistory = ({
    history,
    settings = false,
    setGetSearchInput,
    selectMultipleSelections = false,
    multipleSearchHistorySelection,
    setMultipleSearchHistorySelection,
}: Props) => {

    const { setLoginStatus } = useUserIsLogin();
    const { deleteData, loading: loadingDeletSearchHistory } = useDeleteData();

    const handleDeleteSearchHistory = async (_id: string) => {
        if (!settings) return
        await deleteData<{ _id: string, searched: string }[]>('/api/search/delete/history/' + _id)
            .then((response) => {
                const { data } = response
                console.log(data)
                if (data) {
                    setLoginStatus((pre) => pre ? { ...pre, searchHistory: data } : pre)
                }
            });
    };

    const handleAddOrRemoveSelection = (_id: string) => {
        setMultipleSearchHistorySelection((pre) => pre.includes(_id) ?
            [...pre.filter(item => item !== _id)] :
            [...pre, _id])
    };

    return <div className="flex justify-between items-center gap-6">
        <Button
            id="return-black"
            buttonClass=""
            children={history.searched}
            handleClick={() => !settings && setGetSearchInput(history.searched)}
        />
        <span className="cursor-pointer" >
            {!settings ?
                <Button
                    id="return-black"
                    buttonClass=""
                    children={< FaHistory size={14} />}
                    handleClick={() => setGetSearchInput(history.searched)}
                /> :
                <>
                    {selectMultipleSelections ?
                        <Input
                            id="search-history-radio"
                            type="radio"
                            value=""
                            setValue={() => { }}
                            checked={multipleSearchHistorySelection.includes(history._id)}
                            onClick={() => handleAddOrRemoveSelection(history._id)}
                        /> :
                        <Button
                            id="return-black"
                            buttonClass=""
                            children={<MdDeleteOutline size={20} />}
                            handleClick={() => handleDeleteSearchHistory(history._id)}
                        />
                    }
                </>
            }
        </span>

    </div>
};

export default Singlesearchhistory;
