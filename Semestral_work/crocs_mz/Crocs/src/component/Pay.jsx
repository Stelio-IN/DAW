import React, {useState, useEffect} from 'react';
import '../assets/style/pagamento.css';
import  '../assets/style/loja.css';

const  Pagamento = () => {
    return (
            <div className='content-pagamento'>

            <div className='pagamento'>

            <div className="catalog-container">
          <header className="catalog-header">
            <h1>Novas Tendências</h1>
          </header> 
          <section className="catalog-items">
            {[...Array(12)].map((_, index) => (
              <div className="catalog-product" key={index}>
                <picture className="catalog-image">
                  <img src={`teste${(index % 3) + 2}-removebg-preview.png`} alt={`Produto ${index + 1}`} />
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

             <div></div>

            </div>




            </div>
    );
};