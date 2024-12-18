import React, { useState, useEffect, useRef } from 'react';
import '../assets/style/loja.css';

function Loja() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [gender, setGender] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Referência para o filtro de tamanho
  const tamanhoRef = useRef();

  // Função para detectar cliques fora do filtro de tamanho
  const handleClickOutside = (event) => {
    if (tamanhoRef.current && !tamanhoRef.current.contains(event.target)) {
      setActiveFilter(null); // Fecha o filtro quando clica fora
    }
  };

  // Adiciona o evento de clique fora do filtro quando o componente monta
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterClick = (filter) => {
    if (filter === 'tamanho') {
      setActiveFilter('tamanho'); // Mantém o filtro de tamanho aberto
    } else {
      setActiveFilter((prev) => (prev === filter ? null : filter));
    }
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender); // Define o gênero selecionado
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size); // Atualiza o tamanho selecionado
  };

  return (
    <div className="content-loja">
      <div className="shop_filter_container">
        <div className="filter_container">
          <div className="filtros">
            <h3>Filtros</h3>

            <div onClick={() => handleFilterClick('estilo')}>
              <h3>Estilo</h3>
              {activeFilter === 'estilo' && (
                <div className="filter-options">
                  <p>Casual</p>
                  <p>Formal</p>
                  <p>Esportivo</p>
                </div>
              )}
            </div>

            <div onClick={() => handleFilterClick('cor')}>
              <h3>Cor</h3>
              {activeFilter === 'cor' && (
                <div className="filter-options">
                  <p>Vermelho</p>
                  <p>Azul</p>
                  <p>Preto</p>
                </div>
              )}
            </div>

            {/* Filtro de Tamanho com seleção de Gênero */}
            <div onClick={() => handleFilterClick('tamanho')}>
              <h3>Tamanho</h3>
              {activeFilter === 'tamanho' && (
                <div className="filter-options" ref={tamanhoRef}>
                  {/* Menu de seleção de gênero */}
                  <div>
                    <p onClick={() => handleGenderChange('masculino')}>Homem</p>
                    <p onClick={() => handleGenderChange('feminino')}>Mulher</p>
                  </div>

                  {/* Exibe os tamanhos com base no gênero selecionado */}
                  {gender && (
                    <div>
                      <h4>Tamanhos disponíveis para {gender === 'masculino' ? 'Homem' : 'Mulher'}</h4>
                      <div className="size-options">
                        {gender === 'masculino' && (
                          <>
                            <p onClick={() => handleSizeChange('P')}>P</p>
                            <p onClick={() => handleSizeChange('M')}>M</p>
                            <p onClick={() => handleSizeChange('G')}>G</p>
                          </>
                        )}
                        {gender === 'feminino' && (
                          <>
                            <p onClick={() => handleSizeChange('PP')}>PP</p>
                            <p onClick={() => handleSizeChange('P')}>P</p>
                            <p onClick={() => handleSizeChange('M')}>M</p>
                            <p onClick={() => handleSizeChange('G')}>G</p>
                            <p onClick={() => handleSizeChange('GG')}>GG</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div onClick={() => handleFilterClick('preco')}>
              <h3>Preço</h3>
              {activeFilter === 'preco' && (
                <div className="filter-options">
                  <p>Abaixo de 1000 Mzn</p>
                  <p>1000 - 5000 Mzn</p>
                  <p>Acima de 5000 Mzn</p>
                </div>
              )}
            </div>
            
          </div>
        </div>

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
      </div>
    </div>
  );
}

export default Loja;
