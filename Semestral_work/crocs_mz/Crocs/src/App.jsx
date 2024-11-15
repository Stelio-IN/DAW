import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './app.css'; 

// Componentes gerais
import Footer from './component/Footer'; 
import Nav from './component/Nav'; 
import Carrinho from './component/Carrinho';
import Home from './pages/Home'; 
import Login from './pages/LoginRegister'; 
import SobreNos from './pages/About'; 
import Loja from './pages/Loja'; 
import Detalhes from './pages/DetalhesProduto'; 


// Componentes para Admin
import AdminNav from './component/AdminNav';
import AdminCategoria from './pages/AdminCategoria';
import AdminColorProduto from './pages/AdminColorProduto';
import AdminDashBoard from './pages/AdminDashBoard';
import AdminImagemProduto from './pages/AdminImagemProduto';
import AdminProduto from './pages/AdminProduto';



function MainApp() {
  const location = useLocation();

  // Verifica se estamos em uma rota de Admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Renderiza Nav e Footer apenas se não estiver em uma rota Admin */}
      {!isAdminRoute && <Nav />}

      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Renderiza AdminNav apenas para rotas de Admin */}
        {isAdminRoute && <AdminNav />}

        <main style={{ flexGrow: 1 }}>
          <Routes> 
            {/* Rotas gerais */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/Detalhes_produto" element= {<Detalhes />} />
            <Route path="/carrinho" element= {<Carrinho />} />
           
           

            {/* Rotas específicas para admin */}
            <Route path="/admin/dashboard" element={<AdminDashBoard />} />
            <Route path="/admin/categoria" element={<AdminCategoria />} />
            <Route path="/admin/produto" element={<AdminProduto />} />
            <Route path="/admin/produto-image" element={<AdminImagemProduto />} />
            <Route path="/admin/produto-color" element={<AdminColorProduto />} />
          </Routes>
        </main>
      </div>

      {/* Renderiza Footer apenas se não estiver em uma rota Admin */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;
