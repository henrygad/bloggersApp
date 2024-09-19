import { ReactNode, useRef } from "react";
import { useClickOutSide } from "../hooks";

type Props = {
    id: string
    children: ReactNode
    parentClass: string
    childClass: string
    currentDialog: string
    dialog: string
    setDialog: (value: string) => void
};

const Dialog = ({
    childClass,
    children,
    id = 'dialog',
    parentClass,
    currentDialog,
    dialog,
    setDialog,
}: Props) => {
    const dialogRef = useRef(null);
    useClickOutSide(dialogRef, () => { setDialog(dialog ? '' : dialog) });

    return <main
        id={id}
        className={`${dialog.trim().toLocaleLowerCase() === currentDialog.trim().toLocaleLowerCase() ? 'block' : 'hidden'} 
        fixed top-0 bottom-0 right-0 left-0 backdrop-blur-sm  z-50 ${parentClass}`}>
        <div ref={dialogRef} className={`${childClass}  `}>
            {children}
        </div>
    </main>
};

export default Dialog;
