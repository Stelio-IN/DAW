import React, { useEffect, useState } from "react";
import '../../assets/style/historico.css'

const HistoricoCompras = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Adicionado para mostrar carregando

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3005/api/products/comprasUsuario", {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Envia token JWT
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao buscar produtos');
        }

        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className='content-about'>
      <div className="Historico">
        <div className="titulo">
          <h2>Minhas compras</h2>
        </div>
        <div className="container_historico">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div className="produto" key={index}>
                <picture>
                  <img
                    src={product.primary_image_url || '/placeholder.png'}
                    alt={product.nome_produto}
                    loading="lazy"
                  />
                </picture>
                <div className="detalhes_compra">
                  <p> Nr.Pedido: <small>{product.order_id}</small> </p>
                  <p> Comprador: <small>{product.payer_name}</small> </p>
                  <p> Nome produto: <small>{product.nome_produto}</small> </p>
                  <p> Quantidade: <small>{product.quantidade}</small> </p>
                  <p> Preço unitário: <small>${product.preco_unitario.toFixed(2)}</small> </p>
                  <p> Total: <small>${product.preco_total.toFixed(2)}</small> </p>
                  <p> Data de compra: <small>{new Date(product.created_at).toLocaleString()}</small> </p>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhuma compra encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricoCompras;
