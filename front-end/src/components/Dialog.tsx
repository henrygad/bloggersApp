import { ReactNode, useEffect, useRef, useState } from "react";
import { useClickOutSide } from "../hooks";
import tw from "tailwind-styled-components";

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
    id = 'dialog',
    currentDialog,
    parentClass,
    childClass,
    dialog,
    setDialog,
    children,
}: Props) => {
    const dialogRef = useRef(null);
    useClickOutSide(dialogRef, () => { setDialog(dialog ? '' : dialog) });
    const [toggleDialog, setToggleDialog] = useState({
        parent: false,
        child: false,
    });

    const handleDialogmoves = () => {
        if (dialog.trim().toLocaleLowerCase() === currentDialog.trim().toLocaleLowerCase()) {
            setToggleDialog({ parent: true, child: false });
            setTimeout(() => {
                setToggleDialog({ parent: true, child: true });
            }, 200);
        } else {
            setToggleDialog(pre => pre ? { ...pre, child: false } : pre);
            setTimeout(() => {
                setToggleDialog({ parent: false, child: false });
            }, 750);
        };
    };

    const preventDefaultScroll = (e: WheelEvent | TouchEvent) => {
        if (dialog.trim().toLocaleLowerCase() === currentDialog.trim().toLocaleLowerCase()) {
            e.preventDefault();
        };
    };

    useEffect(() => {
        handleDialogmoves();

        window.addEventListener('wheel', preventDefaultScroll, { passive: false });
        window.addEventListener('touchmove', preventDefaultScroll, { passive: false });

        return () => {
            window.removeEventListener('wheel', preventDefaultScroll);
            window.removeEventListener('touchmove', preventDefaultScroll);
        };

    },
        [
            dialog.trim().toLocaleLowerCase(),
            currentDialog.trim().toLocaleLowerCase()
        ]);




    return <Dialogwraaper
        id={id}
        style={{ margin: 0 }}
        className={`
            ${toggleDialog.child ? `backdrop-blur-sm ${parentClass}` : ''}
        ${toggleDialog.parent ?
                'block' :
                'hidden'
            }`}>
        <Dialogchildrenwrapper ref={dialogRef} className={`${toggleDialog.child ?
            'translate-y-0' :
            'translate-y-[100%]'
            } ${childClass} `}>
            {children}
        </Dialogchildrenwrapper>
    </Dialogwraaper>
};

export default Dialog;

const Dialogchildrenwrapper = tw.div`
transition-transform
duration-700
`

const Dialogwraaper = tw.div`
fixed
top-0 
bottom-0 
right-0 
left-0
z-50
`