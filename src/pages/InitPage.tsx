import '/src/styles/LoginPage.css'
import LoginForm from "../components/LoginForm";
import RegisterForm from '../components/RegisterForm';
import { useState } from 'react';

type Mode = "login" | "register";

const InitPage: React.FC = () => {

    const [mode, setMode] = useState<Mode>("login");

    return (
        <>
            <div className="nav-bar">
                <span className="nav-short">BakeTec</span>
                <span className="nav-long">BakeTec - Sistema de Gestão de Pastelarias</span>
            </div>
            <div className='init-container'>
                {mode === "login" ? (
                    <LoginForm onSwitch={(m: Mode) => setMode(m)} />
                ) : (
                    <RegisterForm onSwitch={(m: Mode) => setMode(m)} />
                )}
            </div>
      </>
    )
}

export default InitPage
