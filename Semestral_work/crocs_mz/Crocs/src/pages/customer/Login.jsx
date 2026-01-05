import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/style/login.css';
import { saveUser, getUser, clearUser } from "../../services/userStorage";

const LoginRegister = () => {
  const navigate = useNavigate();

  // CONTROLE DE TELA
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // LOGIN STATES
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // REGISTER STATES
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // VERIFICA LOGIN SALVO
  

  useEffect(() => {
  const user = getUser();
  if (user?.token) {
    setIsLoggedIn(true);
    setUserName(user.username);
  }
}, []);


  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/api/users/Entrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Erro ao fazer login');
        return;
      }

     saveUser({
  token: data.token,
  user_id: data.user.user_id,
  username: data.user.username,
  email: data.user.email,
  tipo_usuario: data.user.tipo_usuario,
});

setUserName(data.user.username);
setIsLoggedIn(true);

navigate(data.user.tipo_usuario === "admin" ? "/admin" : "/");

    } catch (error) {
      setErrorMessage('Erro de conexão com o servidor.');
    }
  };

  // LOGOUT
  const handleLogout = () => {
     clearUser();
    setIsLoggedIn(false);
    setUserName(null);
    navigate('/login');
  };

  // REGISTRO
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    if (registerPassword !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Aceite os termos para continuar.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Erro ao criar conta');
        return;
      }

      alert('Conta criada com sucesso!');
      setShowRegister(false);

      // LIMPA FORM
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setConfirmPassword('');
      setTermsAccepted(false);
    } catch (error) {
      setErrorMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        <div className="logged_in_area">
          <p>Bem-vindo, {userName}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="form">
          {/* LOGIN */}
          <div className="login_area">
            <p><b>Login into your account</b></p>

            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Digite o seu e-mail"
            />

            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Digite a sua palavra-passe"
            />

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <input
              type="submit"
              value="Logar"
              id="btn_logar"
              onClick={handleLogin}
            />

            <p
              style={{ cursor: 'pointer' }}
              onClick={() => setShowRegister(true)}
            >
              Criar uma nova conta
            </p>
          </div>

          {/* REGISTRO */}
          {showRegister && (
            <div className="sign_in_area">
              <p><b>Sign up into your account</b></p>

              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Digite o seu nome"
              />

              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Digite o seu email"
              />

              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Digite a sua palavra-passe"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a palavra-passe"
              />

              <label>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                /> Aceito os termos
              </label>

              <input
                type="submit"
                value="Criar nova conta"
                id="btn_registrar"
                onClick={handleRegister}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
