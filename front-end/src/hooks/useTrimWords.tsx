import { useEffect, useState } from "react";

const useTrimWords = (words: string, numOfWords: number) => {
    const [trimedWords, setTrimedWords] = useState('');
    const [trimedWordsDone, setTrimedWordsDone] = useState(false);

    const trimWords = (words: string, numOfWords: number) => {
        const rawText = words.split(' ')
            .map((text, index) => {
                if (index < numOfWords) {
                    return text;
                } else {
                    return;
                };
            });

        const newText = rawText.join(' ');

        setTrimedWords(newText);
        setTrimedWordsDone(() => numOfWords >= rawText.length);
    };

    useEffect(() => {
        words.trim() &&
            numOfWords && trimWords(words, numOfWords);
    }, []);

    return {
        trimWords: (updatedNumOfWords: number) => trimWords(words, updatedNumOfWords),
        trimedWords,
        trimedWordsDone
    };
};

export default useTrimWords;
