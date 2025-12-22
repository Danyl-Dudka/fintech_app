import { createContext } from "react";
import type { AppMode } from "./components/types";

interface AuthContextTypes {
    isAuth: boolean,
    setIsAuth: (auth: boolean) => void;
    balance: number;
    setBalance: (balance: number) => void;
    userId: string | null;
    setUserId: (user: string | null) => void;
};

interface ThemeContextTypes {
    theme: string;
    setTheme: (theme: string) => void;
    toggleTheme: () => void;
}

interface AppModeContextType {
    mode: AppMode;
    setMode: (mode: AppMode) => void;

}


export const AuthContext = createContext<AuthContextTypes>({
    isAuth: false,
    setIsAuth: () => { },
    balance: 0.00,
    setBalance: () => { },
    userId: null,
    setUserId: () => { }
})


export const ThemeContext = createContext<ThemeContextTypes>({
    theme: 'dark',
    setTheme: () => { },
    toggleTheme: () => { },
})


export const AppModeContext = createContext<AppModeContextType>({
    mode: 'finance',
    setMode: () => { },
})