import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/style/about.css';
import '../../assets/style/detalhesProduto.css';
import { useFavorites } from "../../context/FavoritesContext";

const ProdutoDetalhado = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [imagemPrincipal, setImagemPrincipal] = useState(null);

  const { favorites, toggleFavorite } = useFavorites();

  // Função para ordenar tamanhos
  const ordenarTamanhos = (sizes = []) => {
    return [...sizes].sort((a, b) => {
      const aNum = parseInt(a.size);
      const bNum = parseInt(b.size);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }

      return a.size.localeCompare(b.size);
    });
  };

  // Fetch produto do backend
  useEffect(() => {
    if (productID) {
      fetch(`http://localhost:3005/api/products/pr/${productID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.product_id) {
            setProduct(data);
          }
        })
        .catch((err) => console.error('Erro ao buscar detalhes do produto:', err));
    }
  }, [productID]);

  // Primeira cor por padrão
  useEffect(() => {
  if (product?.colors?.length > 0) {
    const corComStock = product.colors.find(
      cor => cor.sizes && cor.sizes.length > 0
    );

    setCorSelecionada(corComStock || null);
  }
}, [product]);


  // Atualiza imagem principal quando muda cor
  useEffect(() => {
    if (corSelecionada?.images?.length > 0) {
      const imagem = corSelecionada.images.find(img => img.is_primary) || corSelecionada.images[0];
      setImagemPrincipal(imagem?.image_url);
    }
  }, [corSelecionada]);

  // Primeiro tamanho disponível por padrão
 useEffect(() => {
  if (corSelecionada?.sizes?.length > 0) {
    const sizesOrdenados = ordenarTamanhos(corSelecionada.sizes);
    const firstAvailable = sizesOrdenados.find(s => s.stock_quantity > 0);
    setTamanhoSelecionado(firstAvailable || null);
  } else {
    setTamanhoSelecionado(null);
  }
}, [corSelecionada]);


  // Função adicionar ao carrinho
  const addToCart = () => {
    if (!product || !corSelecionada || !tamanhoSelecionado) {
      alert("Selecione cor e tamanho");
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    const itemToAdd = {
      product_id: product.product_id,
      product_color_id: corSelecionada.product_color_id,
      product_color_size_id: tamanhoSelecionado.product_color_size_id,
      name: product.name,
      color: corSelecionada.name,
      hex_code: corSelecionada.hex_code,
      size: tamanhoSelecionado.size,
      size_type: tamanhoSelecionado.size_type,
      sku: tamanhoSelecionado.sku,

        // 🔥 Promoção
  promotion_id: tamanhoSelecionado.promotion_id || null,
  promo_stock_limit: tamanhoSelecionado.promo_stock_limit || null,
  promo_stock_used: tamanhoSelecionado.promo_stock_used || null,
  promotion_name: tamanhoSelecionado.promotion_name || null,
  cost_price: tamanhoSelecionado.cost_price,
      base_price: tamanhoSelecionado.base_price,
      promo_price: tamanhoSelecionado.promo_price,
      discount_percentage: tamanhoSelecionado.discount_percentage,
      is_on_promotion: tamanhoSelecionado.is_on_promotion,

      price: tamanhoSelecionado.is_on_promotion
        ? tamanhoSelecionado.promo_price
        : tamanhoSelecionado.base_price,

      stock_quantity: tamanhoSelecionado.stock_quantity,
      quantity: 1,
      image_url: imagemPrincipal
    };

    const existingIndex = currentCart.findIndex(item =>
      item.product_color_size_id === itemToAdd.product_color_size_id
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
    alert("Produto adicionado ao carrinho");
  };

  if (!product || !product.colors || product.colors.length === 0) {
  return (
    <p style={{ padding: '40px', fontSize: '18px' }}>
      Produto indisponível no momento
    </p>
  );
}


  if (!product) return <p>Carregando detalhes do produto...</p>;

  return (
    <div className="container-detalhes-produto">
      <section className="container_detalhes">

        {/* COLUNA ESQUERDA */}
        <div className="col-esquerda">
          <div className="imagem-principal">
            <img
              src={imagemPrincipal || "default.png"}
              alt={product.name}
              className="principal"
            />
          </div>

          <div className="opcoes">
            {corSelecionada?.images?.map((img, idx) => (
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
          <h1>{product.name}</h1>

          {/* PREÇO */}
          <p style={{ fontWeight: 'bold', fontSize: '20pt' }}>
           {tamanhoSelecionado?.is_on_promotion ? (
  <>
    {/* Preço original riscado */}
    <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '10px' }}>
      {tamanhoSelecionado.base_price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
    </span>

    {/* Preço promocional */}
    <span style={{ color: 'red' }}>
      {tamanhoSelecionado.promo_price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
    </span>

    {/* Percentagem de desconto */}
    <span style={{
      background: 'red',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '6px',
      marginLeft: '10px',
      fontSize: '12px'
    }}>
      -{tamanhoSelecionado.discount_percentage}%
    </span>

    {/* Nome da promoção */}
    {tamanhoSelecionado.promotion_name && (
      <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
        Promoção: {tamanhoSelecionado.promotion_name}
      </div>
    )}

    {/* Descrição da promoção */}
    {tamanhoSelecionado.promotion_description && (
      <div style={{ fontSize: '12px', color: '#777', marginTop: '2px' }}>
        {tamanhoSelecionado.promotion_description}
      </div>
    )}
  </>
) : (
  <span>
    {(tamanhoSelecionado?.base_price || product.base_price)
      .toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
  </span>
)}

          </p>

          <p style={{ maxWidth: '600px', fontStyle: 'italic' }}>
            {product.description}
          </p>

          {/* CORES */}
          <p className="label">Cores disponíveis</p>
          <div className="alternativas">
            {product.colors
              ?.filter(c => c.stock_quantity > 0)
              .map((cor) => {
                const imagem = cor.images?.find(i => i.is_primary) || cor.images?.[0];
                return (
                  <img
                    key={cor.product_color_id}
                    src={imagem?.image_url}
                    alt={cor.name}
                    onClick={() => setCorSelecionada(cor)}
                    style={{
                      cursor: 'pointer',
                      border: corSelecionada?.product_color_id === cor.product_color_id ? '2px solid black' : '1px solid #ccc',
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

          {/* TAMANHOS */}
          <p className="label">Tamanhos ({tamanhoSelecionado?.size_type})</p>
          <div className="lista-tamanhos">
            {ordenarTamanhos(corSelecionada?.sizes || [])
              .filter(t => t.stock_quantity > 0)
              .map(t => (
                <button
                  key={t.product_color_size_id}
                  className="botao-tamanho"
                  onClick={() => setTamanhoSelecionado(t)}
                  style={{
                    border: tamanhoSelecionado?.product_color_size_id === t.product_color_size_id
                      ? '2px solid black'
                      : '1px solid #aaa',
                    background: tamanhoSelecionado?.product_color_size_id === t.product_color_size_id
                      ? '#000'
                      : '#fff',
                    color: tamanhoSelecionado?.product_color_size_id === t.product_color_size_id
                      ? '#fff'
                      : '#000'
                  }}
                >
                  {t.size}
                  {t.is_on_promotion && (
                    <span style={{
                      fontSize: '10px',
                      color: 'red',
                      display: 'block'
                    }}>
                      -{t.discount_percentage}%
                    </span>
                  )}
                </button>
              ))}
          </div>

          {/* BOTÕES */}
          <button className="cart" onClick={addToCart}>
            Adicionar ao Carrinho
          </button>

          <button onClick={() => toggleFavorite(product)} className="favor">
            {favorites.some(f => f.product_id === product.product_id)
              ? <span style={{ color: 'red' }}>Remover dos Favoritos</span>
              : "Adicionar aos Favoritos"}
          </button>

        </div>
      </section>
    </div>
  );
};

export default ProdutoDetalhado;
