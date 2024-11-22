import { useEffect, useState } from 'react'

const useChangeMode = (theme: string, initialMode: string = 'light') => {
    const [mode, setMode] = useState<string>(() => {
        try {
            return JSON.parse(localStorage.getItem(theme) || initialMode)
        } catch (error) {
            return initialMode
        }
    });
    const handleToggleTheme = () => {
        setMode((pre) => pre === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        localStorage.setItem(theme, JSON.stringify(mode));
    }, [mode]);

    return { mode, handleToggleTheme };
};

export default useChangeMode;
