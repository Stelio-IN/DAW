import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import '../../assets/style/AdminDetalhePedido.css';

const OrderDetailScreen = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { IdPedido } = useParams();
  const [pedidoDetalhe, setPedidoDetalhe] = useState([]);
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
        setPedidoDetalhe(data);
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
  if (pedidoDetalhe.length === 0) return <p>Nenhum detalhe encontrado.</p>;

  const order = pedidoDetalhe[0];
  const subtotal = pedidoDetalhe.reduce((acc, item) => acc + parseFloat(item.preco_total), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="order-detail-container">
      <header className="order-header">
        <div className="order-title">
          <h1>Detalhes do Pedido</h1>
          <h2>Pedido #{order.order_id}</h2>
        </div>
        <div className="order-actions">
          <button className="print-btn" onClick={() => window.print()}>Imprimir</button>
          <button className="options-btn">Mais opções</button>
        </div>
      </header>

      <div className="order-date">
        {new Date(order.created_at).toLocaleString('pt-BR', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })}
      </div>

      <div className="divider"></div>

      <div className="order-content">
        <div className="products-section">
          <h3>Itens do Pedido</h3>
          <div className="products-list">
            {pedidoDetalhe.map((product, i) => (
              <div key={i} className="product-item">
                {product.primary_image_url && (
                  <div className="product-image">
                    <img src={product.primary_image_url} alt={product.nome_produto} />
                  </div>
                )}
                <div className="product-info">
                  <div className="product-name">{product.nome_produto}</div>
                  <div className="product-description">{product.description || 'Sem descrição.'}</div>
                  <div className="product-attributes">
                    <div><strong>Cor:</strong> {product.color_name || 'N/A'}{' '}
                      {product.hex_code && (
                        <span style={{
                          display: 'inline-block',
                          width: '14px',
                          height: '14px',
                          backgroundColor: product.hex_code,
                          borderRadius: '50%',
                          marginLeft: '4px',
                          border: '1px solid #ccc'
                        }}></span>
                      )}
                    </div>
                    <div><strong>Gênero:</strong> {product.gender_name || 'N/A'}</div>
                    <div><strong>Quantidade:</strong> {product.quantidade}</div>
                  </div>
                </div>
                <div className="product-price">
                  <div>${parseFloat(product.preco_unitario).toFixed(2)}</div>
                  <div className="product-qty">x{product.quantidade}</div>
                  <div className="product-total">${parseFloat(product.preco_total).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-item"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-item"><span>Shipping fee:</span><span>$0.00</span></div>
            <div className="summary-item"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
            <div className="summary-item total"><span>Total:</span><span>${total.toFixed(2)}</span></div>
            <div className="summary-item"><span>Amount paid:</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="customer-section">
          <div className="customer-info">
            <div className="customer-header">
              <h3>Cliente</h3>
            </div>
            <div className="customer-details">
              <div className="customer-name">{order.payer_name}</div>
              <div className="customer-orders">1 pedido</div>
              <div className="contact-info">
                <div>--</div>
                <div>--</div>
              </div>
            </div>
          </div>

          <div className="address-section">
            <h3>Endereço de Entrega</h3>
            <div className="address-details">
              <div>--</div>
              <div>--</div>
              <div>--</div>
              <div>--</div>
            </div>
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

          <div className="address-section">
            <h3>Endereço de Faturamento</h3>
            <div className="address-details">
              <div>--</div>
              <div>--</div>
              <div>--</div>
              <div>--</div>
            </div>
          </div>

          <div className="payment-section">
            <h3>Método de Pagamento</h3>
            <div className="payment-details">
              <div>--</div>
              <div>Número do Cartão: ******</div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailScreen;
