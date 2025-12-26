import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/style/login.css';

const LoginRegister = () => {
  const navigate = useNavigate();

  const [showRegister, setShowRegister] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const [userName, setUserName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');
    if (storedName && token) {
      setUserName(storedName);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/api/users/Entrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', data.user.tipo_usuario);
      localStorage.setItem('userId', data.user.user_id);
      localStorage.setItem('userName', data.user.username);

      setUserName(data.user.username);
      setIsLoggedIn(true);

      navigate(data.user.tipo_usuario === 'admin' ? '/admin' : '/');
    } catch {
      setErrorMessage('Erro de conexão.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Aceite os termos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
        return;
      }

      alert('Conta criada com sucesso!');
      setShowRegister(false);
    } catch {
      setErrorMessage('Erro de conexão.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName(null);
    navigate('/login');
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        <div className="logged_in_area">
          <p>Bem-vindo, {userName}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="form">
          <div className="login_area">
            <h3>Login</h3>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <button id="btn_logar" onClick={handleLogin}>Entrar</button>
            <p onClick={() => setShowRegister(true)} style={{ cursor: 'pointer' }}>
              Criar conta
            </p>
          </div>

          {showRegister && (
            <div className="sign_in_area">
              <h3>Registro</h3>
              <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Nome de usuário" />
              <input value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              <label>
                <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
                Aceito os termos
              </label>
              <button id="btn_registrar" disabled={!termsAccepted} onClick={handleRegister}>
                Criar conta
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
