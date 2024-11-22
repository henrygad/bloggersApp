import { useState } from "react";
import Dotnav from "./Dotnav";
import Button from "./Button";
import { useCopyLink, useUserIsLogin } from "../hooks";
import Menu from "./Menu";
import { FaCheck } from "react-icons/fa";
import { BsCopy } from "react-icons/bs";
import { MdBlock } from "react-icons/md";
import { TfiFlagAlt2 } from "react-icons/tfi";

const Userdotnav = ({ userName }: { userName: string }) => {
    const { loginStatus: { loginUserName } } = useUserIsLogin();
    const isAccountOwner = loginUserName === userName;

    const [toggleUserDotNav, setToggleUserDotNav] = useState('');
    const { copied, handleCopyLink } = useCopyLink('https://localhost:5173/' + userName);

    const generalMenu = [
        {
            name: 'copy link',
            to: '',
            content: <Button
                id="copy-profile-link"
                buttonClass="flex items-center gap-2"
                handleClick={() => handleCopyLink()}
                children={<>{copied ? <FaCheck color="green" size={20} /> : <BsCopy size={20} />} Copy</>}
            />
        },
    ];

    const intaracttionMenu = [
        ...generalMenu,
        {
            name: 'report',
            to: '',
            content: <Button
                id="report-content-btn"
                buttonClass="flex gap-2"
                children={<><TfiFlagAlt2 size={20} />  Report</>}
                handleClick={() => ''}
            />
        },
        {
            name: 'block',
            to: '',
            content: <Button
                id="report-content-btn"
                buttonClass="flex gap-2"
                children={<><MdBlock size={20} />  Block</>}
                handleClick={() => ''}
            />
        },
    ];

    const handleBlockUser = () => { };

    const handleReportUser = () => { };
    

    return <Dotnav
        id="user-dotnav"
        name="Userdotnav"
        children={
            <Menu
                id=""
                parentClass="absolute top-0 -right-2 min-w-[140px] max-w-[320px] backdrop-blur-sm p-3 rounded shadow-sm z-20 cursor-pointer space-y-4"
                childClass=""
                arrOfMenu={isAccountOwner ? generalMenu : intaracttionMenu}
            />
        }
        toggleSideMenu={toggleUserDotNav}
        setToggleSideMenu={setToggleUserDotNav}
    />
};

export default Userdotnav;