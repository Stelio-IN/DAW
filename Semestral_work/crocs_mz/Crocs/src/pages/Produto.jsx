import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Produtos() {
  const { productID } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (productID) {
      console.log(`O parâmetro productID foi capturado: ${productID}`);
      fetch(`http://localhost:3005/api/products/pr/${productID}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            console.error('Dados recebidos não são um array:', data);
          }
        })
        .catch(error => console.error('Erro ao buscar detalhes do produto:', error));
    }
  }, [productID]);

  // Função para adicionar um produto ao carrinho e salvar no localStorage
  const addToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...currentCart, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log('Produto adicionado ao carrinho:', product);
  };

  // Estilo dos elementos
  const styles = {
    container: {
      marginTop: '100px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
      padding: '20px',
    },
    card: {
      maxWidth: '300px',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    },
    image: {
      width: '100%',
      height: 'auto',
      marginBottom: '12px',
      borderRadius: '4px',
    },
    productName: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '12px 0',
    },
    price: {
      fontSize: '20px',
      color: '#555',
      marginBottom: '8px',
    },
    button: {
      padding: '10px 16px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      {products.length > 0 ? (
        products.map((product, index) => (
          <div key={index} style={styles.card}>
            <img 
              src={product.image_url || 'default-image.png'} 
              alt={product.name} 
              style={styles.image} 
            />
            <h2 style={styles.productName}>{product.name}</h2>
            <span style={styles.price}>Preço: {product.price}$</span>
            <p>{product.description}</p>
            <p>Estoque: {product.stock_quantity}</p>
            <button 
              style={styles.button} 
              onClick={() => addToCart(product)}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))
      ) : (
        <p>Carregando produtos...</p>
      )}
      <button 
        style={{ marginTop: '20px', padding: '10px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        onClick={() => navigate('/carrinho')}
      >
        Ver Carrinho
      </button>
    </div>
  );
}

export default Produtos;
