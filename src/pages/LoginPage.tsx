import api from "../services/api";
import { useNotification } from '../context/NotificationContext'
import loginImage from '/src/assets/login-image.jpg'
import '/src/styles/LoginPage.css'
import CheckConn from '../components/checkConnection';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {

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
        navigate("/home");
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
      <div className="nav-bar">
        <span className="nav-short">BakeTec</span>
        <span className="nav-long">BakeTec - Sistema de Gestão de Pastelarias</span>
      </div>
      <div className="back-login">
        <img src={loginImage} className="login-image" alt="Login background"/>

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
            <input  className='bot-input' 
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

          <button className="register-btn">Criar Conta</button>
        </div>
      </div>
    </>
  )
}

export default LoginPage
