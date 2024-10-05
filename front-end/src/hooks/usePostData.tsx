import axios from 'axios';
import { useState } from 'react';

const usePostData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const postData = async <T,>(url: string, body: {} | [] | string | null | undefined) => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.post(url, body);
            const data: T = await response.data;

            if (data &&
                (Object.keys(data))
            ) {
                setError('');
                setLoading(false);
                return { data: data, ok: true };
            } else throw new Error('this is new error');
            
        } catch (_error) {
            const error = _error as {
                response: {
                    data: {
                        message: string
                    }
                }
            };
            console.error(error);
            setError(error.response.data.message);
            setLoading(false);
            return { data: null, ok: false };
        };
    };
    
    return { postData, loading, error };
};

export default usePostData;
