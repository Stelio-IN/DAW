import React from 'react';
import '../assets/style/home.css';

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

            <div className="home-container-img"></div>
          </div>

          {/* Section 2 */}
          <div className="Advantages-Container">
            <div className="Discount">
              <img src="coupon.png" alt="Desconto" />
              <p>Descontos todas semanas</p>
            </div>
            <div>
              <img src="online-support.png" alt="Suporte" />
              <p>Suporte 24/7 dias</p>
            </div>
            <div>
              <img src="delivery.png" alt="Entrega" />
              <p>Entrega ao domicílio</p>
            </div>
            <div>
              <img src="credit-card.png" alt="Pagamento seguro" />
              <p>Pagamento seguro</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="Container_2">
            <div className="Container-content">
              <p>A nova marca</p>
              <h2>Super Mega Promoção</h2>
              <p>
                Novos modelos que estão com uma super mega promoção. Aproveite agora
                mesmo, pois, essa promoção vai terminar a qualquer momento. Compre
                uma vez, e não se arrependa.
              </p>
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
                <img src="gif.gif" alt="Promoção" />
              </div>
            </div>
          </div>

          {/* Popular Collections */}
          <section className="carrosel_1">
            <div className="slider">
              <h3 style={{ marginBottom: '5px' }}>Coleções Populares</h3>
              <div className="slide-track">
                {['col1.avif', 'col2.avif', 'col3.avif', 'col4.avif', 'col5.avif', 'col6.avif'].map((img, index) => (
                  <div className="slide" key={index}>
                    <img src={img} alt={`Coleção ${index + 1}`} />
                    <p>Collection {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Shop Content */}
          <div className="heading">
            <h2>
              Novas<span>Tendência</span>
            </h2>
          </div>

          <div className="shop-container">
            {['teste3-removebg-preview.png', 'teste4-removebg-preview.png', 'teste5-removebg-preview.png', 'teste6-removebg-preview.png'].map((img, index) => (
              <div className="box" key={index}>
                <img src={img} alt={`Produto ${index + 1}`} />
                <h2>Nike Therma</h2>
                <span>70.88$</span>
                <button>Sneakers</button>
              </div>
            ))}
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

          {/* Catalog */}
          <div className="main">
            <header>
              <h1>Novas Tendências</h1>
            </header>
            <section>
              {['teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png'].map((img, index) => (
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