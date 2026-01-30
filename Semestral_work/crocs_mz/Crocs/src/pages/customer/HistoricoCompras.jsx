import React, { useEffect, useState } from "react";
import "../../assets/style/historico.css";

const HistoricoCompras = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3005/api/orderitems/orders/my"
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Erro ao buscar compras");
        }

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Função para calcular o total de cada pedido
  const calcOrderTotal = (order) => {
    let total = 0;

    order.items.products.forEach((item) => {
      const value = item.total_com_promocao ?? item.total_sem_promocao ?? 0;
      total += Number(value);
    });

    order.items.jibbitz.forEach((item) => {
      const value = item.total_promo_price ?? item.total_base_price ?? 0;
      total += Number(value);
    });

    return total.toFixed(2);
  };

  return (
    <div className="content-about">
      <div className="Historico">
        <div className="titulo">
          <h2>Minhas compras</h2>
        </div>

        <div className="container_historico">
          {orders.length > 0 ? (
            orders.map((order) => {
              const payerName = order.customer_name || "—";
              const orderTotal = calcOrderTotal(order);

              return (
                <div className="pedido" key={order.order_id}>
                  <div className="pedido-header">
                    <p>
                      <strong>Pedido nº:</strong> {order.order_id}
                    </p>
                    <p>
                      <strong>Data:</strong>{" "}
                      {new Date(order.order_date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                  </div>

                  <div className="pedido-items">
                    {/* Produtos */}
                    {order.items.products.map((item) => (
                      <div className="item" key={item.order_item_id}>
                        <picture>
                          <img
                            src={item.primary_image_url || "/placeholder.png"}
                            alt={item.product_name}
                            loading="lazy"
                          />
                        </picture>
                        <div className="item-info">
                          <p>
                            <strong>Produto:</strong> {item.product_name}
                          </p>
                          <p>
                            <strong>Cor:</strong> {item.color_name} |{" "}
                            <strong>Tamanho:</strong> {item.size}
                          </p>
                          <p>
                            <strong>Quantidade:</strong> {item.quantity}
                          </p>
                          <p>
                            <strong>Preço unitário:</strong>{" "}
                            {Number(item.unit_price).toFixed(2)} MT
                          </p>
                          <p>
                            <strong>Total:</strong>{" "}
                            {Number(
                              item.total_com_promocao ?? item.total_sem_promocao
                            ).toFixed(2)}{" "}
                            MT
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Jibbitz */}
                    {order.items.jibbitz.map((item) => (
                      <div className="item" key={item.id}>
                        <picture>
                          <img
                            src={item.primary_image_url || "/placeholder.png"}
                            alt={item.jibbitz_name}
                            loading="lazy"
                          />
                        </picture>
                        <div className="item-info">
                          <p>
                            <strong>Produto:</strong> {item.jibbitz_name}
                          </p>
                          <p>
                            <strong>Quantidade:</strong> {item.quantity}
                          </p>
                          <p>
                            <strong>Preço unitário:</strong>{" "}
                            {Number(item.promo_unit_price ?? item.base_price).toFixed(2)} MT
                          </p>
                          <p>
                            <strong>Total:</strong>{" "}
                            {Number(item.total_promo_price ?? item.total_base_price).toFixed(2)} MT
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pedido-footer">
                    <p>
                      <strong>Total do pedido:</strong> {orderTotal} MT
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricoCompras;
