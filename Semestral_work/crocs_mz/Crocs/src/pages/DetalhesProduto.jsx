import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/style/about.css';
import '../assets/style/detalhesProduto.css';

const ProdutoDetalhado = () => {
  const { productID } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (productID) {
      console.log(`O parâmetro productID foi capturado: ${productID}`);
      fetch(`http://localhost:3005/api/products/pr/${productID}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProducts(data);
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
          <div className="col-esquerda">
            <div className="imagem-principal">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div key={index} style={styles.card}>
                    <img
                      src={product.image_url || 'default-image.png'}
                      alt={product.name}
                      style={styles.image}
                    />
                  </div>
                ))
              ) : (
                <p>Carregando produtos...</p>
              )}
            </div>
            <div className="opcoes flexivel">
              <img src="rascunho0.webp" alt="Opção 1" />
              <img src="rascunho1.webp" alt="Opção 2" />
              <img src="rascunho2.webp" alt="Opção 3" />
              <img src="rascunho3.webp" alt="Opção 4" />
            </div>
          </div>

          <div className="col-direita">
            {products.map((product, index) => (
              <React.Fragment key={index}>
                <h1>{product.name}</h1>
                <div className="informacao-tamanho">
                  <p>Cor: Amarelo</p>
                  <p>Preço: {product.price}$</p>
                  <p style={{ textDecoration: 'underline' }}>
                    Selecione o tamanho:
                  </p>
                  <button className="botao-genero">HOMEM</button>
                  <button className="botao-genero">MULHER</button>
                </div>
                <div className="lista-tamanhos">
                  {[7, 10, 15, 16, 19, 23, 25, 30, 31, 34, 36].map((tamanho) => (
                    <button
                      key={tamanho}
                      className="botao-tamanho"
                    >
                      {tamanho}
                    </button>
                  ))}
                </div>
                <h4>Descrição:</h4>
                <p style={{ textAlign: 'justify', maxWidth: '500px' }}>
                  {product.description}
                </p>
                <p>Estoque: {product.stock_quantity}</p>
                <button
                  style={styles.button}
                  onClick={() => addToCart(product)}
                >
                  Adicionar ao Carrinho
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <div className="secao-principal">
        <header>
          <h1>Novas Tendências</h1>
          <p>
            <span>&#139;</span>
            <span>&#155;</span>
          </p>
        </header>
      </div>
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
