import { AuthContext } from "../content";
import { useEffect, useState, type ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuth, setIsAuth] = useState(false);
    const [balance, setBalance] = useState(0.00);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userId');
        if (token) {
            setIsAuth(true)
            setUserId(userId)
        }
    }, [])
    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, balance, setBalance, userId, setUserId }}>
            {children}
        </AuthContext.Provider>
    )
}
