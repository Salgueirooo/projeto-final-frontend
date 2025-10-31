import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '/src/styles/index.css'
// import LoginPage from './pages/LoginPage.tsx'
import App from "./App"
import { NotificationProvider } from "./context/NotificationContext";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
