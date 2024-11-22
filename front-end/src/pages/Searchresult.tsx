import { useLocation } from "react-router-dom";
import { useFetchData, useUserIsLogin } from "../hooks";
import { Searchresultprops} from "../entities";
import { Button, Menu, Searchform, Singleblogpost, Tab, UsershortInfor } from "../components";
import { useEffect, useState } from "react";

const Searchresult = () => {
  const location: { state: { getSearchInput: null } } = useLocation()
  const { getSearchInput } = location.state;
  const { setLoginStatus } = useUserIsLogin();
  const { data: searchResult, loading: loadingSearchResult } =
    useFetchData<Searchresultprops>(getSearchInput ? `/api/search?title=${getSearchInput}&body=${getSearchInput}&catigory=${getSearchInput}&userName=${getSearchInput}&name=${getSearchInput}` : '', [getSearchInput]);
  const [searchResultCurrentTab, setSearchResultCurrentTab] = useState('allresults');

  const searchTabMenu = [
    {
      name: 'all',
      content: <Button
        id={'search-result-all'}
        buttonClass={'border-b'}
        handleClick={() => setSearchResultCurrentTab('allresults')}
        children={'All'}
      />
    },
    {
      name: 'blogposts',
      content: <Button
        id={'search-result-blogposts'}
        buttonClass={'border-b'}
        handleClick={() => setSearchResultCurrentTab('blogpostresults')}
        children={'Blogposts'}
      />
    },
    {
      name: 'users',
      content: <Button
        id={'search-result-users'}
        buttonClass={'border-b'}
        handleClick={() => setSearchResultCurrentTab('userResults')}
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
    <div id="search-form-wrapper" className="relative flex justify-center items-center">
      <div className="absolute -top-8">
        <Searchform />
      </div>
    </div>
    <div id="search-result-menu" className="border-b" >
      <Menu
        id={'search-tab-menu'}
        arrOfMenu={searchTabMenu}
        parentClass={'flex justify-between pb-2'}
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
                    {searchResult?.userSearchResults.length ?
                      searchResult?.userSearchResults.map((item) =>
                        <UsershortInfor
                          key={item.userName}
                          userName={item.userName}
                        />
                      ) :
                      null
                    }
                  </div>
                  <div id="all-search-result-for-blogpost">
                    {searchResult?.blogpostSearchResult.length ?
                      searchResult?.blogpostSearchResult.map((item, index) =>
                        item.status === 'published' ?
                          <Singleblogpost
                            key={item._id}
                            index={index}
                            blogpost={item}
                            type="text"
                          /> :
                          null
                      ) :
                      null}
                  </div>
                </> :
                <div>no search result</div>
            }</div>
          },
          {
            name: 'blogpostresults',
            content: <div id="search-result-for-blogpost">
              <div>{searchResult?.blogpostSearchResult &&
                searchResult?.blogpostSearchResult.length ?
                searchResult?.blogpostSearchResult.map((item, index) =>
                  item.status === 'published' ?
                    <Singleblogpost
                      key={item._id}
                      index={index}
                      blogpost={item}
                      type="text"
                    /> :
                    null
                ) :
                <div>no search result</div>
              }</div>
            </div>
          },
          {
            name: 'userResults',
            content: <div id="search-result-for-users">
              <div>{
                searchResult?.userSearchResults &&
                  searchResult?.userSearchResults.length ?
                  searchResult?.userSearchResults.map((item) =>
                    <UsershortInfor
                      key={item.userName}
                      userName={item.userName}
                    />
                  ) :
                  <div>no search result</div>
              }</div>
            </div>
          }
        ]}
      /> :
      <div>loading search result...</div>
    }
  </div>
};

export default Searchresult;
