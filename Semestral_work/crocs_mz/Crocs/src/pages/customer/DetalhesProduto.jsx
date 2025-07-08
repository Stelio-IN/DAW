import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/style/about.css';
import '../assets/style/detalhesProduto.css';
import { useFavorites } from "../../context/FavoritesContext"; // Importa o contexto

import crocs from '../assets/img/sap1.webp';
import crocs1 from '../assets/img/sap2.webp';
import crocs2 from '../assets/img/sap3.webp';
import crocs3 from '../assets/img/sap4.webp';
import crocs4 from '../assets/img/sap5.webp';
const ProdutoDetalhado = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState([null]);
  const navigate = useNavigate();
 const { favorites, toggleFavorite } = useFavorites();
  useEffect(() => {
    if (productID) {
      console.log(`O parâmetro productID foi capturado: ${productID}`);
      fetch(`http://localhost:3005/api/products/pr/${productID}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.product_id) {
            setProduct(data);
          } else {
            console.error('Dados recebidos não são um array:', data);
          }
        })
        .catch((error) =>
          console.error('Erro ao buscar detalhes do produto:', error)
        );
    }
  }, [productID]);

  const addToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...currentCart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log('Produto adicionado ao carrinho:', product);
  };

  return (
    <div className="container-detalhes-produto">
      <section className='container_detalhes'>
        <div className="box-conteudo">
        {product ? (
        <div className="col-esquerda">
          <div className="imagem-principal">
            <div key={product.product_id} className='principal'>
              <img
                src={product.primary_image_url || 'default-image.png'}
                alt={product.name}
              
              />
            </div>
          </div>
          <div className="opcoes">
            <img src={crocs} alt="Opção 1" />
            <img src={crocs1} alt="Opção 1" />
            <img src={crocs2} alt="Opção 1" />
            <img src={crocs3} alt="Opção 1" />
            <img src={crocs4} alt="Opção 1" />
          </div>
        </div>
          ) : (
            <p>Carregando detalhes do produto...</p>
          )}

          {product ? (
            <div className="col-direita">
              <div className="informacao-tamanho">
                <h1>{product.name}</h1>
               
              <div className="alternativas">
                <div>
                  <img src={crocs} alt="Opção 1" />
                  <img src={crocs} alt="Opção 1" />
                  <img src={crocs} alt="Opção 1" />
                  <img src={crocs} alt="Opção 1" />
                  <img src={crocs} alt="Opção 1" />
          
                </div>
              </div>
              <p style={{fontWeight: 'bold', fontSize: '20pt'}}>  {product.price} Mzn</p>
              <p style={{ maxWidth: '600px', fontStyle: 'italic' }}>
                  {product.description}
                </p>
                <p style={{ textDecoration: 'underline', fontWeight: '900', fontSize: '13pt' }}>Tamanho</p>
                <p>Os tamanhos podem variar de acordo com o estilo.</p>
                <button className="botao-genero">HOMEM</button>
                <button className="botao-genero">MULHER</button>
              </div>
              <div className="lista-tamanhos">
                {[7, 10, 15, 16, 19, 23, 25, 30, 31, 34, 36].map((tamanho) => (
                  <button key={tamanho} className="botao-tamanho">
                    {tamanho}
                  </button>
                ))}
              </div>
            
              
              <button style={styles.button} onClick={() => addToCart(product)} className='cart'>
                Adicionar ao Carrinho
              </button>
              <button
            onClick={() => {
              console.log("Produto favorito clicado:", product);
              toggleFavorite(product);
            }}
            className='favor'
          >
            {favorites.some((item) => item.product_id === product.product_id)
              ? <span style={{color: 'red', textDecoration: 'underline'}}>Remover Favorito</span>
              : "Adicionar aos Favoritos"}
          </button>
            </div>
          ) : (
            <p>Carregando...</p>
          )}
        </div>

        <div className=''>

        </div>
      </section>

      
    </div>
  );
};

const styles = {
  card: {
   
  },
};

export default ProdutoDetalhado;
