import api from "../services/api";
import { useNotification } from '../context/NotificationContext'
import loginImage from '/src/assets/login-image.jpg'
import '/src/styles/LoginPage.css'
import CheckConn from './CheckConnection';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Mode = "login" | "register";

interface Props {
  onSwitch: (mode: Mode) => void;
}

const LoginForm: React.FC<Props> = ({ onSwitch }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await api.post("/auth/login", { email, password });

            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token);
                addNotification("Autenticado com sucesso.", false);
                navigate("/select-bakery");
            } else {
                console.error("Erro: Token não encontrado");
            }
        } catch (err) {
            console.error(err);
            addNotification("Utilizador ou palavra-passe incorretos.", true);
        }
    };

    return (
        <>
            <div className="back-login">
                <img src={loginImage} className="login-image" alt="Login background" />

                <div className="login-box">
                    <h2>Iniciar Sessão</h2>
                    <div className='line'></div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <input className='top-input'
                            type="email"
                            id="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input className='bot-input'
                            type="password"
                            id="password"
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Iniciar Sessão</button>
                    </form>

                    <div className='separator'>
                        <div className="line"></div>
                        <span>OU</span>
                        <div className="line"></div>
                    </div>

                    <button className="register-btn" onClick={() => onSwitch("register")}>
                        Criar Conta
                    </button>
                </div>
                <CheckConn />
            </div>
        </>
    )
}

export default LoginForm;