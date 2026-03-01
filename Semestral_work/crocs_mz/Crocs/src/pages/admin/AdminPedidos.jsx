import React, { useState, useEffect } from "react";
import "../../assets/style/AdminPedidos.css";
import { useNavigate } from "react-router-dom";

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3005/api/products/compras"
      );

      if (!response.ok) throw new Error("Erro ao buscar pedidos");

      const data = await response.json();

      const mappedOrders = data.map((item, index) => ({
        id: index + 1,
        product: item.nome_produto || "Produto",
        orderId: item.order_id,
        customer: item.customer_name || "N/A",
        date: item.order_date
          ? new Date(item.order_date).toLocaleDateString("pt-PT")
          : "—",
        qty: Number(item.quantidade || 0),

        // 🔥 AGORA USA O TOTAL DO PEDIDO (orders.total_amount)
        price: Number(item.total_amount || 0).toLocaleString("pt-PT", {
          minimumFractionDigits: 2,
        }),

        rawStatus: item.payment_status,
        imageUrl: item.primary_image_url || null,
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

  // 🔥 Filtro por status
  const filteredOrders =
    activeTab === "ALL"
      ? orders
      : orders.filter((order) => order.rawStatus === activeTab);

  const goToDetails = (orderId) => {
    navigate(`/admin/pedido/detalhe/${orderId}`);
  };

  return (
    <div className="orders-screen">
      <header className="orders-header">
        <h1>Compras</h1>

        <div className="tab-items">
          <button
            className={activeTab === "ALL" ? "active" : ""}
            onClick={() => setActiveTab("ALL")}
          >
            Todas
          </button>

          <button
            className={activeTab === "PAID" ? "active" : ""}
            onClick={() => setActiveTab("PAID")}
          >
            Pagas
          </button>

          <button
            className={activeTab === "PENDING" ? "active" : ""}
            onClick={() => setActiveTab("PENDING")}
          >
            Pendentes
          </button>

          <button
            className={activeTab === "CANCELLED" ? "active" : ""}
            onClick={() => setActiveTab("CANCELLED")}
          >
            Canceladas
          </button>
        </div>
      </header>

      {loading && <p>Carregando Pedidos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="orders-grid">
        <div className="grid-header">
          <div>Produto</div>
          <div>ID Pedido</div>
          <div>Cliente</div>
          <div>Data</div>
          <div>Qtd</div>
          <div>Total (MZN)</div>
          <div>Status</div>
        </div>

        {!loading && filteredOrders.length === 0 && (
          <p>Nenhum pedido encontrado.</p>
        )}

        {filteredOrders.map((order) => (
          <div key={order.id} className="order-item">
            <div className="product-name">
              <img
                src={order.imageUrl || "/placeholder.png"}
                alt={order.product}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  marginRight: "8px",
                  borderRadius: "4px",
                }}
              />
              {order.product}
            </div>

            <div>{order.orderId}</div>
            <div>{order.customer}</div>
            <div>{order.date}</div>
            <div>{order.qty}</div>
            <div>{order.price}</div>

            <div
              className={`status ${
                order.rawStatus === "PAID"
                  ? "complete"
                  : order.rawStatus === "PENDING"
                  ? "pending"
                  : "cancelled"
              }`} id="paid-detalhes"
            >
              {order.rawStatus}

              <button
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  backgroundColor: "#1a73e8",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  padding: "7px 7px",
                  fontSize: "12px",
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
        Mostrando {filteredOrders.length} de {orders.length} pedidos
      </div>
    </div>
  );
};

export default OrdersScreen;