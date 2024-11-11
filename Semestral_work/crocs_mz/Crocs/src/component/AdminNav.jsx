import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/adminMenu.css';

const NavAdmin = () => {
  return (
    <nav className="nav_admin">
      <div className="wrapper">
        <div className="logo">
          <Link to="/">
            <span style={{ color: 'rgb(7, 79, 37)', fontWeight: 'bold', fontSize: '25pt' }}>
              Crocs<sup style={{ fontSize: '0.5rem' }}>TM</sup>
            </span>
          </Link>
        </div>
        
        <ul className="nav-links">
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/categoria">Categoria</Link>
          </li>
          <li>
            <Link to="/admin/produto">Produto</Link>
          </li>
          <li>
            <Link to="/admin/produto-image">Produto Imagem</Link>
          </li>
          <li>
            <Link to="/admin/produto-color">Produto Cor</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavAdmin;
