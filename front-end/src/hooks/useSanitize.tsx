import DOMPurify from "dompurify";
import he from 'he';

const useSanitize = () => {

    const sanitizeHTML = (htmlString: string) => {
        const sanitizedHtml = DOMPurify.sanitize(htmlString);
        const decodeString = he.decode(sanitizedHtml);

        return {
            __html: decodeString
        };
    };

    return sanitizeHTML;
};

export default useSanitize;
