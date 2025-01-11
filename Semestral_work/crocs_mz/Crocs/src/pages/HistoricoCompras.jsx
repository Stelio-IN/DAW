import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
 import '../assets/style/historico.css'
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
    <div className="Historico">
        <div className="titulo">
        <h2>Minhas compras</h2>
        </div>
        <div className="container_historico">
            {error ? (  // Exibe o erro, caso exista
                <p>{error}</p>
            ) : (
                products.length > 0 ? (
                    products.map((product, index) => (
                        
                        <div className="produto" key={index}>
                            <picture>
                                <img
                                    src={product.primary_image_url}
                                    alt={product.product_name}
                                    loading="lazy"
                                />
                            </picture>
                            <div className="detalhes_compra">
                                <p> Nr.Pedido: 
                                    <small>{product.order_id}</small>
                                </p>
                                <p> Comprador: 
                                    <small>{product.payer_name}</small>
                                </p>
                                <p> Nome produto: 
                                    <small>{product.nome_produto}</small>
                                </p>
                                <p> Quantidade: 
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
        </div>
    </div>
</div>
  );
};

export default HistoricoCompras;