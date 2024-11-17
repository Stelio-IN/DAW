import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/theme.min.css';

const AdminNavigation = () => {
  const [openMenus, setOpenMenus] = useState({});

  const handleMenuToggle = useCallback((menuId) => {
    setOpenMenus((prev) => {
      const updatedState = { ...prev };
      Object.keys(updatedState).forEach((key) => {
        if (key !== menuId) {
          updatedState[key] = false;
        }
      });
      updatedState[menuId] = !updatedState[menuId];
      return updatedState;
    });
  }, []);

  return (
    <div className='nav_container'>
      <nav className="admin_navigation">
        <div className="menu_wrapper">
          <div id="menuPagesContainer">
            <div id="menuPages">
              
              {/* Dashboard menu */}
              <div className={`menu_item ${openMenus.dashboard ? 'menu_open' : ''}`}>
                <a
                  className="menu_link dropdown_trigger"
                  onClick={() => handleMenuToggle('dashboard')}
                  aria-expanded={openMenus.dashboard}
                >
                  Dashboard
                </a>
                <div className="menu_dropdown">
                  <Link className="menu_link" to="/admin/dashboard">Dashboard</Link>
                </div>
              </div>
              {/* Categoria menu */}
              <div className={`menu_item ${openMenus.category ? 'menu_open' : ''}`}>
                <a
                  className="menu_link dropdown_trigger"
                  onClick={() => handleMenuToggle('category')}
                  aria-expanded={openMenus.category}
                >
                  Categoria
                </a>
                <div className="menu_dropdown">
                  <Link className="menu_link" to="/admin/categoria">Categoria</Link>
                </div>
              </div>
              {/* Produto menu */}
              <div className={`menu_item ${openMenus.product ? 'menu_open' : ''}`}>
                <a
                  className="menu_link dropdown_trigger"
                  onClick={() => handleMenuToggle('product')}
                  aria-expanded={openMenus.product}
                >
                  Produto
                </a>
                <div className="menu_dropdown">
                  <Link className="menu_link" to="/admin/produto">Produto</Link>
                </div>
              </div>
              {/* Produto Cor menu */}
              <div className={`menu_item ${openMenus.productColor ? 'menu_open' : ''}`}>
                <a
                  className="menu_link dropdown_trigger"
                  onClick={() => handleMenuToggle('productColor')}
                  aria-expanded={openMenus.productColor}
                >
                  Produto Cor
                </a>
                <div className="menu_dropdown">
                  <Link className="menu_link" to="/admin/produto-color">Produto Cor</Link>
                </div>
              </div>
              
                        </div>
                      </div>
            </div>
        
        <div className='main_dashboard'>
          <p>Assadad</p>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavigation;
