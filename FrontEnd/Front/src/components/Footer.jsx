import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <div style={styles.links}>
          <a href="/" style={styles.link}>Privacy Policy</a>
          <a href="/" style={styles.link}>Terms of Service</a>
          <a href="/" style={styles.link}>Contact</a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: 'auto',
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    color: '#000',
    textAlign: 'center',
  },
  container: {
    maxWidth: '960px',
    margin: '0 auto',
  },
  links: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Footer;
