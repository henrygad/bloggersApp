import axios from 'axios';
import { useState } from 'react';

const usePostData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const postData = async <T,>(url: string, body: {} | [] | string | null | undefined) => {
        let data: T | null = null;
        let ok = false;

        try {
            setLoading(true);
            setError('');

            const res = await axios.post(url, body);

            if (res.data &&
                Object.keys(res.data)) {
                setError('');
                setLoading(false);

                data = res.data;
                ok = true
            };

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

            data = null;
            ok = true;
        };

        return { data, ok, };
    };

    return { postData, loading, error };
};

export default usePostData;
