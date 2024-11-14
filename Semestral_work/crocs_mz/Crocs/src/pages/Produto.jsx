import React, { useEffect, useState } from 'react';

function Produtos() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Fazendo a requisição para a API para buscar todos os produtos
    fetch('http://localhost:3005/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);  // O efeito será executado uma única vez quando o componente for montado

  // Estilo interno para os elementos
  const styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '20px',
    },
    box: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      width: '250px',
      padding: '16px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s',
      margin: '10px',
    },
    image: {
      width: '100%',
      height: 'auto',
      marginBottom: '12px',
    },
    productName: {
      fontSize: '18px',
      fontWeight: 'bold',
      margin: '12px 0',
    },
    price: {
      fontSize: '16px',
      color: '#555',
      marginBottom: '8px',
    },
    description: {
      fontSize: '14px',
      color: '#777',
      marginBottom: '8px',
    },
    stock: {
      fontSize: '14px',
      color: '#444',
      marginBottom: '12px',
    },
    colorBox: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      margin: '0 5px',
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '12px',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.container}>
      {products.length > 0 ? (
        products.map(product => (
          <div key={product.id} style={styles.box}>
            {/* Imagem do produto */}
            <img
              src={product.image_url || 'default-image.png'}
              alt={product.name}
              style={styles.image}
            />
            <h2 style={styles.productName}>{product.name}</h2>
            <span style={styles.price}>Preço: {product.price}$</span>
            <p style={styles.description}>{product.description}</p>
            <p style={styles.stock}>Estoque: {product.stock_quantity}</p>
            <div className="colors">
              {/* Exibindo a cor do produto */}
              <div
                style={{ ...styles.colorBox, backgroundColor: product.hex_code }}
                title={product.name}
              />
            </div>
            <button
              style={styles.button}
              onMouseOver={e => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseOut={e => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
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

export default Produtos;
