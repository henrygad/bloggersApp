import axios from 'axios';
import { useEffect, useState } from 'react';

const useFetchData = <T,>(url: string | null = '', dependences: any[] = []) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async (url: string) => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.get(url);
            const data: T = await response.data;

            if (data ||
                (data && Object.keys(data))
            ) {

                setData(data);
                setError(' ');
                setLoading(false);

                return { ok: true, data, loading: false, error: ''};

            } else throw new Error('this is new error');

        } catch (_error) {

            const error = _error as {
                response: {
                    data: {
                        message: string
                    }
                }
            };

            setData(null);
            setError(error.response.data.message);
            setLoading(false);
            console.error(error);

            return { ok: true, data: null, loading: false, error: error.response.data.message };
        };

    };

    useEffect(() => {
       if(url){
        fetchData(url);
       }
    }, dependences);

    return { fetchData, data, error, loading };
};

export default useFetchData

