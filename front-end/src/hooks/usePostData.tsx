import axios from 'axios';
import { useState } from 'react';

const usePostData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const postData = async (url: string, body: {} | [] | string | null | undefined) => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.post(url, body);
            const data = await response.data;

            if (data &&
                (data.length || Object.keys(data))
            ) {
                setError('');
                setLoading(false);
                return { data: data, ok: true };
            } else throw new Error('this is new error');
            
        } catch (error) {
            console.error(error);
            setError(error.response.data.message);
            setLoading(false);
            return { data: '', ok: false };
        };
    };

    return { postData, loading, error };
};

export default usePostData;
