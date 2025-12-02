import { useEffect, useState } from "react";
import { ThemeContext } from "../content";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);

        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme)
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}