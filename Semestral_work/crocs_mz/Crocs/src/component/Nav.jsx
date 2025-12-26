import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../assets/style/menu.css";
import LogoCrocs from "../assets/img/crocs_logo.webp";
import navImg1 from "../assets/img/pose3.webp";
import navImg2 from "../assets/img/pose1.webp";
import navImg3 from "../assets/img/pose2.webp";

import { FiArrowLeft, FiHeart } from "react-icons/fi";
import { FaHeart, FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext.jsx";

const Navbar = () => {
  const { favorites } = useFavorites(); // Hook para acessar favoritos
  const [cartItemCount, setCartItemCount] = useState(0);
  const [userName, setUserName] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // ===========================
  // Puxar usuário logado e atualizar carrinho
  // ===========================
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    if (storedName && token) {
      setUserName(storedName);
      setIsLoggedIn(true);
    }
  }, []);

  // Atualiza usuário logado e carrinho sempre que muda de rota
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const token = localStorage.getItem("token");
    setUserName(storedName);
    setIsLoggedIn(!!token);

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemCount = storedCart.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );
    setCartItemCount(itemCount);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav>
      <div className="wrapper">
        <div className="logo">
          <Link to="/">
            <span
              style={{
                color: "rgb(0, 0, 0)",
                fontSize: "28pt",
                fontWeight: "bold",
                letterSpacing: '0.01em',
                lineHeight: '90%',
              }}
            >
              Crocs<sup style={{ fontSize: "0.5rem" }}>TM</sup>
            </span>
          </Link>
        </div>

        <input type="radio" name="slide" id="menu-btn" />
        <input type="radio" name="slide" id="cancel-btn" />
        <ul className="nav-links">
          <label htmlFor="cancel-btn" className="btn cancel-btn" onClick={toggleMenu}>
            &times;
          </label>

          <li id="li">
            <Link to="/" className="active">Home</Link>
          </li>

          <li id="li">
            <Link to="#" className="desktop-item">Novo</Link>
            <input type="checkbox" id="showDrop" />
            <label htmlFor="showDrop" className="mobile-item">Novo</label>
            <ul className="drop-menu">
              <li><Link to="/loja?gender=2">Homem</Link></li>
              <li><Link to="/loja?gender=3">Mulher</Link></li>
              <li><Link to="/loja?gender=4">Unissex</Link></li>
            </ul>
          </li>

          <li id="li">
            <Link to="#" className="desktop-item">Homem</Link>
            <input type="checkbox" id="showMega" />
            <label htmlFor="showMega" className="mobile-item">Homens</label>
            <div className="mega-box">
              <div className="back-button">
                <FiArrowLeft size={30} style={{margin: '20px'}} onClick={() => document.getElementById("showMega").checked = false}/>
              </div>
              <div className="content">
                <div className="row">
                  <img id="logoimg" src={LogoCrocs} alt="Crocs Logo" />
                </div>
                <div className="row">
                  <ul className="mega-links">
                    <h3>Por tendencia</h3>
                    <li><Link to="#">Novos clássicos</Link></li>
                    <li><Link to="#">Impressão camuflada</Link></li>
                    <li><Link to="#">Equipes esportivas</Link></li>
                    <li><Link to="#">Aventuras ao ar livre</Link></li>
                    <li><Link to="#">Recuperação</Link></li>
                    <li><Link to="#">Novos clássicos</Link></li>
                  </ul>
                </div>
                <div className="row">
                  <ul className="mega-links">
                    <h3>Clássicos</h3>
                    <li><Link to="#">Jibbitz</Link></li>
                    <li><Link to="#">Grande</Link></li>
                    <li><Link to="#">Alto (14+)</Link></li>
                    <li><Link to="#">Tênis</Link></li>
                    <li><Link to="#">Botas</Link></li>
                    <li><Link to="#">Jibbitz</Link></li>
                  </ul>
                </div>
                <div className="row">
                  <ul className="mega-links">
                    <img src={navImg1} alt="Promo" />
                    <button>Ver Oferta</button>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li id="li">
            <Link to="#" className="desktop-item">Mulher</Link>
            <input type="checkbox" id="showMegaM" />
            <label htmlFor="showMegaM" className="mobile-item">Mulheres</label>
            <div className="mega-box">
              <div className="back-button">
                <FiArrowLeft size={30} style={{margin: '20px'}} onClick={() => document.getElementById("showMegaM").checked = false}/>
              </div>
              <div className="content">
                <div className="row">
                  <ul className="mega-links">
                    <h3>Por Estilo</h3>
                    <li><Link to="/tamancos">Tamancos</Link></li>
                    <li><Link to="/sandalias">Sandálias</Link></li>
                    <li><Link to="/sandalias-de-dedo">Sandálias de dedo</Link></li>
                    <li><Link to="/plataformas-e-cunhas">Plataforma e Cunhas</Link></li>
                  </ul>
                </div>
                <div className="row">
                  <ul className="mega-links">
                    <h3>Por Estilo</h3>
                    <li><Link to="/tamancos">Tamancos</Link></li>
                    <li><Link to="/sandalias">Sandálias</Link></li>
                    <li><Link to="/sandalias-de-dedo">Sandálias de dedo</Link></li>
                    <li><Link to="/plataformas-e-cunhas">Plataforma e Cunhas</Link></li>
                    <li><Link to="/apartamentos">Apartamentos</Link></li>
                    <li><Link to="/tamancos">Tamancos</Link></li>
                    <li><Link to="/sandalias">Sandálias</Link></li>
                    <li><Link to="/sandalias-de-dedo">Sandálias de dedo</Link></li>
                  </ul>
                </div>
                <div className="row">
                  <ul className="mega-links">
                    <li>
                      <Link to="/oferta1">
                        <img src={navImg2} alt="" />
                      </Link>
                      <button>Ver Oferta</button>
                    </li>
                  </ul>
                </div>
                <div className="row">
                  <ul className="mega-links">
                    <li>
                      <Link to="/oferta2">
                        <img src={navImg3} alt="" />
                      </Link>
                      <button>Ver Oferta</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>

          <li id="li"><Link to="/loja">Loja</Link></li>
          <li id="li"><Link to="/sobre-nos">About us</Link></li>

          <li id="li_login">
            <Link to="/login">
              <button id="botao_login">Login</button>
            </Link>
            <input type="search" id="botao_pesquisa" placeholder="Pesquise aqui" />
          </li>
        </ul>

        {/* =========================== */}
        {/* Botões do usuário, favoritos e carrinho */}
        {/* =========================== */}
        <div className="Componentes">

          {/* Botão do usuário logado */}
          <button
            style={{
              display: isLoggedIn ? "inline-block" : "none",
              backgroundColor: "#f0c040",
              border: "none",
              padding: "8px 16px",
              borderRadius: "12px",
              marginRight: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {userName}
          </button>

          {isLoggedIn && (
            <button
              className="btn_logout"
              onClick={handleLogout}
              style={{
                marginRight: "10px",
                padding: "8px 16px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "#f44336",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}

          {!isLoggedIn && (
            <Link to="/login">
              <input type="button" className="btn_login" value="Login" />
            </Link>
          )}

          <Link to="/favoritos">
            <FaHeart size={23} className="btn_favorite" />
          </Link>
          {favorites.length > 0 && <span>{favorites.length}</span>}

          <Link
            to="/carrinho"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              padding: "4px 14px",
              borderRadius: "80px",
              transition: "box-shadow 0.3s",
            }}
          >
            <FaShoppingCart size={23} className="btn_carrinho" style={{ marginTop: "-15px" }} />
            {cartItemCount > 0 && <span>{cartItemCount}</span>}
          </Link>

          <Link to="/minhasCompras">
            <FaShoppingBag className="btn_sexto" size={23} />
          </Link>

          <input
            type="search"
            className="btn_pesquisa"
            placeholder="Pesquise aquii"
          />
        </div>

        <label htmlFor="menu-btn" className="btn menu-btn" onClick={toggleMenu}>
          &#9776;
          <i className="bx bx-menu"></i>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;
