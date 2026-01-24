import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/style/about.css';
import '../../assets/style/detalhesProduto.css';
import { useFavorites } from "../../context/FavoritesContext";

const JibbitzDetalhado = () => {
  const { jibbitzID } = useParams();
  const [jibbitz, setJibbitz] = useState(null);
  const [variantSelecionada, setVariantSelecionada] = useState(null);
  const [imagemPrincipal, setImagemPrincipal] = useState(null);

  const { favorites, toggleFavorite } = useFavorites();

  // Fetch jibbitz do backend
  useEffect(() => {
    if (jibbitzID) {
      fetch(`http://localhost:3005/api/jibbitz/jibs/${jibbitzID}`)
        .then((res) => res.json())
        .then((data) => setJibbitz(data))
        .catch((err) => console.error('Erro ao buscar detalhes do jibbitz:', err));
        console.log('o id do nosso jibbitz', jibbitzID)
    }
    
  }, [jibbitzID]);

  // Primeira variante por padrão
  useEffect(() => {
    if (jibbitz?.variants?.length > 0) {
      setVariantSelecionada(jibbitz.variants[0]);
    }
  }, [jibbitz]);

  // Atualiza imagem principal quando muda variante
  useEffect(() => {
    if (variantSelecionada?.images?.length > 0) {
      const primary = variantSelecionada.images.find(img => img.is_primary) || variantSelecionada.images[0];
      setImagemPrincipal(primary?.image_url);
    }
  }, [variantSelecionada]);

  // Adicionar ao carrinho
  const addToCart = () => {
    if (!jibbitz || !variantSelecionada) {
      alert("Selecione uma variante");
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    const itemToAdd = {
      jibbitz_id: jibbitz.jibbitz_id,
      name: jibbitz.name,
      variant_id: variantSelecionada.id,
      variant_label: variantSelecionada.variant_label,
      price: variantSelecionada.is_on_promotion ? variantSelecionada.promo_price : variantSelecionada.base_price,
      stock_quantity: variantSelecionada.stock_quantity,
      quantity: 1,
      image_url: imagemPrincipal
    };

    const existingIndex = currentCart.findIndex(item =>
      item.variant_id === itemToAdd.variant_id
    );

    if (existingIndex >= 0) {
      const existing = currentCart[existingIndex];
      if (existing.quantity < existing.stock_quantity) {
        existing.quantity += 1;
      }
    } else {
      currentCart.push(itemToAdd);
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    alert("Jibbitz adicionado ao carrinho");
  };

  if (!jibbitz) return <p style={{ padding: '40px', fontSize: '18px' }}>Carregando detalhes do Jibbitz...</p>;

  return (
    <div className="container-detalhes-produto">
      <section className="container_detalhes">

        {/* COLUNA ESQUERDA */}
        <div className="col-esquerda">
          <div className="imagem-principal">
            <img
              src={imagemPrincipal || "default.png"}
              alt={jibbitz.name}
              className="principal"
            />
          </div>

          <div className="opcoes">
            {variantSelecionada?.images?.map((img, idx) => (
              <img
                key={idx}
                src={img.image_url}
                alt="thumb"
                onClick={() => setImagemPrincipal(img.image_url)}
                style={{
                  cursor: 'pointer',
                  border: imagemPrincipal === img.image_url ? '2px solid black' : '1px solid #ddd',
                  borderRadius: '6px',
                  marginRight: '8px',
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover'
                }}
              />
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="col-direita">
          <h1>{jibbitz.name}</h1>

          {/* PREÇO */}
          <p style={{ fontWeight: 'bold', fontSize: '20pt' }}>
            {variantSelecionada?.is_on_promotion ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '10px' }}>
                  {variantSelecionada.base_price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </span>
                <span style={{ color: 'red' }}>
                  {variantSelecionada.promo_price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </span>
                <span style={{
                  background: 'red',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  marginLeft: '10px',
                  fontSize: '12px'
                }}>
                  -{variantSelecionada.discount_percentage}%
                </span>
              </>
            ) : (
              <span>
                {variantSelecionada?.base_price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
              </span>
            )}
          </p>

          <p style={{ maxWidth: '600px', fontStyle: 'italic' }}>
            {jibbitz.description}
          </p>

          {/* VARIANTES */}
          <p className="label">Variantes disponíveis</p>
          <div className="alternativas">
            {jibbitz.variants?.map((variant) => {
              const imagem = variant.images?.find(i => i.is_primary) || variant.images?.[0];
              return (
                <img
                  key={variant.id}
                  src={imagem?.image_url}
                  alt={variant.variant_label}
                  onClick={() => setVariantSelecionada(variant)}
                  style={{
                    cursor: 'pointer',
                    border: variantSelecionada?.id === variant.id ? '2px solid black' : '1px solid #ccc',
                    borderRadius: '6px',
                    marginRight: '8px',
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover'
                  }}
                />
              );
            })}
          </div>

          {/* BOTÕES */}
          <button className="cart" onClick={addToCart}>
            Adicionar ao Carrinho
          </button>

          <button onClick={() => toggleFavorite(jibbitz)} className="favor">
            {favorites.some(f => f.jibbitz_id === jibbitz.jibbitz_id)
              ? <span style={{ color: 'red' }}>Remover dos Favoritos</span>
              : "Adicionar aos Favoritos"}
          </button>

        </div>
      </section>
    </div>
  );
};

export default JibbitzDetalhado;
