import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/style/login.css";
import { saveUser, getUser, clearUser } from "../../services/userStorage";
import logo from "../../assets/logo.png";

const LoginRegister = () => {
  const navigate = useNavigate();

  // CONTROLE DE TELA
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // LOGIN STATES
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // REGISTER STATES
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    setErrorMessage("");

    if (!loginEmail || !loginPassword) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3005/api/users/Entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Erro ao fazer login");
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
      setErrorMessage("Erro de conexão com o servidor.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    clearUser();
    setIsLoggedIn(false);
    setUserName(null);
    navigate("/login");
  };

  // REGISTRO
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !registerName ||
      !registerEmail ||
      !registerPassword ||
      !confirmPassword
    ) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Aceite os termos para continuar.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3005/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Erro ao criar conta");
        return;
      }

      alert("Conta criada com sucesso!");
      setShowRegister(false);

      // LIMPA FORM
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");
      setTermsAccepted(false);
    } catch (error) {
      setErrorMessage("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div className="logged_in_area">
          <p>Bem-vindo, {userName}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="login-card">
          {/* LADO ESQUERDO */}
          <div className="login-left">
            <div className="login-box">
              <img src={logo} alt="Logo" className="login-logo" />
              {!showRegister ? (
                <>
                  <h2>Acesse a sua conta</h2>

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

                  {errorMessage && <p className="error">{errorMessage}</p>}

                  <button onClick={handleLogin} className="btn-login">
                    Login 
                  </button>

                  <p
                    className="register-link"
                    onClick={() => {
                      setErrorMessage("");
                      setShowRegister(true);
                    }}
                  >
                    Ainda não tem uma conta? Registre-se aqui
                  </p>
                </>
              ) : (
                <>
                  <h2>Crie a sua nova conta</h2>

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

           <label className="terms">
  <input
    type="checkbox"
    checked={termsAccepted}
    onChange={(e) => setTermsAccepted(e.target.checked)}
  />
  Aceito os termos e política de privacidade
</label>

                  {errorMessage && <p className="error">{errorMessage}</p>}

                  <button onClick={handleRegister} className="btn-login">
                    Criar conta
                  </button>

                  <p
                    className="register-link"
                    onClick={() => {
                      setErrorMessage("");
                      setShowRegister(false);
                    }}
                  >
                    Já tem uma conta? Faça o login
                  </p>
                </>
              )}
            </div>
          </div>

          {/* LADO DIREITO */}
          <div className="login-right">
            <img
              src="../../../public/img/background1.png" // coloca tua imagem na pasta public
              alt="Login Illustration" className="imagem-direita"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
