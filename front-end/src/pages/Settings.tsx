import { Menu } from "../components";
import {Deleteuseraccount, Signoutuser } from "../components";

const Settings = () => {
    const settingsMenus = [
        {
            name: 'Edit profile',
            to: '/editprofile',
        },
        {
            name: 'security',
            to: '/security',
        },
        {
            name: 'logout',
            to: '',
            content: <Signoutuser />,
        },
        {
            name: 'deleteprofile',
            to: '',
            content:  <Deleteuseraccount />,
        },
        {
            name: 'FAQ',
            to: '/faq',
        },
        {
            name: 'help',
            to: '/help',
        },
        {
            name: 'privacy policy',
            to: '/privacy-policy',
        },
    ];

    return <div>
        <Menu
            id="sitting-sideBar"
            arrOfMenu={settingsMenus}
            parentClass="text-base font-secondary space-y-3 "
            childClass=""
            nestedChildParentClass='space-y-2 ml-4 py-2'
        />
    </div>
};

export default Settings;