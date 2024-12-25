import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
// import '../assets/style/about.css'
const HistoricoCompras= () => {

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);  // Adicionado para tratamento de erro

    //  const navigate = useNavigate();
    useEffect(() => {
        fetch("http://localhost:3005/api/products/compras")
          .then((response) => {
            if (!response.ok) {  // Verificando se a resposta não foi ok
              throw new Error('Erro ao buscar produtos');
            }
            return response.json();
          })
          .then((data) => setProducts(data))
          .catch((error) => {
            console.error("Erro ao buscar produtos:", error);
            setError(error.message);  // Setando a mensagem de erro
          });
    }, []);
  return (
    <div className='content-about'>
    <div>
        <h1>Lista de produtos comprados</h1>
        <section>
            {error ? (  // Exibe o erro, caso exista
                <p>{error}</p>
            ) : (
                products.length > 0 ? (
                    products.map((product, index) => (
                        <div className="product" key={index}>
                            <picture>
                                <img
                                    src={product.primary_image_url}
                                    alt={product.product_name}
                                    loading="lazy"
                                />
                            </picture>
                            <div className="detail">
                                <p> Pedido Numero: 
                                    <small>{product.order_id}</small>
                                </p>
                                <p> Comprador: 
                                    <small>{product.payer_name}</small>
                                </p>
                                <p> Nome produto: 
                                    <small>{product.nome_produto}</small>
                                </p>
                                <p> quantidade: 
                                    <small>{product.quantidade}</small>
                                </p>
                                <p> Preco unitario: 
                                    <small>{product.preco_unitario}</small>
                                </p>
                                <p> Total: 
                                    <small>{product.preco_total}</small>
                                </p>
                                <p> Data de compra: 
                                    <small>{product.created_at}</small>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Carregando produtos...</p>
                )
            )}
        </section>
    </div>
</div>
  );
};

export default HistoricoCompras;