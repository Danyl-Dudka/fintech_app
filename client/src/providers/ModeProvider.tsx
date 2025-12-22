import { useState, type ReactNode } from "react";
import { AppModeContext } from "../content";
import type { AppMode } from "../components/types";

export default function ModeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<AppMode>(() => {
        return (sessionStorage.getItem('mode') as AppMode) || 'finance';
    });

    const setMode = (newMode: AppMode) => {
        sessionStorage.setItem('mode', newMode);
        setModeState(newMode)
    }

    return (
        <AppModeContext.Provider value={{ mode, setMode }}>
            {children}
        </AppModeContext.Provider>
    )
}

