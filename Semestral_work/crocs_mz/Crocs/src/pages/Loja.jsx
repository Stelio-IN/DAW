import React from 'react';
import '../assets/style/loja.css';
const Loja = () => {
  return (

    <div className="content-loja">
    <div className="shop_filter_container">
      <div className="filter_container">
        <div className="filtros">
          <h3>Filtros</h3>
          <div>Estilo</div>
          <div>Cor</div>
          <div>Tamanho</div>
        </div>
      </div>

    
      <div className="catalog-container">
  <header className="catalog-header">
    <h1>Novas Tendências</h1>
  </header>
  <section className="catalog-items">
    {['teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png', 'teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png','teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png', 'teste2-removebg-preview.png', 'teste4-removebg-preview.png', 'teste6-removebg-preview.png'].map((img, index) => (
      <div className="catalog-product" key={index}>
        <picture className="catalog-image">
          <img src={img} alt={`Produto ${index + 1}`} />
        </picture>
        <div className="catalog-detail">
          <p>
            <b>Produto {index + 1}</b>
            <br />
            <small>Exclusivo</small>
          </p>
          <samp>4500 Mzn</samp>
        </div>
        <div className="catalog-button">
          <p className="catalog-stars">
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
