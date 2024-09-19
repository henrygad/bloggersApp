import { useEffect, useState } from "react";
import { usePatchData, useUserIsLogin } from "../hooks";

type Props = {
    url: string
    arrOfViewes: string[]
    elementRef: React.MutableRefObject<HTMLElement | null>
    onLoadView: boolean
};

const Viewbutton = ({ url, arrOfViewes, onLoadView = false, elementRef }: Props) => {
    const { loginStatus: { sessionId } } = useUserIsLogin();
    const [viewes, setViewes] = useState(arrOfViewes);
    const { patchData } = usePatchData();

    const handleView = async (url: string, sessionId: string) => {

        if (viewes.includes(sessionId)) return;
        const body = null;
        const response = await patchData(url, body);
        const { data, ok } = response;

        if (ok) {
            setViewes(data);
        }
    };

    const handleOnMouseHover = (e: MouseEvent) => {
        if (elementRef.current &&
            elementRef.current.contains(e.target as Node)
        ) {
            setTimeout(() => {
                handleView(url, sessionId);
            }, 1000);
        }
    };

    useEffect(() => {
        if (!elementRef.current) return
        elementRef.current.addEventListener('mouseenter', handleOnMouseHover);
        elementRef.current.addEventListener('mouseleave', handleOnMouseHover);

        return () => {
            if (!elementRef.current) return
            elementRef.current.removeEventListener('mouseenter', handleOnMouseHover);
            elementRef.current.removeEventListener('mouseleave', handleOnMouseHover);
        };
    }, []);

    useEffect(() => {
        if (onLoadView) {
            setTimeout(() => {
                handleView(url, sessionId);
            }, 1000);
        };

    }, []);

    return <span id="views" className="cursor-none">View: {viewes ? viewes.length : 0}</span>
};

export default Viewbutton;
