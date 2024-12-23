import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/menu.css';
import LogoCrocs from '../assets/img/crocs_logo.webp';
import navImg1 from '../assets/img/pose3.webp';
import navImg2 from '../assets/img/pose1.webp';
import navImg3 from '../assets/img/pose2.webp';

import { FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useFavorites } from '../context/FavoritesContext.jsx';

const Navbar = () => {
  const { favorites } = useFavorites(); // Hook para acessar favoritos
  const [cartItemCount, setCartItemCount] = useState(0);

  // Atualiza a contagem do carrinho com base no localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const itemCount = storedCart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartItemCount(itemCount);
    };

    updateCartCount();

    // Escutando alterações no localStorage (opcional, para garantir reatividade)
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);


  return (
    <nav>
      <div className="wrapper">
        <div className="logo">
          <Link to="/">
            <span style={{ color: 'rgb(7, 79, 37)', fontWeight: 'bold', fontSize: '25pt' }}>
              Crocs<sup style={{ fontSize: '0.5rem' }}>TM</sup>
            </span>
            {/* <img src={LogoCrocs} alt="Logo" className="logo-img" /> */}
          </Link>
        </div>

        <div className="Componentes_2">
          <input type="search" className="btn_pesquisa" placeholder="Search" style={{ margin: '5px' }} />
          <Link to="/login">
            <input type="button" className="btn_login" value="Login" style={{ margin: '5px' }} />
          </Link>
        </div>

        <input type="radio" name="slide" id="menu-btn" />
        <input type="radio" name="slide" id="cancel-btn" />
        <ul className="nav-links">
          <label htmlFor="cancel-btn" className="btn cancel-btn">
            <i className='bx bx-x'></i>
          </label>

          <li>
            <Link to="/" className="active">Home</Link>
          </li>

          <li>
            <Link to="#" className="desktop-item">Novo</Link>
            <input type="checkbox" id="showDrop" />
            <label htmlFor="showDrop" className="mobile-item">Novo</label>
            <ul className="drop-menu">
              <li><Link to="/sobre-nos">Homem</Link></li>
              <li><Link to="#">Mulher</Link></li>
              <li><Link to="#">Crianças</Link></li>
            </ul>
          </li>

          <li>
            <Link to="#" className="desktop-item">Homem</Link>
            <input type="checkbox" id="showMega" />
            <label htmlFor="showMega" className="mobile-item">Produtos +</label>
            <div className="mega-box">
              <div className="content">
                <div className="row">
                  <img src={LogoCrocs} alt="Crocs Logo" />
                </div>
                <div className="row">
                  <header>Por Tendência</header>
                  <ul className="mega-links">
                    <li><Link to="#">Novos clássicos</Link></li>
                    <li><Link to="#">Impressão camuflada</Link></li>
                    <li><Link to="#">Equipes esportivas</Link></li>
                    <li><Link to="#">Aventuras ao ar livre</Link></li>
                    <li><Link to="#">Recuperação</Link></li>
                  </ul>
                </div>
                <div className="row">
                  <header>Clássicos</header>
                  <ul className="mega-links">
                    <li><Link to="#">Jibbitz</Link></li>
                    <li><Link to="#">Grande</Link></li>
                    <li><Link to="#">Alto (14+)</Link></li>
                    <li><Link to="#">Tênis</Link></li>
                    <li><Link to="#">Botas</Link></li>
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


<li>
  <Link to="/" className="desktop-item">Mulher</Link>
  <input type="checkbox" id="showMega" />

  <label htmlFor="showMega" className="mobile-item">Testes</label>
  <div className="mega-box">
    <div className="content">
      <div className="row">
        <img src={LogoCrocs} alt="" />
      </div>
      <div className="row">
        <header>Estilo</header>
        <ul className="mega-links">
          <li><Link to="/tamancos">Tamancos</Link></li>
          <li><Link to="/sandalias">Sandálias</Link></li>
          <li><Link to="/sandalias-de-dedo">Sandálias de dedo</Link></li>
          <li><Link to="/plataformas-e-cunhas">Plataforma e Cunhas</Link></li>
          <li><Link to="/apartamentos">Apartamentos</Link></li>
        </ul>
      </div>

      <div className="row">
        <header></header>
        <ul className="mega-links">
          <li>
            <Link to="/oferta1"><img src={navImg2} alt="" /></Link>
            <button>Ver Oferta</button>
          </li>
        </ul>
      </div>

      <div className="row">
        <header></header>
        <ul className="mega-links">
          <li>
            <Link to="/oferta2"><img src={navImg3} alt="" /></Link>
            <button>Ver Oferta</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</li>


          <li><Link to="/loja">Loja</Link></li>
          <li><Link to="/sobre-nos">About us</Link></li>

          <div className="Componentes">
            <Link to="#"><input type="button" className="btn_carrinho" /></Link>
            <Link to="#"><input type="button" className="btn_favorito" /></Link>
            <Link to="/login"><input type="button" className="btn_login" value="Login" /></Link>
            <input type="search" className="btn_pesquisa" placeholder="Search" />
         
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Link to="/favoritos">
                <FiHeart size={25} style={{ marginRight: '8px', color: 'black' }} />
              </Link>
              {favorites.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-27px',
                    right: '-1px',
                    color: 'black',
                    borderRadius: '100px',
                    padding: '1px 2px -10px 5px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {favorites.length}
                </span>
              )}
            </div>
            <Link 
      to="/carrinho" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        textDecoration: 'none', 
        border: '3px solid #000000', 
        padding: '4px 14px', 
        borderRadius: '80px', 
        transition: 'box-shadow 0.3s',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <FiShoppingCart size={20} style={{ marginRight: '8px', color: 'black' }} />
      {cartItemCount > 0 && (
        <span
          style={{
            color: 'green',
            fontSize: '0.8rem',
            width: '10px',
            height: '10px',
            position: 'relative',
            top: '-27px',
            fontWeight: 'bold',  
          }}
        >
          {cartItemCount}
        </span>
      )}
    </Link>
    <Link to="/historico">
      <FiUser size={20} style={{ marginRight: '8px', color: 'black' }} />
    </Link>
    
          </div>
        </ul>

        <label htmlFor="menu-btn" className="btn menu-btn">
          <i className='bx bx-menu'></i>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;
