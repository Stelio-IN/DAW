import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/theme.min.css';

const NavAdmin = () => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = useCallback((menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  }, []);

  return (


    
    <div className='content_nav'>
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
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/categoria">Categoria</Link></li>
            <li><Link to="/admin/produto">Produto</Link></li>
            <li><Link to="/admin/produto-image">Produto Imagem</Link></li>
            <li><Link to="/admin/produto-color">Produto Cor</Link></li>
          </ul>
          <div id="navbarVerticalMenuPagesMenu">
            {/* Users menu */}
            <div className={`nav-item ${expandedMenus.usersMenu ? 'open' : ''}`}>
              <a
                className="nav-link dropdown-toggle"
                onClick={() => toggleMenu('usersMenu')}
                aria-expanded={expandedMenus.usersMenu}
              >
                <i className="bi-people nav-icon"></i>
                <span className="nav-link-title">Users</span>
              </a>
              <div className="nav-collapse">
                <Link className="nav-link" to="users.html">Overview</Link>
                <Link className="nav-link" to="users-leaderboard.html">Leaderboard</Link>
                <Link className="nav-link" to="users-add-user.html">
                  Add User <span className="badge bg-info rounded-pill ms-1">Hot</span>
                </Link>
              </div>
            </div>
            {/* User Profile menu */}
            <div className={`nav-item ${expandedMenus.userProfileMenu ? 'open' : ''}`}>
              <a
                className="nav-link dropdown-toggle"
                onClick={() => toggleMenu('userProfileMenu')}
                aria-expanded={expandedMenus.userProfileMenu}
              >
                <i className="bi-person nav-icon"></i>
                <span className="nav-link-title">User Profile <span className="badge bg-primary rounded-pill ms-1">5</span></span>
              </a>
              <div className="nav-collapse">
                <Link className="nav-link" to="user-profile.html">Profile</Link>
                <Link className="nav-link" to="user-profile-teams.html">Teams</Link>
                <Link className="nav-link" to="user-profile-projects.html">Projects</Link>
                <Link className="nav-link" to="user-profile-connections.html">Connections</Link>
                <Link className="nav-link" to="user-profile-my-profile.html">My Profile</Link>
              </div>
            </div>
            {/* Account menu */}
            <div className={`nav-item ${expandedMenus.accountMenu ? 'open' : ''}`}>
              <a
                className="nav-link dropdown-toggle"
                onClick={() => toggleMenu('accountMenu')}
                aria-expanded={expandedMenus.accountMenu}
              >
                <i className="bi-person-badge nav-icon"></i>
                <span className="nav-link-title">Account</span>
              </a>
              <div className="nav-collapse">
                <Link className="nav-link" to="account-settings.html">Settings</Link>
                <Link className="nav-link" to="account-billing.html">Billing</Link>
                <Link className="nav-link" to="account-invoice.html">Invoice</Link>
              </div>
            </div>
            {/* Ecommerce menu */}
            <div className={`nav-item ${expandedMenus.ecommerceMenu ? 'open' : ''}`}>
              <a
                className="nav-link dropdown-toggle"
                onClick={() => toggleMenu('ecommerceMenu')}
                aria-expanded={expandedMenus.ecommerceMenu}
              >
                <i className="bi-basket nav-icon"></i>
                <span className="nav-link-title">E-commerce</span>
              </a>
              <div className="nav-collapse">
                <Link className="nav-link" to="ecommerce.html">Overview</Link>
                <div className="nav-item">
                  <a
                    className="nav-link dropdown-toggle"
                    onClick={() => toggleMenu('productsMenu')}
                    aria-expanded={expandedMenus.productsMenu}
                  >
                    Products
                  </a>
                  <div className="nav-collapse">
                    <Link className="nav-link" to="ecommerce-products.html">Products</Link>
                    <Link className="nav-link" to="ecommerce-product-details.html">Product Details</Link>
                    <Link className="nav-link" to="ecommerce-add-product.html">Add Product</Link>
                  </div>
                </div>
                <div className="nav-item">
                  <a
                    className="nav-link dropdown-toggle"
                    onClick={() => toggleMenu('ordersMenu')}
                    aria-expanded={expandedMenus.ordersMenu}
                  >
                    Orders
                  </a>
                  <div className="nav-collapse">
                    <Link className="nav-link" to="ecommerce-orders.html">Orders</Link>
                    <Link className="nav-link" to="ecommerce-order-details.html">Order Details</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavAdmin;
