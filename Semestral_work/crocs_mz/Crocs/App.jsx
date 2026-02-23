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
import DetalheJibbitz from './src/pages/customer/DetalheJibbitz.jsx'; 
import LojaJibbitz from './src/pages/customer/LojaJibbitz.jsx'; 

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
import AdminGestaoEstoque from './src/pages/admin/AdminGestaoEstoque.jsx'; 
import AdminGerirEstoqueProduto from './src/pages/admin/AdminGerirEstoqueProduto.jsx'; 
import AdminAssociarProductColor from './src/pages/admin/AdminAssociarProductColor.jsx'; 
import AdminAssociarTamanho from './src/pages/admin/AdminAssociarTamanho.jsx'; 
import AdminAssociarImagem from './src/pages/admin/AdminAssociarImagem.jsx'; 
import AdminPromotion from './src/pages/admin/AdminPromotion.jsx'; 


import PrivateRoute from './src/component/PrivateRoute.jsx';
import AdminRoute from './src/component/AdminRoute.jsx';
function MainApp() {
  const location = useLocation();

  // Verifica se estamos em uma rota de Admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {/* Renderiza Nav e Footer apenas se não estiver em uma rota Admin */}
      {!isAdminRoute && <Nav />}

      <div style={{ display: 'flex', flexGrow: 1 }}>
        <main style={{ flexGrow: 1 }}>
          <Routes> 
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/loja" element={<Loja />} />
            <Route path="/jibbitz" element={<LojaJibbitz />} />
            <Route path="/produto/detalhes/:productID" element={<Detalhes />} />
            <Route path="/pesquisa" element={<Pesquisa />} />
            <Route path="/jibbitz/detalhes/:jibbitzID" element={<DetalheJibbitz />} />
            <Route path="/favoritos" element={
              <PrivateRoute>
                <Favorito />
              </PrivateRoute>
            } />

            {/* Rotas privadas (usuário logado) */}
            <Route path="/carrinho" element={
              <PrivateRoute>
                <Carrinho />
              </PrivateRoute>
            } />
            <Route path="/pagamento" element={
              <PrivateRoute>
                <Pagamento />
              </PrivateRoute>
            } />
            <Route path="/minhasCompras" element={
              <PrivateRoute>
                <Historico />
              </PrivateRoute>
            } />

            {/* Rotas de admin protegidas */}
            <Route path="/admin" element={
             // <AdminRoute>
                <AdminLayout />
              // </AdminRoute>
            }>
              <Route path="dashboard" element={<AdminDashBoard />} />
              <Route path="Pedidos" element={<AdminPedidos />} />
              <Route path="pedido/detalhe/:IdPedido?" element={<AdminDetalhePedido />} />
              <Route path="produtos" element={<AdminProduto />} />
              <Route path="produto/promotion" element={<AdminPromotion />} />
              <Route path="produto/adicionar" element={<AdminAdicionarProduto />} />
              <Route path="produto/associar-produto-cor" element={<AdminAssociarProductColor />} />
              <Route path="produto/associar-produto-imagem" element={<AdminAssociarImagem />} />
              <Route path="produto/associar-produto-tamanho" element={<AdminAssociarTamanho />} />
              <Route path="produto/detalhe/:IdProduto?" element={<AdminDetalheProduto />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuario/detalhe" element={<AdminDetalheUsuario />} />
              <Route path="produto/estoque-visao-geral" element={<AdminGestaoEstoque />} />
              <Route path="produto/estoque-produto/:id" element={<AdminGerirEstoqueProduto />} />
            </Route>

          </Routes>
        </main>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <FavoritesProvider>
        <MainApp />
      </FavoritesProvider>
    </Router>
  );
}

export default App;