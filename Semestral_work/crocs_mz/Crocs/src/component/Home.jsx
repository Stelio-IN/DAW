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

            <div className="home-container-img"> </div>
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
     
        </article>
      </main>
    </div>
  );
};

export default Home;
