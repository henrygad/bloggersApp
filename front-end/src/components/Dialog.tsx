import { ReactNode, useRef} from "react";
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
    useClickOutSide(dialogRef, () => { setDialog('') });

    return <main
        className={`${dialog === currentDialog ? 'block' : 'hidden'} fixed top-0 bottom-0 right-0 left-0 z-50 ${parentClass}`}>
        <div ref={dialogRef} className={childClass}>
            {children}
        </div>
    </main>
};

export default Dialog;
