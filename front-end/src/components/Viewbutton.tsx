import { useEffect, useState } from "react";
import { useNotification, usePatchData, useUserIsLogin } from "../hooks";
import { IoStatsChart } from "react-icons/io5"
import Button from "./Button";

type Props = {
    apiForView: string
    arrOfViews: string[]
    elementRef: React.MutableRefObject<HTMLElement | null>
    onLoadView: boolean
    notificationUrl: string
    notificationTitle: string
};

const Viewbutton = ({ apiForView, arrOfViews, onLoadView = false, elementRef, notificationTitle, notificationUrl }: Props) => {
    const { loginStatus: { loginUserName, sessionId } } = useUserIsLogin();
    const [views, setViews] = useState<string[]>(arrOfViews);
    const { patchData } = usePatchData();
    const notify = useNotification();

    const handleView = async (apiForView: string, sessionId: string) => {
        if (views.includes(sessionId)) return;
        const body = null;
        const response = await patchData<{ view: string }>(apiForView, body);
        const { data } = response;
        if (data) {
            setViews((pre) => pre ? [...pre, data.view] : pre);
            if (views.length === 21) {
                handleViewsNotification(views.length);
            };
            if (views.length === 41) {
                handleViewsNotification(views.length);
            };
            if (views.length === 61) {
                handleViewsNotification(views.length);
            };
            if (views.length === 81) {
                handleViewsNotification(views.length);
            };
            if (views.length === 101) {
                handleViewsNotification(views.length);
            };
        };
    };

    const handleOnMouseHover = (e: MouseEvent) => {
        if (elementRef.current &&
            elementRef.current.contains(e.target as Node) &&
            sessionId
        ) {
            setTimeout(() => {
                handleView(apiForView, sessionId);
            }, 2000);
        }
    };

    const handleViewsNotification = async (views: number) => {
        const url = '/api/notification/' + loginUserName;
        const body = {
            typeOfNotification: 'view',
            msg: `${views}+ people have viewed, ${notificationTitle}`,
            url: notificationUrl,
            notifyFrom: 'blogback',
        };

        await notify(url, body);
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
        if (onLoadView && sessionId) {
            setTimeout(() => {
                handleView(apiForView, sessionId);
            }, 2000);
        };

    }, [onLoadView, sessionId]);


    return <Button
        id="stat-btn"
        buttonClass='flex items gap-2 cursor-default'
        children={<>
            <IoStatsChart size={19} />
            {views?.length || 0}</>
        }
    />
};

export default Viewbutton;
