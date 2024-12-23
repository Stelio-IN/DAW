import React, { useEffect, useState } from 'react';
import '../assets/style/historico.css'; // Estilize conforme necessário

function HistoricoCompras({ userId }) {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar o histórico de compras
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/order-history/${userId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar histórico de compras');
        }
        const data = await response.json();
        setOrderHistory(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [userId]);

  if (loading) return <p>Carregando histórico de compras...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div className="historico-compras">
      <h2>Histórico de Compras</h2>
      {orderHistory.length === 0 ? (
        <p>Você ainda não realizou nenhuma compra.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Data do Pagamento</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Preço Total</th>
              <th>Total da Compra</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((item) => (
              <tr key={item.order_item_id}>
                <td>{new Date(item.payment_date).toLocaleDateString()}</td>
                <td>{item.nome_produto}</td>
                <td>{item.quantidade}</td>
                <td>{item.preco_unitario.toFixed(2)} Mzn</td>
                <td>{item.preco_total.toFixed(2)} Mzn</td>
                <td>{item.total_amount.toFixed(2)} Mzn</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HistoricoCompras;
