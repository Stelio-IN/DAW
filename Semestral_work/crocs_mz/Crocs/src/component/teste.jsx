import React from 'react';
import '../assets/style/loja.css';

const Loja = () => {
  return (
    <div className="content-loja">
    


      <div className="shop_filter_container">
        <div className="filter_container">
          <h3>Filtros</h3>
          <div>Estilo</div>
          <div>Cor</div>
          <div>Tamanho</div>
        </div>

        <div className="shop_content">
          <div className="shop-container">
            <ProductCard 
              imgSrc="teste3-removebg-preview.png"
              title="Nike Therma"
              price="70.88$"
              category="Sandals"
            />
            {/* Repita ou mapeie produtos */}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ imgSrc, title, price, category }) => {
  return (
    <div className="box">
      <img src={imgSrc} alt={title} />
      <h2>{title}</h2>
      <span>{price}</span>
      <button>{category}</button>
    </div>
  );
};

export default Loja;
