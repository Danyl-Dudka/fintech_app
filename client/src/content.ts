import { createContext } from "react";

interface AuthContextTypes {
    isAuth: boolean,
    setIsAuth: (auth: boolean) => void;
    balance: number;
    setBalance: (balance: number) => void;
    userId: string | null;
    setUserId: (user: string | null) => void;
}

export const AuthContext = createContext<AuthContextTypes>({
    isAuth: false,
    setIsAuth: () => { },
    balance: 0.00,
    setBalance: () => { },
    userId: null,
    setUserId: () => { }
})

