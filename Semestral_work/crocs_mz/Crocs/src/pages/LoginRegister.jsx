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
      <div>
        <p  style={{ marginTop: '100px' }}>aaaaaaa</p>
      </div>
      <div className="form">
        {/* Área de Login */}
        <div className="login_area">
          <p style={{ fontSize: '1.4rem' }}>
            <b>Login into your account</b>
          </p>
          <input  type="email"  name="email"  id="email" required  placeholder="Digite o seu e-mail..."
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Digite a sua palavra-passe..."
          />

          <div className="caixas">
            <div>
            <input type="submit" name="submit" value="Logar" id="btn_logar" />
            </div>
            <a href="/" style={{ color: 'rgb(14, 54, 54)' }}>
              <p>Esqueceu sua senha?</p>
            </a>
          </div>

          
        </div>

        {/* Área de Registro */}
        <div className="sign_in_area">
          <p style={{ fontSize: '1.4rem' }}>
            <b>Sign up into your account</b>
          </p>
          <p
            style={{
              fontSize: '10pt',
              textAlign: 'justify',
              marginTop: '2px',
              maxWidth: '350px',
            }}
          >
            Ao se registrar você poderá aproveitar as promoções e ofertas exclusivas
            para membros
          </p>


            <div className="area_registrar">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Digite o seu nome"
              />
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Digite o seu email"
              />
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="Digite a sua palavra-passe"
              />
              <input
                type="password"
                name="confirm_password"
                id="password"
                required
                placeholder="Confirme a sua palavra-passe"
              />

            <div className="registro_condicao">
              <div className="boxes">
                  <div>
                    <input
                      type="checkbox"
                      id="check"
                      checked={termsAccepted}
                      onChange={handleTermsChange}
                    />
                  </div>

                  <label htmlFor="check" style={{ color: 'rgb(0, 0, 0)' }}>
                    Eu aceito os termos de uso e política de privacidade.
                  </label>
                </div>
                <input
                  type="submit"
                  name="submit"
                  value="Criar nova conta"
                  id="btn_registrar"
                  disabled={!termsAccepted}
                />
            </div>  
            </div>

          
        
        </div>
       
      </div>
    </div>
  );
};

export default LoginRegister;
