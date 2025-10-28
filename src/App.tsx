import { useState } from 'react'
import loginImage from '/login-image.jpg'
import './App.css'

function App() {

  return (
    <>
      <div className='nav-bar'>BakeTec</div>
      <div className="back-login">
        <img src={loginImage} className="login-image" alt="Login background" />

        {/* Área centralizada para login */}
        <div className="login-box">
          {/* Aqui depois entram os campos */}
          <h2>Entrar</h2>
        </div>
      </div>
      
        
        
      
    </>
  )
}

export default App
