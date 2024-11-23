import { useRef, useState } from "react";
import { useClickOutSide, useDeleteData, useResizeWindow, useUserIsLogin } from "../hooks";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Tab from "./Tab";
import Input from "./Input";
import Singlesearchhistory from "./Singlesearchhistory";
import tw from "tailwind-styled-components";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaHistory } from "react-icons/fa"
import { RiSearch2Line } from "react-icons/ri"
import { MdOutlineCancel } from "react-icons/md"

const Searchform = () => {
    const { loginStatus: { searchHistory }, setLoginStatus } = useUserIsLogin();
    const [getSearchInput, setGetSearchInput] = useState('');
    const [multipleSearchHistorySelection, setMultipleSearchHistorySelection] = useState<string[]>([]);
    const { deleteData, loading: loadingMultipleDeletes } = useDeleteData();
    const navigate = useNavigate();
    const { windowSize } = useResizeWindow();

    const formWrapperRef = useRef(null);
    const inputRef = useRef<HTMLInputElement>(null)
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

    return <div id="search-form-wrapper" className="relative flex justify-center w-full">
        <div className="absolute -top-9 -translate-x-1/2  sm:left-1/2 z-30">
            <Searchformwrappper
                id="search-form-wrapper"
                className={searchInputIsFocus ?
                    'absolute top-0 left-1/2 -translate-x-1/2 min-w-[280px] sm:min-w-[360px] md:min-w-[480px] xl:min-w-[768px] border-2 px-6 rounded-xl' :
                    ''}
                ref={formWrapperRef}>
                {windowSize.width >= 768 ||
                    searchInputIsFocus ?
                    <form action="" onSubmit={handleSearchForm}
                        className="relative w-full" >
                        <Button
                            id="search-icon"
                            buttonClass="absolute left-2 top-1/2 -translate-y-1/2"
                            children={<RiSearch2Line className="text-gray-400" size={searchInputIsFocus ? 22 : 19} />}
                            handleClick={() => { setSearchInputIsFocus(true) }}
                        />
                        <Searchinput
                            ref={inputRef}
                            autoComplete="off"
                            className={searchInputIsFocus ?
                                'w-full py-3 border-t-0' :
                                ''}
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
                                <Button
                                    id="cancel-inputs"
                                    buttonClass=""
                                    children={<MdOutlineCancel className="text-gray-400" size={20} />}
                                    handleClick={() => setGetSearchInput('')}
                                /> :
                                <Button
                                    id="search-historys"
                                    buttonClass=""
                                    children={<FaHistory className="text-gray-400" size={18} />}
                                    handleClick={() => { setSearchInputIsFocus(true); setSearchHistoryCurrentTab('searchHistorySetting') }}
                                />
                            }
                        </span>
                    </form> :
                    <Button
                        id="search-icon"
                        buttonClass=""
                        children={<RiSearch2Line size={20} />}
                        handleClick={() => {
                            setSearchInputIsFocus(true);
                            setTimeout(() => {
                                inputRef.current?.focus();
                            }, 300);
                        }}
                    />
                }
                <Tab
                    id="search-history-tabs"
                    tabClass={`w-full ${searchInputIsFocus ? 'block' : 'hidden'} px-4 pt-4 pb-2 space-y-3`}
                    currentTab={searchHistoryCurrentTab}
                    arrOfTab={[
                        {
                            name: 'searchHistory',
                            content: <>
                                <span id="search-history-title" className="text-base font-semibold">
                                    Recent Searches
                                </span>
                                {
                                    searchHistory &&
                                        searchHistory.length ?
                                        <>
                                            <div id="list-search-history" className="space-y-2 overflow-y-auto max-h-[480px]">
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
                                    <div className="flex gap-2 items-center">
                                        <Button
                                            id="return-black"
                                            buttonClass=""
                                            children={<IoMdArrowRoundBack size={20} />}
                                            handleClick={() => setSearchHistoryCurrentTab('searchHistory')}
                                        />
                                        <span id="search-history-title" className="text-base font-semibold">
                                            Recent Searches
                                        </span>
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
                                            <div className="space-y-2 overflow-y-auto max-h-[480px]">
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
                                        null
                                }
                            </>
                        }
                    ]}
                />

            </Searchformwrappper>
        </div>
    </div>

};

export default Searchform;

const Searchinput = tw.input`
border-2 
py-2
px-8
rounded-full 
outline-green-200 
outline-2
bg-transparent
`
const Searchformwrappper = tw.div`
text-sm
bg-white
dark:bg-stone-800 
dark:text-white 
z-[100]
transition-transform 
duration-200
space-y-0.5 
`
