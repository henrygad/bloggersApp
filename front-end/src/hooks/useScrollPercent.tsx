import { useEffect, useState } from "react";

const useScrollPercent = () => {
    const  [scrollPercent, setScrollPercent] = useState(1);

    const handleOnScroll = () => {
        const scrollTop = window.scrollY; // Distance scrolled from the top
        const docHeight = document.documentElement.scrollHeight; // Total scrollable height (the document height)
        const winHeight = window.innerHeight; // Height of the viewport or device screen
        setScrollPercent(Math.floor((scrollTop / (docHeight - winHeight)) * 100)) // percentage of the distance scrolled from the top
    };

    useEffect(() => {
        document.addEventListener('scroll', handleOnScroll);
        return () => {
            document.removeEventListener('scroll', handleOnScroll);
        };
    }, []);

    return {scrollPercent};
};

export default useScrollPercent;
