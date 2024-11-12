import React, { useState } from 'react';
import '../assets/style/about.css';

const DetalhesProduto = () => {
  const [mainImage, setMainImage] = useState('rascunho0.webp');

  const handleImageClick = (src) => {
    setMainImage(src);
  };

  return (
    <div className='content-productDetail'>
      <section>
        <div className="container">
          <div className="left">
            <div className="main_image">
              <img src={mainImage} alt="Main Product" className="slide" />
            </div>
            <div className="option flex">
              <img src="rascunho0.webp" onClick={() => handleImageClick('rascunho0.webp')} alt="Option 1" />
              <img src="rascunho1.webp" onClick={() => handleImageClick('rascunho1.webp')} alt="Option 2" />
              <img src="rascunho2.webp" onClick={() => handleImageClick('rascunho2.webp')} alt="Option 3" />
              <img src="rascunho3.webp" onClick={() => handleImageClick('rascunho3.webp')} alt="Option 4" />
            </div>
          </div>

          <div className="right">
            <h1>Crocs Clássicos para Crianças</h1>
            <div className="size">
              <p>Cor: Amarelo</p>
              <p>Preço: 1200,00 Mzn</p>
              <p style={{ textDecoration: 'underline' }}>Selecione o tamanho:</p>
              <button className="btn_gender">HOMEM</button>
              <button className="btn_gender">MULHER</button>
            </div>
            <div className="tamanhos">
              {[7, 10, 15, 16, 19, 23, 25, 30, 31, 34, 36].map((size) => (
                <button key={size} className="btn_size">{size}</button>
              ))}
            </div>
            <h4>Descrição:</h4>
            <p style={{ textAlign: 'justify', maxWidth: '500px' }}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum dolor dignissimos...
            </p>
            <button className="btn_cart">Adicionar ao carrinho</button>
          </div>
        </div>
      </section>

      <div className="main">
        <header>
          <h1>Novas Tendências</h1>
          <p>
            <span>&#139;</span>
            <span>&#155;</span>
          </p>
        </header>
        <section>
          {[
            { img: 'teste2-removebg-preview.png', title: 'Cunhas', price: '4500 Mzn' },
            { img: 'teste4-removebg-preview.png', title: 'Clássicos', price: '5000 Mzn' },
            { img: 'teste3-removebg-preview.png', title: 'Sandálias Crocs', price: '5700 Mzn' },
            { img: 'teste2-removebg-preview.png', title: 'Tamancos', price: '3000 Mzn' },
            { img: 'teste6-removebg-preview.png', title: 'Sandálias', price: '1200 Mzn' },
            { img: 'teste4-removebg-preview.png', title: 'Clássicos', price: '450 Mzn' },
          ].map((product, index) => (
            <div className="product" key={index}>
              <picture>
                <img src={product.img} alt={product.title} />
              </picture>
              <div className="detail">
                <p>
                  <b>{product.title}</b><br />
                  <small>Novo</small>
                </p>
                <samp>{product.price}</samp>
              </div>
              <div className="button">
                <p className="star">
                  {Array(5).fill().map((_, i) => <strong key={i}>&star;</strong>)}
                </p>
                <a href="#"><img src="shopping-cart-solid.svg" alt="Cart" /></a>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default DetalhesProduto;
