import { useRef, useState } from "react";
import { Searchicon } from "./Icons";
import { useClickOutSide, useDeleteData, useUserIsLogin } from "../hooks";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Tab from "./Tab";
import Input from "./Input";
import Singlesearchhistory from "./Singlesearchhistory";

const Searchform = () => {
    const { loginStatus: { searchHistory }, setLoginStatus } = useUserIsLogin();
    const [getSearchInput, setGetSearchInput] = useState('');
    const [multipleSearchHistorySelection, setMultipleSearchHistorySelection] = useState<string[]>([]);
    const { deleteData, loading: loadingMultipleDeletes } = useDeleteData();
    const navigate = useNavigate();

    const formWrapperRef = useRef(null);
    const [searchInputIsFocus, setSearchInputIsFocus] = useState(false);
    useClickOutSide(formWrapperRef, () => { setSearchInputIsFocus(false) });
    const [searchHistoryCurrentTab, setSearchHistoryCurrentTab] = useState('searchHistory');
    const [selectMultipleSelections, setSelectMultipleSelections] = useState(false);

    const handleSearchForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!getSearchInput) return;
        navigate('/searchresult', { state: { getSearchInput } });
        setGetSearchInput('');
        setSearchInputIsFocus(false);
    };

    const handleMultipleSelections = (searchHistory: { _id: string }[]) => {
        if (selectMultipleSelections) {
            setMultipleSearchHistorySelection([]);
        } else {
            setMultipleSearchHistorySelection(searchHistory.map(item => item._id));
        }
        setSelectMultipleSelections(!selectMultipleSelections)
    };

    const handleMultipleDeleteSearchHistory = async (arrOfId: string[]) => {
        if (!multipleSearchHistorySelection.length) return;

        await deleteData<{ _id: string, searched: string }[]>('/api/search/delete/history/' + arrOfId.join('&'))
            .then((response) => {
                const { data } = response
                if (data) {
                    setLoginStatus((pre) => pre ? { ...pre, searchHistory: data } : pre)
                }
                setSelectMultipleSelections(false);
                setMultipleSearchHistorySelection([]);
            });
    };

    return <div className="font-text text-sm">
        <div
            id="search-form-wrapper"
            className={`${searchInputIsFocus ? 'absolute top-1 left-1/2 -translate-x-1/2 border py-2 px-6 rounded-xl bg-gray-100/50 z-[100] ' : ''} space-y-0.5`}
            ref={formWrapperRef}
        >
            <form action="" onSubmit={handleSearchForm} className="relative " >
                <Button
                    id="search-icon"
                    buttonClass="absolute left-2 top-1/2 -translate-y-1/2"
                    children={<Searchicon width={searchInputIsFocus ? "22px" : "18px"} height={searchInputIsFocus ? "22px" : "18px"} />}
                    handleClick={() => { setSearchInputIsFocus(true) }}
                />
                <input
                    className={`border-2 px-9 rounded-full outline-green-200 outline-2 ${searchInputIsFocus ? 'min-w-[480px] py-2 shadow' : 'min-w-[380px] py-1.5'}`}
                    type="text"
                    id="search-input"
                    name="search"
                    placeholder="Search..."
                    value={getSearchInput}
                    onChange={(e) => setGetSearchInput(e.target.value)}
                    onFocus={() => setSearchInputIsFocus(true)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold cursor-pointer">
                    {getSearchInput ?
                        <span onClick={() => setGetSearchInput('')} >x</span> :
                        <span onClick={() => { setSearchInputIsFocus(true); setSearchHistoryCurrentTab('searchHistorySetting') }}>hstry</span>
                    }
                </span>
            </form>
            <div id="search-history-wrapper"
                className={`w-full ${searchInputIsFocus ? 'block' : 'hidden'} p-4 space-y-3`}
            >
                <Tab
                    id="search-history-tabs"
                    tabClass="space-y-4"
                    currentTab={searchHistoryCurrentTab}
                    arrOfTab={[
                        {
                            name: 'searchHistory',
                            content: <>
                                {
                                    searchHistory &&
                                        searchHistory.length ?
                                        <>
                                            <span id="search-history-title" className="text-base">Recent Searches</span>
                                            <div id="list-search-history" className="min-h-[480px] max-h-[480px] overflow-y-scroll space-y-2">
                                                {searchHistory.map((item) =>
                                                    <Singlesearchhistory
                                                        key={item._id}
                                                        history={item}
                                                        setGetSearchInput={setGetSearchInput}
                                                        multipleSearchHistorySelection={multipleSearchHistorySelection}
                                                        setMultipleSearchHistorySelection={setMultipleSearchHistorySelection}
                                                    />
                                                )}
                                            </div>
                                        </> :
                                        null
                                }
                            </>
                        },
                        {
                            name: 'searchHistorySetting',
                            content: <>
                                <div id="header" className="flex items-center">
                                    <div>
                                        <span id="return-btn" className="cursor-pointer" onClick={() => setSearchHistoryCurrentTab('searchHistory')} >{"<---"}</span>
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <span id="search-history-title" className="text-base">Recent Searches</span>
                                    </div>
                                </div>
                                {
                                    searchHistory &&
                                        searchHistory.length ?
                                        <div id="list-search-history" className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                {selectMultipleSelections ?
                                                    <Button
                                                        id="delete-all-selected-search-history"
                                                        buttonClass="text-blue-400 cursor-pointer"
                                                        children={!loadingMultipleDeletes ? "Clear search history" : 'loading...'}
                                                        handleClick={() => handleMultipleDeleteSearchHistory(multipleSearchHistorySelection)}
                                                    /> :
                                                    <div></div>
                                                }
                                                <Input
                                                    id="select-all-search-history"
                                                    type="radio"
                                                    inputName="Select all"
                                                    inputClass="block cursor-pointer"
                                                    labelClass="flex items-center gap-2"
                                                    value=""
                                                    setValue={() => { }}
                                                    checked={selectMultipleSelections}
                                                    onClick={() => handleMultipleSelections(searchHistory)}
                                                />
                                            </div>
                                            <div className="min-h-[480px] max-h-[480px] overflow-y-scroll space-y-2">
                                                {searchHistory.map((item) =>
                                                    <Singlesearchhistory
                                                        key={item._id}
                                                        settings={true}
                                                        history={item}
                                                        setGetSearchInput={setGetSearchInput}
                                                        selectMultipleSelections={selectMultipleSelections}
                                                        multipleSearchHistorySelection={multipleSearchHistorySelection}
                                                        setMultipleSearchHistorySelection={setMultipleSearchHistorySelection}
                                                    />
                                                )}
                                            </div>
                                        </div> :
                                        <div>no search history</div>
                                }
                            </>
                        }
                    ]}
                />
            </div>
        </div>
    </div >
};

export default Searchform;
