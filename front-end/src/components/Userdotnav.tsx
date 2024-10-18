import { ReactNode, useState } from "react";
import Dotnav from "./Dotnav";
import Button from "./Button";
import { useCopyLink, useUserIsLogin } from "../hooks";
import Menu from "./Menu";

const Userdotnav = ({ userName }: { userName: string }) => {
    const { loginStatus: { loginUserName } } = useUserIsLogin();
    const isAccountOwner = loginUserName === userName;

    const [toggleUserDotNav, setToggleUserDotNav] = useState('');
    const { copied, handleCopyLink } = useCopyLink('/localhost:500/' + userName);

    const generalUserDotNavs = [
        {
            name: 'copy link',
            to: '',
            content: <Button
                id="copy-profile-link"
                buttonClass="border-b"
                children={!copied ?
                    <span>Copy link</span>
                    : <span className="text-blue-600">Copied</span>
                }
                handleClick={() => handleProfileCopyLink}
            />
        },
        {
            name: 'share',
            to: '',
            content: <Button
                id="share-profile"
                buttonClass="border-b"
                children={'Share'}
                handleClick={() => handleShareProfile()}
            />
        },
    ];

    const othersUserDotNavs = [
        ...generalUserDotNavs,
        {
            name: 'block',
            to: '',
            content: <Button
                id="block-user"
                buttonClass="border-b"
                children={'Block user'}
                handleClick={() => handleBlockUser()}
            />
        },
        {
            name: 'report',
            to: '',
            content: <Button
                id="report-user"
                buttonClass="border-b"
                children={'Report user'}
                handleClick={() => handleReportUser}
            />
        },
    ];

    const handleShareProfile = () => { };

    const handleProfileCopyLink = () => {
        handleCopyLink();
    };

    const handleBlockUser = () => { };
      
    const handleReportUser = () => { };


    return <>
        <Dotnav
            id="user-dotnav"
            name="Userdotnav"
            children={
                <Menu
                    id=""
                    parentClass="flex-col gap-2 absolute top-0 right-0 min-w-[140px] max-w-[140px] backdrop-blur-sm p-4 rounded shadow-sm z-20 cursor-pointer"
                    childClass=""
                    arrOfMenu={isAccountOwner ? generalUserDotNavs : othersUserDotNavs}
                />
            }
            toggleSideMenu={toggleUserDotNav}
            setToggleSideMenu={setToggleUserDotNav}
        />
    </>
};

export default Userdotnav;
