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
import colecao_1 from '../assets/img/col1.avif';
import colecao_2 from '../assets/img/col2.avif';
import colecao_3 from '../assets/img/col3.avif';
import colecao_4 from '../assets/img/col4.avif';
import colecao_5 from '../assets/img/col5.avif';
import colecao_6 from '../assets/img/col6.avif';
import carrinhoSvg from '../assets/img/shopping-cart-solid.svg';
import crocs from '../assets/img/crocs1.webp';



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
            <h1>modelos novos</h1>
            <p> <b>CROCS™ </b>| SINTA-SE COMO NADA</p>
            </header>
            <section>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div className="product" key={index}>
                    <picture>
                      <img 
                        src={Array.isArray(product.images) && product.images.length > 0 
                          ? product.images[0].image_url 
                          : 'crocs1.webp'} 
                        alt={product.product_name} 
                      />
                    </picture>
                    <div className="detail">
                      <p>
                        {/*<b>Id: {product.product_id}</b>*/}
                        
                        <small>{product.product_name}</small>
                      </p>
                      <samp>{product.price} Mzn</samp>
                    </div>
                    <div className="button">
                      <div className="colors">
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
                      <button
                        className="product-button"
                        onClick={() => {
                          console.log(`Product ID: ${product.product_id}`);
                          navigate(`/produto/detalhes/${product.product_id}`);
                        }}
                      >
                      
                       <img src={carrinhoSvg} alt="Carrinho" />
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
                
                  <h1>SANDALIAS</h1>
                  <h1>ESTILOSAS</h1>
              </div>
              <p> CROCS™ | SINTA-SE COMO NUNCA ANTES</p>
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

  
          {/* Popular Collections */}
          <section className="carrosel_1">
            <div className="slider">
             
              <button>Coleções Populares</button>
              <div className="slide-track">
                {[colecao_1, colecao_2, colecao_3, colecao_4, colecao_5, colecao_6, colecao_1, colecao_2, colecao_3, colecao_4, colecao_5, colecao_6].map((img, index) => (
                  <div className="slide" key={index}>
                    <img src={img} alt={`Coleção ${index + 1}`} />
                    <p>Coleçao {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          
        
          <div className="main">
            <header>
              <h1>JIBBITZ recentes</h1>
              <p>FRESH DROPS | Personaliza os seus Crocs</p>
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
                      <button
                        className="product-button"
                        onClick={() => {
                          console.log(`Product ID: ${product.product_id}`);
                          navigate(`/produto/detalhes/${product.product_id}`);
                        }}
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

     

       {/* Section 4 */}
       <div className="Container-extended">
            <div></div>
            <div>
              <p>Novas sandálias clássicas</p>
              <p style={{ fontSize: '20pt', fontWeight: 'bold' }}>Mostre a verdadeira cor</p>
              <p style={{ textDecoration: 'underline' }}>Compre os clássicos</p>
            </div>
        </div>


        <div className='Categories'>
              <div className='categor'>
                <div className='producte'>
                  <img src={colecao_1} alt="" />
                  </div>
                <div className='Detalhes'>
                <h1> COLLABS</h1>
                  <p>CROCS™ | FEELS LIKE NOTHING AT AL</p>
                  </div>
                  <div className='btn_detalhes'>
                    <button>Comprar Agora</button>
                    </div>
              </div>

              <div className='categor'>
                <div className='producte'>
                <img src={colecao_2} alt="" />
                  </div>
                <div className='Detalhes'>
                <h1> GIFT CARDS</h1>
                <p>CROCS™ | FEELS LIKE NOTHING AT AL</p>
                  </div>
                  <div className='btn_detalhes'>
                    <button>Comprar Agora</button>
                    </div>
              </div>

              <div className='categor'>
                <div className='producte'><img src={colecao_3} alt="" /></div>
                <div className='Detalhes'>
                <h1> CROCS™ NOTHING</h1>
                <p>CROCS™ | FEELS LIKE NOTHING AT AL</p>
                  </div>
                  <div className='btn_detalhes'>
                    <button>Comprar Agora</button>
                    </div>
              </div>

              
          </div>
 
          
    
             
          {/* Catalog */}
          <div className="main" >
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
                      <button
                        className="product-button"
                        onClick={() => {
                          console.log(`Product ID: ${product.product_id}`);
                          navigate(`/produto/detalhes/${product.product_id}`);
                        }}
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
