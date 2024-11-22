import { useEffect, useState } from "react";
import { Menu, Tab } from "../components";
import { Button } from "../components";
import { Drafts, Createblogpostsec, Displayblogpostimagessec, Unpublisheds } from "../sections";
import { useLocation } from "react-router-dom";
import { Blogpostprops } from "../entities";


const Post = () => {
  const location = useLocation();
  const { edit, data } = location.state || { edit: false, data: null };
  const blogpostToEdit: Blogpostprops = data;
  const toEdit: boolean = edit;

  const [parentTabs, setParentTabs] = useState('post');
  const [childrenTabs, setChildrenTabs] = useState('');

  const [inputAreasStatus, setInputAreasStatus] = useState(toEdit ? 'old' : 'empty');

  const [getBlogpostId, setGetBlogpostId] = useState(blogpostToEdit?._id || '');
  const [titleContent, setTitleContent] = useState<{ _html: string, text: string }>({
    _html: blogpostToEdit?._html.title || '',
    text: blogpostToEdit?.title || '',
  });
  const [bodyContent, setBodyContent] = useState<{ _html: string, text: string }>({
    _html: blogpostToEdit?._html.body || '',
    text: blogpostToEdit?.body || '',
  });
  const [displayImage, setDisplayImage] = useState(blogpostToEdit?.displayImage || '');
  const [catigory, setCatigory] = useState(blogpostToEdit?.catigory || '');
  const [slug, setSlug] = useState(blogpostToEdit?.slug || '');
  const [blogpostStatus, setBlogpostStatus] = useState(blogpostToEdit?.status || '');
  const [blogpostPreStatus, setBlogpostPreStatus] = useState(blogpostToEdit?.preStatus || '');

  const sideBar = [
    {
      menu: {
        name: 'Post',
        to: '',
        content: <Button
          id=""
          children="Post"
          buttonClass=""
          handleClick={() => handleSwitchBetweenParentTabs('post')} />
      },
      tab: {
        name: 'post',
        content: <Createblogpostsec
          toEdit={toEdit}
          inputAreasStatus={inputAreasStatus}
          setInputAreasStatus={setInputAreasStatus}
          getBlogpostId={getBlogpostId}
          setGetBlogpostId={setGetBlogpostId}
          titleContent={titleContent}
          setTitleContent={setTitleContent}
          bodyContent={bodyContent}
          setBodyContent={setBodyContent}
          displayImage={displayImage}
          setDisplayImage={setDisplayImage}
          catigory={catigory}
          setCatigory={setCatigory}
          slug={slug}
          setSlug={setSlug}
          blogpostStatus={blogpostStatus}
          setBlogpostStatus={setBlogpostStatus}
          blogpostPreStatus={blogpostPreStatus}
          setBlogpostPreStatus={setBlogpostPreStatus}
        />
      }
    },
    {
      menu: {
        name: 'Articles',
        to: '',
        content: <Button
          children="Article"
          buttonClass=""
          id=""
          handleClick={() => ''} />,
        child: [
          {
            name: "Unpublished",
            to: '',
            content: <Button
              children="Unpublished"
              buttonClass=""
              id=""
              handleClick={() => { handleSwitchBetweenParentTabs('articles'); setChildrenTabs('unpublished') }} />
          },
          {
            name: "drafts",
            to: '',
            content: <Button
              children="Draft"
              buttonClass=""
              id=""
              handleClick={() => { handleSwitchBetweenParentTabs('articles'); setChildrenTabs('drafts') }} />
          },
        ]
      },
      tab: {
        name: 'Articles',
        content: <div id="articles">Articles</div>,
        child: [
          {
            name: "Unpublished",
            content: <Unpublisheds />,
          },
          {
            name: "drafts",
            content: <Drafts />,
          },
        ]
      }
    },
    {
      menu: {
        name: 'Media',
        to: '',
        content: <Button
          children="Media"
          buttonClass=""
          id=""
          handleClick={() => handleSwitchBetweenParentTabs('media')} />
      },
      tab: {
        name: 'media',
        content: <Displayblogpostimagessec />
      }
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
    setParentTabs(newTabName);
  };

  useEffect(() => {
    if (toEdit && blogpostToEdit) {
      setInputAreasStatus('old');
      setGetBlogpostId(blogpostToEdit._id);
      setTitleContent({
        _html: blogpostToEdit._html.title,
        text: blogpostToEdit.title,
      });
      setBodyContent({
        _html: blogpostToEdit._html.body,
        text: blogpostToEdit.body,
      });
      setDisplayImage((blogpostToEdit.displayImage));
      setCatigory(blogpostToEdit.catigory);
      setSlug(blogpostToEdit.slug);
      setBlogpostStatus(blogpostToEdit.status);
      setBlogpostPreStatus(blogpostToEdit.preStatus || '');

      handleSwitchBetweenParentTabs('post');
    };
  }, [toEdit, blogpostToEdit]);

  return <div>
    <div className="flex">
      <div className="min-w-[100px] border-r  border-stone-700">
        <Menu
          arrOfMenu={sideBar.map(item => item.menu)}
          parentClass="text-base font-secondary space-y-3 "
          childClass=""
          id="sideBar"
          nestedChildParentClass='space-y-2 ml-2 py-2'
        />
      </div>
      <div className="flex justify-center pl-4">
        <Tab
          id="alltabs"
          arrOfTab={sideBar.map(item => item.tab)}
          tabClass=""
          currentTab={parentTabs}
          childrenTabs={childrenTabs}
        />
      </div>
    </div>
  </div >
};

export default Post;


