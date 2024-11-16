import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer">
          <p>&copy; {new Date().getFullYear()} Crocs MZ. Todos os direitos reservados.</p>
          <ul>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <Link to="/settings">Configurações</Link>
            </li>
            <li>
              <Link to="/settings/Security">Segurança</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
