import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Produtos() {
  const { productID } = useParams(); // Captura o ID diretamente da URL como parte do path
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (productID) {
      console.log(`O parâmetro productID foi capturado: ${productID}`);
      fetch(`http://localhost:3005/api/products/pr/${productID}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data); // Define a lista de produtos
          } else {
            console.error('Dados recebidos não são um array:', data);
          }
        })
        .catch(error => console.error('Erro ao buscar detalhes do produto:', error));
    }
  }, [productID]);

  // Estilo para os "cards" e outros elementos
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
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adiciona sombra ao "card"
      backgroundColor: '#fff',
    },
    image: {
      width: '100%',
      height: 'auto',
      marginBottom: '12px',
      borderRadius: '4px', // Adiciona cantos arredondados à imagem
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
          </div>
        ))
      ) : (
        <p>Carregando produtos...</p>
      )}
    </div>
  );
}

export default Produtos;
