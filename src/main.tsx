import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '/src/styles/index.css'
import App from "./App"
import { NotificationProvider } from "./context/NotificationContext";
import { BrowserRouter } from 'react-router-dom';
import { NotificationStoreProvider } from './context/NotificationStoreContext';
import { AuthProvider } from './context/AuthProvider';

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <NotificationStoreProvider>
                    <NotificationProvider>
                        <App />
                    </NotificationProvider>
                </NotificationStoreProvider>
            </AuthProvider>
        </BrowserRouter>
    
    /* </StrictMode> */
)
