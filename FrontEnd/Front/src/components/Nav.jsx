import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = ({ isLoggedIn, userEmail, setIsLoggedIn, setUserEmail }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    navigate('/login'); // Redireciona para a página de login após logout
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>MyApp</div>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/" style={styles.link}>Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/about" style={styles.link}>About</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/products" style={styles.link}>Products</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/contact" style={styles.link}>Contact</Link>
        </li>

        {isLoggedIn && (
          <li style={styles.navItem}>
            <Link to="/profile" style={styles.link}>User</Link>
          </li>
        )}
        {/* Exibe o email do usuário logado ou o link de login */}
        <li style={styles.navItem}>
          {isLoggedIn ? (
            <span style={styles.userInfo}>
              {userEmail} <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </span>
          ) : (
            <Link to="/login" style={styles.link}>Login</Link>
          )}
        </li>

        {/* Condicional para exibir o link de user */}
        
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
  },
  navItem: {
    margin: '0',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Nav;
