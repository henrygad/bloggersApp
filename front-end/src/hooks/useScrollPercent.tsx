import { useEffect } from "react";

const useScrollPercent = (callBack: (getScrollPercent: number) => void) => {

    const handleOnScroll = () => {
        const scrollTop = window.scrollY; // Distance scrolled from the top
        const docHeight = document.documentElement.scrollHeight; // Total scrollable height (the document height)
        const winHeight = window.innerHeight; // Height of the viewport or device screen
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100; // percentage of the distance scrolled from the top
        //callBack(scrollPercent);
    };

    useEffect(() => {
        document.addEventListener('scroll', handleOnScroll);
        return () => {
            document.removeEventListener('scroll', handleOnScroll);
        };
    }, []);
};

export default useScrollPercent;
