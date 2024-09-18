import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './app.css'; 
import Footer from './component/Footer'; 
import Nav from './component/Nav'; 
import Home from './component/Home'; // Componente para a página inicial
import Login from './component/LoginRegister'; // Componente para a página de login
import SobreNos from './component/SobreNos'; // Componente para Sobre Nós
import Loja from './component/Loja'; // Componente para Loja


function App() {
  return (
    <div className="App" style={{
      display: 'block'
    }}>
        <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/loja" element={<Loja />} />
      </Routes>
      <Footer />
      </Router>
    </div>
  );
}

export default App;
