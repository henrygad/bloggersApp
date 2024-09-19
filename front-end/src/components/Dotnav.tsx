import { ReactNode, useRef } from "react";
import { useClickOutSide } from "../hooks";

type Props = {
    setToggleSideMenu: (value: string) => void
    toggleSideMenu: string
    name: string
    id?: string
    children: ReactNode | null
};

const Dotnav = ({ setToggleSideMenu, toggleSideMenu, name, id, children }: Props) => {
    const toggleRef = useRef(null);
    useClickOutSide(toggleRef, () => setToggleSideMenu(''));

    return <div ref={toggleRef} id={id || 'Dotnav'}>
        <div className="flex flex-col text-2xl font-bold absolute -top-1 right-2 cursor-pointer"
            onClick={() => setToggleSideMenu(toggleSideMenu.trim() ? ' ' : name)}
        >
            <span className=" h-[0.38rem]">.</span>
            <span className=" h-[0.38rem]">.</span>
            <span className=" h-[0.38rem]">.</span>
        </div>
        {toggleSideMenu.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase() ? children : null}
    </div>
};

export default Dotnav;
