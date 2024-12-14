import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/style/about.css';
import '../assets/style/detalhesProduto.css';

const ProdutoDetalhado = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState([null]);
  const navigate = useNavigate();

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
      <section>
        <div className="box-conteudo">
          
        {product ? (
  <div className="col-esquerda">
    <div className="imagem-principal">
      <div key={product.product_id} style={styles.card}>
        <img
          src={product.primary_image_url || 'default-image.png'}
          alt={product.name}
          style={styles.image}
        />
      </div>
    </div>
    <div className="opcoes">
      <img src="rascunho0.webp" alt="Opção 1" />
      <img src="rascunho1.webp" alt="Opção 2" />
      <img src="rascunho2.webp" alt="Opção 3" />
      <img src="rascunho3.webp" alt="Opção 4" />
    </div>
  </div>
) : (
  <p>Carregando detalhes do produto...</p>
)}

{product ? (
  <div className="col-direita">
    <div className="informacao-tamanho">
      <h1>{product.name}</h1>
      <h1>{product.hex_code}</h1>
      <p>Preço: {product.price} Mzn</p>
      <p style={{ textAlign: 'justify', maxWidth: '500px' }}>
        Descrição: {product.description}
      </p>
      
    <div className="colors">
    <span>Cores: </span>
                        {Array.isArray(product.colors) &&
                          product.colors.map((color, index) => (
                            <div
                              key={index}
                              className="color-box"
                              style={{ backgroundColor: color.hex_code }}
                              title={color.name}
                            />
                          ))}
                      </div>
      <p style={{ textDecoration: 'underline' }}>Selecione o tamanho:</p>
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
   
    <h4>Descrição:</h4>
    <p style={{ textAlign: 'justify', maxWidth: '500px' }}>
      {product.description}
    </p>
    <button style={styles.button} onClick={() => addToCart(product)}>
      Adicionar ao Carrinho
    </button>
  </div>
) : (
  <p>Carregando...</p>
)}

        </div>
      </section>

      
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    padding: '10px',
    margin: '10px',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ProdutoDetalhado;
