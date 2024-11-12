import React, { useEffect, useState } from 'react';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fazendo a requisição para a API
    fetch('http://localhost:3005/api/products/pr')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  // Estilo interno
  const styles = {
    shopContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '20px',
      justifyContent: 'center',
    },
    box: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '200px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
    },
    img: {
      width: '100%',
      height: 'auto',
      borderRadius: '4px',
      marginBottom: '12px',
    },
    productName: {
      fontSize: '18px',
      margin: '8px 0',
      color: '#333',
    },
    price: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '12px',
    },
    colorsContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '12px',
    },
    button: {
      padding: '8px 12px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      textTransform: 'uppercase',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.shopContainer}>
      {products.length > 0 ? (
        products.map(product => (
          <div
            key={product.product_id}
            style={styles.box}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={product.images.length > 0 ? product.images[0].image_url : 'default-image.png'}
              alt={product.product_name}
              style={styles.img}
            />
            <h2 style={styles.productName}>{product.product_id}</h2>
            <h2 style={styles.productName}>{product.product_name}</h2>
            <span style={styles.price}>{product.price}$</span>
            <div style={styles.colorsContainer}>
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: color.hex_code,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    margin: '0 5px',
                  }}
                  title={color.name}
                />
              ))}
            </div>
            <button
              style={styles.button}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
            >
              Ver Produto
            </button>
          </div>
        ))
      ) : (
        <p>Carregando produtos...</p>
      )}
    </div>
  );
}

export default Home;
