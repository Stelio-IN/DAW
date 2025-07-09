import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './src/index.css'; 
import { FavoritesProvider } from "./src/context/FavoritesContext.jsx";

// Componentes gerais
import Footer from './src/component/Footer.jsx'; 
import Nav from './src/component/Nav.jsx'; 
import AdminLayout from './src/component/AdminLayout.jsx'; 
import Carrinho from './src/pages/customer/Carrinho.jsx';
import Home from './src/pages/customer/Home.jsx'; 
import Login from './src/pages/customer/Login.jsx'; 
import SobreNos from './src/pages/customer/About.jsx'; 
import Loja from './src/pages/customer/Loja.jsx'; 
import Detalhes from './src/pages/customer/DetalhesProduto.jsx'; 
import Pesquisa from './src/pages/customer/ProdutoDetalhado.jsx'; 
import Pagamento from './src/pages/customer/Pay.jsx'; 
import Favorito from './src/pages/customer/Favorito.jsx'; 
import Historico from './src/pages/customer/HistoricoCompras.jsx'; 

//import Detalhes from './pages/Produto'; 


// Componentes para Admin
import AdminNav from './src/component/AdminNav.jsx';
import AdminDetalheProduto from './src/pages/admin/AdminDetalheProduto.jsx';
import AdminPedidos from './src/pages/admin/AdminPedidos.jsx';
import AdminDashBoard from './src/pages/admin/AdminDashBoard.jsx';
import AdminDetalhePedido from './src/pages/admin/AdminDetalhePedido.jsx';
import AdminProduto from './src/pages/admin/AdminProdutos.jsx';
import AdminUsuarios from './src/pages/admin/AdminUsuarios.jsx';
import AdminDetalheUsuario from './src/pages/admin/AdminDetalheUsuario.jsx';
import AdminAdicionarProduto from './src/pages/admin/AdminAdicionarProduto.jsx'; 



function MainApp() {
  const location = useLocation();

  // Verifica se estamos em uma rota de Admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {/* Renderiza Nav e Footer apenas se não estiver em uma rota Admin */}
      {!isAdminRoute && <Nav />}

      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Renderiza AdminNav apenas para rotas de Admin */}
      

        <main style={{ flexGrow: 1 }}>
          <Routes> 
            {/* Rotas gerais */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/produto/detalhes/:productID" element= {<Detalhes />} />
            <Route path="/carrinho" element= {<Carrinho />} />
            <Route path="/pesquisa" element= {<Pesquisa />} />
            <Route path="/pagamento" element= {<Pagamento />} />
            <Route path="/favoritos" element= {<Favorito />} />
            <Route path="/minhasCompras" element= {<Historico />} />
           
           

            {/* Rotas específicas para admin */}

          <Route path="/admin" element={<AdminLayout />} >
            <Route path="dashboard" element={<AdminDashBoard />} />
            <Route path="Pedidos" element={<AdminPedidos />} />
            <Route path="pedido/detalhe/:IdPedido?" element={<AdminDetalhePedido />} />
            <Route path="produtos" element={<AdminProduto />} />
            <Route path="produto/adicionar" element={< AdminAdicionarProduto/>} />
            <Route path="produto/detalhe" element={<AdminDetalheProduto />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="usuario/detalhe" element={<AdminDetalheUsuario />} />
          </Route>
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
    <FavoritesProvider> {/* Envolvendo a aplicação com o contexto */}
      <MainApp />

  </FavoritesProvider>
  </Router>
  );
}

export default App;
