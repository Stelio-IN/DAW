import React, { useState } from 'react';
import '../assets/style/login.css';

const LoginRegister = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginResponse, setLoginResponse] = useState(null);

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3005/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoginResponse(data);

      if (response.ok) {
        alert('Login bem-sucedido!');
        // Adicione lógica adicional, como redirecionamento
      } else {
        alert('Falha no login: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      alert('Erro na requisição: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="form">
        {/* Área de Login */}
        <div className="login_area">
          <p style={{ fontSize: '1.4rem' }}><b>Login into your account</b></p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Digite o seu e-mail..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              name="password"
              id="password"
              placeholder="Digite a sua palavra-passe..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="caixas">
              <div>
                <input type="checkbox" id="check_remember" />
                <label htmlFor="check_remember">Lembre de mim</label>
              </div>
              <a href="/" style={{ color: 'rgb(14, 54, 54)' }}>
                <p>Esqueceu sua senha?</p>
              </a>
            </div>

            <input type="submit" name="submit" value="Logar" id="btn_logar" />
          </form>
        </div>

        {/* Área de Registro */}
        <div className="sign_in_area">
          <p style={{ fontSize: '1.4rem' }}><b>Sign up into your account</b></p>
          <p style={{ fontSize: '10pt', textAlign: 'justify', marginTop: '2px', maxWidth: '350px' }}>
            Ao se registrar você poderá aproveitar as promoções e ofertas exclusivas para membros
          </p>

          <input
            type="button"
            value="Registrar"
            id="registrar"
            onClick={handleRegisterClick}
          />

          {showRegister && (
            <div className="area_registrar">
              <input type="text" name="name" id="name" placeholder="Digite o seu nome" />
              <input type="email" name="email" id="email" required placeholder="Digite o seu email" />
              <input type="password" name="password" id="password" required placeholder="Digite a sua palavra-passe" />
              <input type="password" name="confirm_password" id="confirm_password" required placeholder="Confirme a sua palavra-passe" />

              <div className="boxes">
                <input
                  type="checkbox"
                  id="check"
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                />
                <label htmlFor="check">Eu aceito os termos de uso e política de privacidade.</label>
              </div>

              <input
                type="submit"
                name="submit"
                value="Registrar"
                id="btn_registrar"
                disabled={!termsAccepted}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
