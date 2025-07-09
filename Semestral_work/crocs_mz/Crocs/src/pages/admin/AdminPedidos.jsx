import React, { useState, useEffect } from 'react';
import '../../assets/style/AdminPedidos.css';
import { useNavigate } from 'react-router-dom';

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Busca dados da API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3005/api/products/compras');
      if (!response.ok) throw new Error('Erro ao buscar pedidos');
      const data = await response.json();

      // Ajustar o mapeamento do que veio da API para seu formato
      // API retorna: order_id, payer_name, created_at, nome_produto, quantidade, preco_unitario, preco_total, primary_image_url
      const mappedOrders = data.map((item, index) => ({
        id: index + 1, // usar índice ou outro ID único se tiver
        product: item.nome_produto,
        orderId: item.order_id,
        customer: item.payer_name,
        date: new Date(item.created_at).toLocaleDateString('pt-BR'),
        qty: item.quantidade,
        price: `R$ ${item.preco_total}`,
        status: 'Pago', // Pode ajustar se tiver status na API
        imageUrl: item.primary_image_url,
      }));

      setOrders(mappedOrders);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const navigate = useNavigate();

  // Função para ir para detalhes do pedido
  const goToDetails = (orderId) => {
    navigate(`/admin/pedido/detalhe/${orderId}`); // rota exemplo, ajuste conforme sua rota
  };

  return (
    <div className="orders-screen">
      <header className="orders-header">
        <h1>Compras</h1>
        <div className="tabs">
          <div className="tab-group">
            <span>Todas</span>
            <div className="tab-items">
              <button 
                className={activeTab === 'Shipping' ? 'active' : ''}
                onClick={() => setActiveTab('Shipping')}
              >
                Shipping
              </button>
              <button 
                className={activeTab === 'Completed' ? 'active' : ''}
                onClick={() => setActiveTab('Completed')}
              >
                Completas
              </button>
              <button 
                className={activeTab === 'Cancelled' ? 'active' : ''}
                onClick={() => setActiveTab('Cancelled')}
              >
                Canceladas
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="search-container">
        <div className="search-input">
          <input type="text" placeholder="Search by ID, Name" />
        </div>
        <div className="actions">
          <button className="sort-btn">Sort by</button>
          <button className="filter-btn">Filtrar</button>
        </div>
      </div>

      <div className="divider"></div>

      {loading && <p>Carregando Pedidos...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}

     <div className="orders-grid">
        <div className="grid-header">
          <div>Producto</div>
          <div>ID Pedido</div>
          <div>Nome do Cliente</div>
          <div>Data</div>
          <div>Quantidade</div>
          <div>Preço</div>
          <div>Status</div>
        </div>

        {!loading && !error && orders.length === 0 && (
          <p>No orders found.</p>
        )}

        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div className="product-name">{order.product}</div>
            <div className="order-id">{order.orderId}</div>
            <div className="customer-name">{order.customer}</div>
            <div className="date">{order.date}</div>
            <div className="qty">{order.qty}</div>
            <div className="price">{order.price}</div>
            <div className={`status ${order.status === 'Cash On Delivery' ? 'cash' : 'complete'}`}>
              <span>{order.status}</span>
              <button 
                style={{
                  marginLeft: '10px',
                  cursor: 'pointer',
                  backgroundColor: '#1a73e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 7px',
                  fontSize: '12px'
                }}
                onClick={() => goToDetails(order.orderId)}
              >
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        Showing 1-{orders.length.toString().padStart(2, '0')} of {orders.length} entries
      </div>
    </div>
  );
};

export default OrdersScreen;
