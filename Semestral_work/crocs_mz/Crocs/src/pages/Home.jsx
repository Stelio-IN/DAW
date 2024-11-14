import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Criando a função de navegação

  useEffect(() => {
    // Fazendo a requisição para a API
    fetch('http://localhost:3005/api/products/pr')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  // Estilo interno para os elementos
  const styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
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
          <div 
            className="box" 
            key={product.product_id} 
            style={styles.box}
          >
            {/* Usando a primeira imagem como exemplo */}
            <img 
              src={Array.isArray(product.images) && product.images.length > 0 
                ? product.images[0].image_url 
                : 'default-image.png'} 
              alt={product.product_name} 
              style={styles.image}
            />
            <h2 style={styles.productName}>Id: {product.product_id}</h2>
            <h2 style={styles.productName}>Nome: {product.product_name}</h2>
            <h2 style={styles.productName}>Cores: {product.color_count}</h2>
            <span style={styles.price}>Preço: {product.price}$</span>
            <div className="colors">
              {/* Verificação para garantir que product.colors é um array */}
              {Array.isArray(product.colors) && product.colors.map((color, index) => (
                <div 
                  key={index} 
                  style={{ ...styles.colorBox, backgroundColor: color.hex_code }}
                  title={color.name}
                />
              ))}
            </div>
            <button 
              style={styles.button}
              onClick={() => navigate(`/produto/${product.product_id}`)} // Navegando para a rota com ID
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

export default Home;
