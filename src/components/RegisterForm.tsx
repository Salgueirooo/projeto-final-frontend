import api from "../services/api";
import { useToastNotification } from '../context/NotificationContext'
import loginImage from '/src/assets/login-image.jpg'
import '/src/styles/LoginPage.css'
import { useState } from 'react';

type Mode = "login" | "register";

interface Props {
  onSwitch: (mode: Mode) => void;
}

const RegisterForm: React.FC<Props> = ({ onSwitch }) => {

    const [name, setName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { addToastNotification: addNotification } = useToastNotification();

    const [loading, setLoading] = useState(false);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setLoading(true)
            await api.post("/auth/register-client", { name, email, password, phone_number });

            addNotification("Conta criada.", false);
            onSwitch("login");

        } catch (err: any) {
            if(err.response) {
                console.error(err.response.data);
                addNotification(err.response.data, true);
            }
            else {
                console.error(err);
                addNotification("Erro ao criar a conta.", true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="back-login">
                <img src={loginImage} className="login-image" alt="Login background" />

                <div className="login-box">
                    <h2>Criar Conta</h2>
                    <div className='line'></div>

                    <form className="login-form" onSubmit={handleRegister}>
                        <input className='top-input'
                            type="text"
                            id="name"
                            placeholder='Nome (Primeiro e Último)'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="tel"
                            id="phoneNumber"
                            placeholder='N.º Telemóvel'
                            minLength={9}
                            maxLength={9}
                            value={phone_number}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                        <input
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
                            minLength={8}
                            maxLength={12}
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">
                            {loading ? (<div className="spinner"></div>) : (<>Criar Conta</>)}
                            
                            </button>
                    </form>

                    <div className='separator'>
                        <div className="line"></div>
                        <span>OU</span>
                        <div className="line"></div>
                    </div>

                    <button className="register-btn" onClick={() => onSwitch("login")}>
                        Iniciar Sessão
                    </button>
                </div>
            </div>
        </>
    )
}

export default RegisterForm;
