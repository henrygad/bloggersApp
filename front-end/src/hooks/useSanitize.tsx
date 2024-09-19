import DOMPurify from "dompurify";

const useSanitize = () => {
    const sanitizeHTML = (html: string) => {
        return {
            __html: DOMPurify.sanitize(html)
        };
    };

    return sanitizeHTML;
};

export default useSanitize;
