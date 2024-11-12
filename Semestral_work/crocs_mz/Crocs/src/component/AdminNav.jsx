import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/theme.min.css';

const NavAdmin = () => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = useCallback((menuId) => {
    setExpandedMenus((prev) => {
      const newState = { ...prev };
      // Fecha todos os menus antes de abrir o novo
      Object.keys(newState).forEach((key) => {
        if (key !== menuId) {
          newState[key] = false;
        }
      });
      newState[menuId] = !newState[menuId];
      return newState;
    });
  }, []);

  return (
    <div className='content_nav'>
      <nav className="nav_admin">
        <div className="wrapper">
          <div id="navbarVerticalMenuPagesMenu">
            {/* Dashboard menu */}
            <div className={`nav-item ${expandedMenus.dashboardMenu ? 'open' : ''}`}>
              <a
                className="nav-link dropdown-toggle"
                onClick={() => toggleMenu('dashboardMenu')}
                aria-expanded={expandedMenus.dashboardMenu}
              >
                Dashboard
              </a>
              <div className="nav-collapse">
                <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
              </div>
            </div>

            {/* Categoria menu */}
            <div className={`nav-item ${expandedMenus.categoriaMenu ? 'open' : ''}`}>
              <a
                className="nav-link dropdown-toggle"
                onClick={() => toggleMenu('categoriaMenu')}
                aria-expanded={expandedMenus.categoriaMenu}
              >
                Categoria
              </a>
              <div className="nav-collapse">
                <Link className="nav-link" to="/admin/categoria">Categoria</Link>
              </div>
            </div>

            {/* Produto menu */}
            <div className={`nav-item ${expandedMenus.produtoMenu ? 'open' : ''}`}>
              <a
                className="nav-link dropdown-toggle"
                onClick={() => toggleMenu('produtoMenu')}
                aria-expanded={expandedMenus.produtoMenu}
              >
                Produto
              </a>
              <div className="nav-collapse">
                <Link className="nav-link" to="/admin/produto">Produto</Link>
              </div>
            </div>

            {/* Produto Cor menu */}
            <div className={`nav-item ${expandedMenus.produtoCorMenu ? 'open' : ''}`}>
              <a
                className="nav-link dropdown-toggle"
                onClick={() => toggleMenu('produtoCorMenu')}
                aria-expanded={expandedMenus.produtoCorMenu}
              >
                Produto Cor
              </a>
              <div className="nav-collapse">
                <Link className="nav-link" to="/admin/produto-color">Produto Cor</Link>
              </div>
            </div>
          </div>
        </div>
        <div className='dashboard'>
          <p>Assadad</p>
        </div>
      </nav>
    </div>
  );
};

export default NavAdmin;
