import { AuthContext } from "../content";
import { useEffect, useState, type ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuth, setIsAuth] = useState(false);
    const [balance, setBalance] = useState(0.00);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsAuth(true)
        }
    }, [])
    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, balance, setBalance }}>
            {children}
        </AuthContext.Provider>
    )
}
