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
      backgroundColor: 'red',
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
          {/* Section 1 */}
          <div className="Container">
            <div className="home-container">
              <h2>Crocs Mozambique</h2>
              <p>
                Novos modelos, com os últimos crocs. <br />
                Mais confortáveis do que nunca
              </p>
              <button id="shop_now">Comprar</button>
            </div>

            <div className="home-container-img"> </div>
          </div>

          {/* Section 2 */}
          <div className="Advantages-Container">
      <div className="Discount">
        <img src={coupon} alt="Desconto" />
        <p>Descontos todas semanas</p>
      </div>
      <div>
        <img src={onlineSupport} alt="Suporte" />
        <p>Suporte 24/7 dias</p>
      </div>
      <div>
        <img src={delivery} alt="Entrega" />
        <p>Entrega ao domicílio</p>
      </div>
      <div>
        <img src={creditCard} alt="Pagamento seguro" />
        <p>Pagamento seguro</p>
      </div>
    </div>






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


  {/* Section 3 */}
  <div className="Container_2">
            <div className="Container-content">
              <div className="promotion">
                
                  <h1>GATEWAYS</h1>
                  <h1>SANDALS</h1>
              </div>
              <p> CROCS™ | FEELS LIKE NOTHING AT ALL</p>
              <br />
              <p>  Oferta especial. Obtenha desconto em qualquer pedido, apenas válido
              por hoje.</p>

              <button> Comprar agora</button>
             
            </div>

            <div className="Container-promocional">
              <div>
                <h1 style={{ fontSize: '40pt', color: 'rgb(75, 134, 34)' }}>25%</h1>
                <p style={{ color: 'rgb(66, 67, 68)', lineHeight: 1.3 }}>
                  Oferta especial. Obtenha desconto em qualquer pedido, apenas válido
                  por hoje.
                </p>
              </div>
              <div>
                <img src={gif} />
              </div>
            </div>
          </div>



        </article>
      </main>
    </div>
  );
};

export default Home;
