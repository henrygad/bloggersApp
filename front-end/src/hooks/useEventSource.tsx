import { useEffect, useState } from "react";


const useEventSource = <T,>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchData = (url: string) => {

        setLoading(true);
        setError('');

        const eventSource = new EventSource('https://localhost:3000' + url);
        eventSource.onmessage = (event) => {
            const data: T = JSON.parse(event.data)
            setData(data);
            setLoading(false);
            setError('');
        }
        eventSource.onerror = (error) => {
            setData(null);
            setLoading(false);
            setError('Error: an error occured while streaming');
            console.error(error);
            eventSource.close();
        }

        return () => {
            eventSource.close();
        };

    };

    useEffect(() => {
        if (!url.trim()) return;
        fetchData(url);
    }, [url]);

    return { fetchData, data, error, loading };
};

export default useEventSource;
