import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/style/home.css';
import '../assets/style/slide.css';
import '../assets/style/catalogo.css';

// Images
import coupon from '../assets/img/coupon.png';
import onlineSupport from '../assets/img/online-support.png';
import delivery from '../assets/img/delivery.png';
import creditCard from '../assets/img/credit-card.png';
import gif from '../assets/img/gif.gif';

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching products from the API
    fetch('http://localhost:3005/api/products/pr')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  const styles = {
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
    <div className='content'>
      <main>
        <article>
          <div className="main">
            <header>
              <h1>Novas Tendências</h1>
            </header>
            <section>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div className="product" key={index}>
                    <picture>
                      <img 
                        src={Array.isArray(product.images) && product.images.length > 0 
                          ? product.images[0].image_url 
                          : 'default-image.png'} 
                        alt={product.product_name} 
                      />
                    </picture>
                    <div className="detail">
                      <p>
                        <b>Id: {product.product_id}</b>
                        <br />
                        <small>{product.product_name}</small>
                      </p>
                      <samp>{product.price} Mzn</samp>
                    </div>
                    <div className="button">
                      <div className="colors">
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
                        onClick={() => {
                          console.log(`Product ID: ${product.product_id}`);
                          navigate(`/produto/detalhes/${product.product_id}`);
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                      >
                        Ver Produto
                        <img src="shopping-cart-solid.svg" alt="Carrinho" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Carregando produtos...</p>
              )}
            </section>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Home;
