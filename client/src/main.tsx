import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthProvider from './providers/AuthProvider.tsx';
import ThemeProvider from './providers/ThemeProvider.tsx';
import ModeProvider from './providers/ModeProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <ThemeProvider>
            <ModeProvider>
                <App />
            </ModeProvider>
        </ThemeProvider>
    </AuthProvider>
);
