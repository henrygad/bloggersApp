import axios from 'axios';
import { useEffect, useState } from 'react';

const useFetchData = (url?: string | null, dependences: (string | boolean | undefined | null)[] = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async (url: string) => {

        try {
            setError('');
            setLoading(true);

            const response = await axios.get(url);
            const data = await response.data;

            if (data &&
                (data.length || Object.keys(data))
            ) {
                setData(data);
                setError('');
                setLoading(false);
            } else throw new Error('this is new error');

        } catch (error) {
            setData(null);
            setError(error.response.data.message);
            setLoading(false);
            console.error(error);

        };
    };

    useEffect(() => {
        url ?
            url.trim() !== '' && fetchData(url) :
            null;
    }, dependences);

    return { fetchData, data, error, loading };
};

export default useFetchData
