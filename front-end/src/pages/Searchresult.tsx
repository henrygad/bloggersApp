import { useLocation } from "react-router-dom";
import { useFetchData, useUserIsLogin } from "../hooks";
import { Searchresultprops } from "../entities";
import { Backwardnav, Button, Menu, Searchform, Singleblogpost, Tab, UsershortInfor } from "../components";
import { useEffect, useState } from "react";

const Searchresult = () => {
  const location: { state: { getSearchInput: null } } = useLocation()
  const { getSearchInput } = location.state || { getSearchInput: null };
  const { setLoginStatus } = useUserIsLogin();
  const { data: searchResult, loading: loadingSearchResult } =
    useFetchData<Searchresultprops>(getSearchInput ? `/api/search?title=${getSearchInput}&body=${getSearchInput}&catigory=${getSearchInput}&userName=${getSearchInput}&name=${getSearchInput}` : '', [getSearchInput]);
  const [searchResultCurrentTab, setSearchResultCurrentTab] = useState('allresults');

  const searchTabMenu = [
    {
      name: 'all',
      content: <Button
        id={'search-result-all'}
        buttonClass={`transition-color duration-500 hover:text-green-500 ${searchResultCurrentTab === 'allresults' ? 'text-green-500' : ''}`}
        handleClick={() => setSearchResultCurrentTab('allresults')}
        children={'All'}
      />
    },
    {
      name: 'blogposts',
      content: <Button
        id={'search-result-blogposts'}
        buttonClass={`transition-color duration-500 hover:text-green-500 ${searchResultCurrentTab === 'blogpostresults' ? 'text-green-500' : ''}`}
        handleClick={() => setSearchResultCurrentTab('blogpostresults')}
        children={'Blogposts'}
      />
    },
    {
      name: 'users',
      content: <Button
        id={'search-result-users'}
        buttonClass={`transition-color duration-500 hover:text-green-400 ${searchResultCurrentTab === 'userresults' ? 'text-green-500' : ''}`}
        handleClick={() => setSearchResultCurrentTab('userresults')}
        children={'Users'}
      />
    },
  ]

  useEffect(() => {
    if (searchResult?.searchHistory) {
      setLoginStatus(pre => pre ? {
        ...pre,
        searchHistory: searchResult.searchHistory,
      } : pre)
    };
  }, [searchResult?.searchHistory]);

  return <div className="space-y-5">
    <Searchform />
    <Backwardnav pageName="Search result" />
    <div id="search-result-menu" className="border-b" >
      <Menu
        id={'search-tab-menu'}
        arrOfMenu={searchTabMenu}
        parentClass={'flex justify-between font-text text-sm px-2'}
        childClass=""
      />
    </div>
    {!loadingSearchResult ?
      <Tab
        id={'search-result'}
        tabClass={''}
        currentTab={searchResultCurrentTab}
        arrOfTab={[
          {
            name: 'allresults',
            content: <div id="search-result-for-all"> {
              (searchResult?.blogpostSearchResult || searchResult?.userSearchResults) ?
                <>
                  <div id="all-search-result-for-userName">
                    {searchResult &&
                      searchResult.userSearchResults &&
                      searchResult.userSearchResults.length ?
                      searchResult.userSearchResults
                        .map((item) =>
                          <UsershortInfor
                            key={item.userName}
                            userName={item.userName}
                          />
                        ) :
                      null
                    }
                  </div>
                  <div id="all-search-result-for-blogpost">
                    {searchResult &&
                      searchResult.blogpostSearchResult &&
                      searchResult.blogpostSearchResult.length ?
                      searchResult.blogpostSearchResult
                        .map((item, index) =>
                          <Singleblogpost
                            key={item._id}
                            index={index}
                            blogpost={item}
                            type="text"
                          />
                        ) :
                      null
                    }
                  </div>
                </> :
                <span className="text-base font-text font-semibold" >
                  Noting found
                </span>
            }</div>
          },
          {
            name: 'blogpostresults',
            content: <div id="search-result-for-blogpost">
              <div>{searchResult &&
                searchResult.blogpostSearchResult &&
                searchResult.blogpostSearchResult.length ?
                searchResult.blogpostSearchResult
                  .map((item, index) =>
                    <Singleblogpost
                      key={item._id}
                      index={index}
                      blogpost={item}
                      type="text"
                    />
                  ) :
                <span className="text-base font-text font-semibold" >
                  Noting found
                </span>
              }</div>
            </div>
          },
          {
            name: 'userresults',
            content: <div id="search-result-for-users">
              <div>{searchResult &&
                searchResult.userSearchResults &&
                searchResult.userSearchResults.length ?
                searchResult.userSearchResults
                  .map((item) =>
                    <UsershortInfor
                      key={item.userName}
                      userName={item.userName}
                    />
                  ) :
                <span className="text-base font-text font-semibold" >
                  Noting found
                </span>
              }</div>
            </div>
          }
        ]}
      /> :
      <div>loading...</div>
    }
  </div>
};

export default Searchresult;
