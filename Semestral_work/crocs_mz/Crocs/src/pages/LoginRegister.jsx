import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/style/login.css';
const LoginRegister = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate(); // Para redirecionamento de rotas

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  // Função para fazer o login
 // Função para fazer o login
const handleLogin = async (e) => {
  e.preventDefault(); // Previne o comportamento padrão do formulário

  // Verificação básica
  if (!email || !password) {
    setErrorMessage('Por favor, preencha todos os campos.');
    return;
  }

  const loginData = { email, password };

  try {
    const response = await fetch('http://localhost:3005/api/users/Entrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (response.ok) {
      // Armazene os dados do usuário no localStorage
      localStorage.setItem('token', data.token); // Salva o token
      localStorage.setItem('userType', data.user.tipo_usuario); // Tipo de usuário (comum ou admin)
      localStorage.setItem('userId', data.user.id); // ID do usuário

      // Armazenar dados adicionais (exemplo: nome do usuário)
      localStorage.setItem('userName', data.user.nome); // Salva o nome do usuário
  

      // Redirecionamento conforme o tipo de usuário
      if (data.user.tipo_usuario === 'comum') {
        navigate('/'); // Redireciona para a página principal se o usuário for comum
      } else if (data.user.tipo_usuario === 'admin') {
        navigate('/admin'); // Redireciona para a página do admin se for admin
      }
    } else {
      setErrorMessage(data.message || 'Erro ao fazer login');
    }
  } catch (error) {
    console.error('Erro de conexão:', error);
    setErrorMessage('Erro de conexão. Tente novamente mais tarde.');
  }
};


  // Função para fazer o registro
  const handleRegister = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Você deve aceitar os termos e condições.');
      return;
    }

    const registerData = { name, email, password };

    try {
      const response = await fetch('http://localhost:3005/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        setErrorMessage('');
        alert('Conta criada com sucesso!');
        setShowRegister(false); // Volta para o login após sucesso
      } else {
        setErrorMessage(data.message || 'Erro ao criar conta');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setErrorMessage('Erro de conexão. Tente novamente mais tarde.');
    }
  };
  return (
    <div className="container">
      <div className="form">
        {/* Área de Login */}
        <div className="login_area">
          <p style={{ fontSize: '1.4rem' }}>
            <b>Login into your account</b>
          </p>
          <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Digite o seu e-mail..."
            />

<input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a sua palavra-passe..."
            />
{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <div className="caixas">
            <div>
            <input
                  type="submit"
                  name="submit"
                  value="Logar"
                  id="btn_logar"
                  onClick={handleLogin}
                />
            </div>
            <a href="/" style={{ color: 'rgb(14, 54, 54)' }}>
              <p>Esqueceu sua senha?</p>
            </a>
            <div>
                <p style={{ cursor: 'pointer', color: 'rgb(0, 0, 0)' }} onClick={handleRegisterClick}>
                  Criar uma nova conta
                </p>
              </div>
          </div>

          
        </div>

        {/* Área de Registro */}
         {showRegister && (
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o seu nome"
              />
              <input
                type="email"
                name="email"
                id="register_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Digite o seu email"
              />
              <input
                type="password"
                name="password"
                id="register_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite a sua palavra-passe"
              />
              <input
                type="password"
                name="confirm_password"
                id="register_confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  onClick={handleRegister}
                />
            </div>  
            </div>

          
        
        </div>
               )}
      </div>
    </div>
  );
};

export default LoginRegister;
