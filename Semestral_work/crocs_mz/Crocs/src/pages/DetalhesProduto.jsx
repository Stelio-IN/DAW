import React, { useState } from 'react';
import '../assets/style/about.css';

const ProdutoDetalhado = () => {
  const [imagemPrincipal, setImagemPrincipal] = useState('rascunho0.webp');

  const aoClicarNaImagem = (src) => {
    setImagemPrincipal(src);
  };

  return (
    <div className='container-detalhes-produto'>
      <section>
        <div className="box-conteudo">
          <div className="col-esquerda">
            <div className="imagem-principal">
              <img src={imagemPrincipal} alt="Imagem Principal" className="imagem-slide" />
            </div>
            <div className="opcoes flexivel">
              <img src="rascunho0.webp" onClick={() => aoClicarNaImagem('rascunho0.webp')} alt="Opção 1" />
              <img src="rascunho1.webp" onClick={() => aoClicarNaImagem('rascunho1.webp')} alt="Opção 2" />
              <img src="rascunho2.webp" onClick={() => aoClicarNaImagem('rascunho2.webp')} alt="Opção 3" />
              <img src="rascunho3.webp" onClick={() => aoClicarNaImagem('rascunho3.webp')} alt="Opção 4" />
            </div>
          </div>

          <div className="col-direita">
            <h1>Crocs Clássicos para Crianças</h1>
            <div className="informacao-tamanho">
              <p>Cor: Amarelo</p>
              <p>Preço: 1200,00 Mzn</p>
              <p style={{ textDecoration: 'underline' }}>Selecione o tamanho:</p>
              <button className="botao-genero">HOMEM</button>
              <button className="botao-genero">MULHER</button>
            </div>
            <div className="lista-tamanhos">
              {[7, 10, 15, 16, 19, 23, 25, 30, 31, 34, 36].map((tamanho) => (
                <button key={tamanho} className="botao-tamanho">{tamanho}</button>
              ))}
            </div>
            <h4>Descrição:</h4>
            <p style={{ textAlign: 'justify', maxWidth: '500px' }}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum dolor dignissimos...
            </p>
            <button className="botao-carrinho">Adicionar ao carrinho</button>
          </div>
        </div>
      </section>

      <div className="secao-principal">
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
          ].map((produto, index) => (
            <div className="produto-item" key={index}>
              <picture>
                <img src={produto.img} alt={produto.title} />
              </picture>
              <div className="detalhes-produto">
                <p>
                  <b>{produto.title}</b><br />
                  <small>Novo</small>
                </p>
                <samp>{produto.price}</samp>
              </div>
              <div className="area-botao">
                <p className="classificacao">
                  {Array(5).fill().map((_, i) => <strong key={i}>&star;</strong>)}
                </p>
                <a href="#"><img src="shopping-cart-solid.svg" alt="Carrinho" /></a>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ProdutoDetalhado;
