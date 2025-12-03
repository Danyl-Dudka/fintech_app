import { useEffect, useState } from "react";
import { ThemeContext } from "../content";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState(() => sessionStorage.getItem('token'));
    const isLoggedIn = Boolean(token);
    const [theme, setTheme] = useState(() => {
        return isLoggedIn
            ? localStorage.getItem('theme') || 'light'
            : 'dark'
    })

    useEffect(() => {
        const interval = setInterval(() => {
            const current = sessionStorage.getItem('token');
            if (current !== token) {
                setToken(current);
            }
        }, 200);

        return () => clearInterval(interval)
    }, [token]);

    useEffect(() => {
        if (!isLoggedIn) {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            return;
        }

        localStorage.setItem('theme', theme);

        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme)
    }, [theme, isLoggedIn])

    const toggleTheme = () => {
        if (!isLoggedIn) {
            return;
        }

        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    return (
        <ThemeContext.Provider value={{theme, setTheme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )


}