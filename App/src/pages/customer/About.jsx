import React from "react";
import "../../assets/style/about.css";
import logo from "../../assets/img/Logo-Crocs.jpg";
const SobreNos = () => {
  return (
    <div className="about">

      {/* BANNER */}
      <section className="about-banner">
        <h1>Sobre a Nossa Loja</h1>
        <p>Conforto, Estilo e Qualidade para o seu dia a dia.</p>
      </section>

      {/* HISTORIA */}
      <section className="about-section">
        <div className="about-grid">
          <div className="about-image">
            <img  id="imagem1" src={logo} alt="" />
          </div>
          <div className="about-text">
            <h2>A Nossa História</h2>
            <p>
              Somos uma loja especializada em calçados e acessórios, focada em
              oferecer produtos de qualidade, conforto e estilo. Trabalhamos
              diariamente para garantir a melhor experiência de compra para os
              nossos clientes.
            </p>
          </div>
        </div>
      </section>

      {/* MISSAO */}
      <section className="about-section">
        <div className="about-grid reverse">
          <div className="about-image">
              <img  id="imagem2" src={logo} alt="" />
          </div>
          <div className="about-text">
            <h2>Nossa Missão</h2>
            <p>
              Oferecer produtos de qualidade com preços acessíveis, garantindo
              satisfação, confiança e uma excelente experiência de compra
              online.
            </p>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="about-values">
        <h2>Os Nossos Valores</h2>
        <div className="values-grid">
          <div className="value-card">Qualidade</div>
          <div className="value-card">Confiança</div>
          <div className="value-card">Inovação</div>
          <div className="value-card">Compromisso</div>
        </div>
      </section>
    </div>
  );
};

export default SobreNos;