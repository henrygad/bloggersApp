import { useEffect, useState } from "react";
import { useNotification, usePatchData, useUserIsLogin } from "../hooks";

type Props = {
    url: string
    arrOfViews: string[]
    elementRef: React.MutableRefObject<HTMLElement | null>
    onLoadView: boolean
    notificationUrl: string
    notificationTitle: string
};

const Viewbutton = ({ url, arrOfViews, onLoadView = false, elementRef, notificationTitle, notificationUrl }: Props) => {
    const { loginStatus: { loginUserName, sessionId } } = useUserIsLogin();
    const [views, setViews] = useState(arrOfViews);
    const { patchData } = usePatchData();

    const notify = useNotification();

    const handleView = async (url: string, sessionId: string) => {

        if (views.includes(sessionId)) return;
        const body = null;
        const response = await patchData(url, body);
        const { data, ok } = response;

        if (ok) {
            setViews(data);
           //handleViewsNotification()
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

    const handleViewsNotification = async (views: number) => {
        const url = '/api/notification/' + loginUserName;
        const body = {
            typeOfNotification: 'view',
            msg: `${views} people viewed ${notificationTitle}`,
            url: notificationUrl,
            notifyFrom: 'blogger',
        };

        setTimeout(async () => {
            await notify(url, body);
        }, 1000);
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

    return <span id="views" className="cursor-none">View: {views ? views.length : 0}</span>
};

export default Viewbutton;
