import { ReactNode, useEffect, useRef, useState } from "react";
import { useClickOutSide } from "../hooks";
import tw from "tailwind-styled-components";
import Button from "./Button";

type Props = {
    setToggleSideMenu: (value: string) => void
    toggleSideMenu: string
    name: string
    id?: string
    children: ReactNode
};

const Dotnav = ({ setToggleSideMenu, toggleSideMenu, name, id, children }: Props) => {
    const toggleRef = useRef(null);
    useClickOutSide(toggleRef, () => setToggleSideMenu(' '));
    const [toggleDialog, setToggleDialog] = useState({
        parent: false,
        child: false,
    });

    const handleDialogmoves = () => {
        if (toggleSideMenu.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase()) {
            setToggleDialog({ parent: true, child: false });
            setTimeout(() => {
                setToggleDialog({ parent: true, child: true });
            }, 100);
        } else {
            setToggleDialog( pre => pre ? { ...pre,  child: false }: pre);
            setTimeout(() => {
                setToggleDialog({ parent: false, child: false });
            }, 550);
        };
    };

    useEffect(() => {
        handleDialogmoves()
    },
        [
            toggleSideMenu.trim().toLocaleLowerCase(),
            name.trim().toLocaleLowerCase()
        ]);


    return <div ref={toggleRef}>
        <Button
            id={id || 'dot-nav'}
            buttonClass="flex flex-col font-bold absolute top-0 right-2"
            children={<>
                <span className="text-2xl h-[0.38rem]">.</span>
                <span className="text-2xl h-[0.38rem]">.</span>
                <span className="text-2xl h-[0.38rem]">.</span>
            </>}
            handleClick={() => setToggleSideMenu(toggleSideMenu.trim() ? '' : name)}
        />
        <div className={toggleDialog.parent ? 'block absolute top-0 right-0 left-0' : 'hidden'}>
            <Dotswrapper className={`${toggleDialog.child ? 'translate-x-0 ' : ' translate-x-[20%] '}`} >
                {children}
            </Dotswrapper>
        </div>
    </div>
};

export default Dotnav;

const Dotswrapper = tw.div`
transition-transform
duration-500
`
