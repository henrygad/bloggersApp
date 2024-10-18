import axios from 'axios';
import { useState } from 'react';

const usePatchData = <T,>() => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const patchData = async (url: string, body: {} | [] | string | null | undefined) => {

        try {
            setLoading(true);
            setError('');

            const response = await axios.patch(url, body);
            const data: T = await response.data;

            if (data) {

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

    return { patchData, loading, error };
};

export default usePatchData;
