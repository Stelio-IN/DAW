import React from 'react';
import '../assets/style/home.css';
import '../assets/style/slide.css';
import '../assets/style/catalogo.css';
import { Link } from 'react-router-dom';

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


const Home = () => {
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
              {['teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png', 'teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png'].map((img, index) => (
                <div className="product" key={index}>
                  <picture>
                    <img src={img} alt={`Produto ${index + 1}`} />
                  </picture>
                  <div className="detail">
                    <p>
                      <b>Produto {index + 1}</b>
                      <br />
                      <small>Exclusivo</small>
                    </p>
                    <samp>4500 Mzn</samp>
                  </div>
                  <div className="button">
                    <p className="star">
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                    </p>
                    <a href="#">
                      <img src="shopping-cart-solid.svg" alt="Carrinho" />
                    </a>
                  </div>
                </div>
              ))}
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


          
          {/* Popular Collections */}
          <section className="carrosel_1">
            <div className="slider">
              <h3 style={{ marginBottom: '5px' }}>Coleções Populares</h3>
              <div className="slide-track">
                {[colecao_1, colecao_2, colecao_3, colecao_4, colecao_5, colecao_6, colecao_1, colecao_2, colecao_3, colecao_4, colecao_5, colecao_6].map((img, index) => (
                  <div className="slide" key={index}>
                    <img src={img} alt={`Coleção ${index + 1}`} />
                    <p>Collection{index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          
        
          <div className="main">
            <header>
              <h1>Novas Tendências</h1>
            </header>
            <section>
              {['teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png', 'teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png'].map((img, index) => (
                <div className="product" key={index}>
                  <picture>
                    <img src={img} alt={`Produto ${index + 1}`} />
                  </picture>
                  <div className="detail">
                    <p>
                      <b>Produto {index + 1}</b>
                      <br />
                      <small>Exclusivo</small>
                    </p>
                    <samp>4500 Mzn</samp>
                  </div>
                  <div className="button">
                    <p className="star">
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                    </p>
                    <a href="#">
                      <img src="shopping-cart-solid.svg" alt="Carrinho" />
                    </a>
                  </div>
                </div>
              ))}
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
                <h1> CROCS™ | FEELS LIKE NOTHING AT ALL</h1>
                  <p>Oferta especial. Obtenha desconto em qualquer pedido, apenas válido</p>
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
                <h1> CROCS™ | FEELS LIKE NOTHING AT ALL</h1>
                <p>Oferta especial. Obtenha desconto em qualquer pedido, apenas válido</p>
                  </div>
                  <div className='btn_detalhes'>
                    <button>Comprar Agora</button>
                    </div>
              </div>

              <div className='categor'>
                <div className='producte'><img src={colecao_3} alt="" /></div>
                <div className='Detalhes'>
                <h1> CROCS™ | FEELS LIKE NOTHING AT ALL</h1>
                <p>Oferta especial. Obtenha desconto em qualquer pedido, apenas válido</p>
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
              {['teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png', 'teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png'].map((img, index) => (
                <div className="product" key={index}>
                  <picture>
                    <img src={img} alt={`Produto ${index + 1}`} />
                  </picture>
                  <div className="detail">
                    <p>
                      <b>Produto {index + 1}</b>
                      <br />
                      <small>Exclusivo</small>
                    </p>
                    <samp>4500 Mzn</samp>
                  </div>
                  <div className="button">
                    <p className="star">
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                      <strong>&star;</strong>
                    </p>
                    <a href="#">
                      <img src="shopping-cart-solid.svg" alt="Carrinho" />
                    </a>
                  </div>
                </div>
              ))}
            </section>
          </div>



        </article>
      </main>
    </div>
  );
};

export default Home;
