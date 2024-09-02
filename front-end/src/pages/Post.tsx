import { useEffect, useState } from "react";
import { Menu, Tab } from "../components";
import { Button } from "../components";
import { Createblogpostsec } from "../sections";
import { useLocation } from "react-router-dom";


const Post = () => {
  const location = useLocation();
  const [parentTabs, setParentTabs] = useState('post');
  const [childrenTabs, setChildrenTabs] = useState('');

  useEffect(() => { // auto move to the post section to edit
    if (location.state?.toEdit) {
      setParentTabs('post');
    };
  }, [location.state?.toEdit]);


  const sideBar = [
    {
      menu: {
        name: 'Home',
        to: '',
        content: <Button children="Home" buttonClass="" id="" handleClick={() => handleSwitchBetweenParentTabs('home')} />,
      },
      tab: { name: 'Home', content: <div id="home">home</div> }
    },
    {
      menu: {
        name: 'Post',
        to: '',
        content: <Button children="Post" buttonClass="" id="" handleClick={() => handleSwitchBetweenParentTabs('post')} />
      },
      tab: { name: 'post', content: <Createblogpostsec toEdit={location.state?.toEdit} blogpostToEdit={location.state?.data} /> }
    },
    {
      menu: {
        name: 'Articles',
        to: '',
        content: <Button children="Articles" buttonClass="" id="" handleClick={() => ''} />,
        child: [
          {
            name: "Published",
            to: '',
            content: <Button children="Published" buttonClass="" id="" handleClick={() => { handleSwitchBetweenParentTabs('articles'); setChildrenTabs('Published') }} />
          },
          {
            name: "Unpublished",
            to: '',
            content: <Button children="Unpublished" buttonClass="" id="" handleClick={() => { handleSwitchBetweenParentTabs('articles'); setChildrenTabs('unpublished') }} />
          },
          {
            name: "Archived",
            to: '',
            content: <Button children="Archived" buttonClass="" id="" handleClick={() => { handleSwitchBetweenParentTabs('articles'); setChildrenTabs('Archived') }} />
          },
        ]
      },
      tab: {
        name: 'Articles',
        content: <div id="articles">Articles</div>,
        child: [
          {
            name: "Published",
            content: <div id="articles">Published</div>,
          },
          {
            name: "Unpublished",
            content: <div id="articles">Unpublished</div>,
          },
          {
            name: "Archived",
            content: <div id="articles">Archived</div>,
          },
        ]
      }
    },
    {
      menu: {
        name: 'Media',
        to: '',
        content: <Button children="Media" buttonClass="" id="" handleClick={() => handleSwitchBetweenParentTabs('media')} />
      },
      tab: { name: 'media', content: <div id="media">media</div> }
    },
    {
      menu: {
        name: 'Settings',
        to: '',
        content: <Button children="Settings" buttonClass="" id="" handleClick={() => ''} />,
        child: [
          {
            name: 'Perlink',
            to: '',
            content: <Button children="Perlink" buttonClass="" id="" handleClick={() => { handleSwitchBetweenParentTabs('settings'); setChildrenTabs('Perlink') }} />
          },
        ]
      },
      tab: {
        name: 'settings',
        content: <div id="settings">settings</div>,
        child: [
          {
            name: 'Perlink',
            content: <div id="Permalink">Perlink</div>,
          },
        ]
      }
    },
  ];


  const handleSwitchBetweenParentTabs = (newTabName: string) => {
    const preTabName = parentTabs;
    if (preTabName.trim().toLocaleLowerCase() === 'post' &&
      newTabName.trim().toLocaleLowerCase() !== 'post') {
      alert('you about to leave this page');
    };

    setParentTabs(newTabName);
  };




  return <div>
    <div className="flex">
      <div className="min-w-[140px] border-r  border-stone-700">
        <Menu
          arrOfMenu={sideBar.map(item => item.menu)}
          parentClass="text-base font-secondary space-y-3 "
          childClass=""
          id="sideBar"
          nestedChildParentClass='space-y-2 ml-4 py-2'
        />
      </div>
      <div className="flex-1 px-4 pb-40 pt-3">
        <Tab
          id="alltabs"
          arrOfTab={sideBar.map(item => item.tab)}
          parentClass=""
          currentTab={parentTabs}
          childrenTabs={childrenTabs}
        />
      </div>
    </div>
  </div >
};

export default Post;


