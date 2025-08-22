import { createContext } from "react";

interface AuthContextTypes {
    isAuth: boolean,
    setIsAuth: (auth: boolean) => void;
    balance: number;
    setBalance: (balance: number) => void;
}

export const AuthContext = createContext<AuthContextTypes>({
    isAuth: false,
    setIsAuth: () => { },
    balance: 0.00,
    setBalance: () => { }
})

