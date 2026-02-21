import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/style/AdminDetalhePedido.css';

const OrderDetailScreen = () => {
  const { IdPedido } = useParams();
  const [orderInfo, setOrderInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [inputPedido, setInputPedido] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetalhesPedido = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/products/compras/${IdPedido}`);
        if (!response.ok) throw new Error('Erro ao buscar os detalhes do pedido');
        const data = await response.json();
        setOrderInfo(data.orderInfo);
        setItems(data.items);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setErro(err.message);
        setLoading(false);
      }
    };

    if (IdPedido) {
      fetchDetalhesPedido();
    }
  }, [IdPedido]);

  if (!IdPedido) {
    return (
      <div className="order-detail-container">
        <h2>Nenhum pedido selecionado</h2>
        <p>Digite o ID do pedido para pesquisar:</p>
        <input
          type="text"
          value={inputPedido}
          onChange={(e) => setInputPedido(e.target.value)}
          placeholder="Ex: 60J91788AG2905626"
        />
        <button onClick={() => navigate(`/admin/pedido/detalhe/${inputPedido.trim()}`)}>
          Pesquisar
        </button>
      </div>
    );
  }

  if (loading) return <p>Carregando detalhes do pedido...</p>;
  if (erro) return <p>Erro: {erro}</p>;
  if (!orderInfo || items.length === 0) return <p>Nenhum detalhe encontrado.</p>;

  const subtotal = items.reduce((acc, item) => acc + parseFloat(item.valor_pago || 0), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="order-detail-container">
      <header className="order-header">
        <div className="order-title">
          <h1>Detalhes do Pedido</h1>
          <h2>Pedido #{orderInfo.order_id}</h2>
        </div>
        <div className="order-actions">
          <button className="print-btn" onClick={() => window.print()}>Imprimir</button>
          <button className="options-btn">Mais opções</button>
        </div>
      </header>

      <div className="order-date">
        {new Date(orderInfo.order_date).toLocaleString('pt-BR', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })}
      </div>

      <div className="divider"></div>

      <div className="order-content">
        {/* 🛒 Lista de Produtos */}
        <div className="products-section">
          <h3>Itens do Pedido</h3>
          <div className="products-list">
            {items.map((item, i) => (
              <div key={i} className="product-item">
                {item.primary_image_url && (
                  <div className="product-image">
                    <img src={item.primary_image_url} alt={item.nome_produto} />
                  </div>
                )}
                <div className="product-info">
                  <div className="product-name">{item.nome_produto}</div>
                  <div className="product-description">{item.description || 'Sem descrição.'}</div>
                  <div className="product-attributes">
                    <div>
                      <strong>Cor:</strong> {item.color_name || 'N/A'}{' '}
                      {item.hex_code && (
                        <span style={{
                          display: 'inline-block',
                          width: '14px',
                          height: '14px',
                          backgroundColor: item.hex_code,
                          borderRadius: '50%',
                          marginLeft: '4px',
                          border: '1px solid #ccc'
                        }}></span>
                      )}
                    </div>
                    <div><strong>Gênero:</strong> {item.gender_name || 'N/A'}</div>
                    <div><strong>Quantidade:</strong> {item.quantity}</div>
                  </div>
                </div>
                <div className="product-price">
                  <div>Preço Unitário: MZN {parseFloat(item.preco_unitario)}</div>
                  <div className="product-qty">x{item.quantity}</div>
                  <div className="product-total">Total Pago: MZN {parseFloat(item.valor_pago || 0)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 🧾 Resumo do Pedido */}
          <div className="order-summary">
            <div className="summary-item"><span>Subtotal:</span><span>MZN {subtotal}</span></div>
            <div className="summary-item"><span>Shipping fee:</span><span>MZN {orderInfo.shipping_amount || '0.00'}</span></div>
            <div className="summary-item"><span>Discount:</span><span>MZN {orderInfo.discount_amount || '0.00'}</span></div>
            <div className="summary-item"><span>Tax:</span><span>MZN {tax}</span></div>
            <div className="summary-item total"><span>Total:</span><span>MZN {orderInfo.total_amount}</span></div>
            <div className="summary-item"><span>Amount Paid:</span><span>MZN {orderInfo.total_amount}</span></div>
          </div>
        </div>

        {/* 👤 Seção do Cliente */}
        <div className="customer-section">
          <div className="customer-info">
            <div className="customer-header">
              <h3>Cliente</h3>
            </div>
            <div className="customer-details">
              <div className="customer-name">{orderInfo.customer_name}</div>
              <div className="customer-phone">Telefone: {orderInfo.phone}</div>
              <div className="customer-orders">1 pedido</div>
            </div>
          </div>

          {/* 📦 Endereço de Entrega */}
          <div className="address-section">
            <h3>Endereço de Entrega</h3>
            <div className="address-details">
              <div>{orderInfo.address}</div>
              <div>{orderInfo.city}</div>
              <div>{orderInfo.province}</div>
              <div>{orderInfo.postal_code}</div>
            </div>
          </div>

          {/* 🧾 Endereço de Faturamento */}
          <div className="address-section">
            <h3>Endereço de Faturamento</h3>
            <div className="address-details">
              <div>{orderInfo.address}</div>
              <div>{orderInfo.city}</div>
              <div>{orderInfo.province}</div>
              <div>{orderInfo.postal_code}</div>
            </div>
          </div>

          {/* 💳 Método de Pagamento */}
          <div className="payment-section">
            <h3>Método de Pagamento</h3>
            <div className="payment-details">
              <div>Método: {orderInfo.payment_method}</div>
              <div>Status: {orderInfo.payment_status}</div>
            </div>
          </div>

          {/* 🔍 Pesquisar outro pedido */}
          <div className="address-section">
            <input
              type="text"
              value={inputPedido}
              onChange={(e) => setInputPedido(e.target.value)}
              placeholder="Ex: 60J91788AG2905626"
            />
            <button onClick={() => navigate(`/admin/pedido/detalhe/${inputPedido.trim()}`)}>
              Pesquisar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailScreen;