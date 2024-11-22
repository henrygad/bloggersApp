import { useEffect, useState } from "react";

const useTrimWords = (words: string, numOfWordsToDisplay: number) => {
    const [trimedWords, setTrimedWords] = useState('');
    const [totalNumOfWords, setTotalNumOfWords] = useState(0);

    const trimWords = (words: string, numOfWordsToDisplay: number) => {
        const rawText = words
            .split(' ')
            .map((text, index) => {
                if (index < numOfWordsToDisplay) {
                    return text;
                } else {
                    return;
                };
            });

        setTrimedWords(rawText.join(' '));
        setTotalNumOfWords(rawText.length);
    };

    useEffect(() => {
        if(words.trim() && numOfWordsToDisplay){
            trimWords(words, numOfWordsToDisplay);
        };
    }, []);

    return {
        updateNoOfWwords: (updatedNumOfWords: number) => trimWords(words, updatedNumOfWords),
        trimedWords,
        totalNumOfWords
    };
};

export default useTrimWords;
