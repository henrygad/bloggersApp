import { useDeleteData, useUserIsLogin } from "../hooks";
import Input from "./Input";

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
    const { deleteData, loading: loadingDeletSearchHistory } = useDeleteData<{ _id: string, searched: string }[]>();

    const handleDeleteSearchHistory = async (_id: string) => {
        if (!settings) return
        await deleteData('/api/search/delete/history/' + _id).then((response) => {
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
        <span className="cursor-pointer" onClick={() => { !settings && setGetSearchInput(history.searched) }} >{history.searched}</span>

        <span className="cursor-pointer" >
            {!settings ?
                <span onClick={() => setGetSearchInput(history.searched)} >/</span> :
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
                        <span onClick={() => handleDeleteSearchHistory(history._id)} >{!loadingDeletSearchHistory ? 'Delete' : 'loaidng...'}</span>
                    }
                </>
            }
        </span>

    </div>
};

export default Singlesearchhistory;
