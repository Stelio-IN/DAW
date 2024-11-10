import React, { useState } from 'react';
import '../assets/style/login.css';
const LoginRegister = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  return (
    <div className="container">
    <div className="form">
      {/* Área de Login */}
      <div className="login_area">
        <p style={{ fontSize: '1.4rem' }}><b>Login into your account</b></p>
        <input type="email" name="email" id="email" required placeholder="Digite o seu e-mail..." />

        <input type="password" name="password" id="password" placeholder="Digite a sua palavra-passe..." />

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
