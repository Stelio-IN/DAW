// ProductCard.jsx
import React from 'react';

function ProductCard({ productName, productPrice, productColors, colorNames, productImage }) {
  return (
    <div>
      <img src={productImage} alt={productName} style={{ width: '100%' }} />
      <h3>{productName}</h3>
      <p>Preço: {productPrice}</p>
      <p>Cores disponíveis: {productColors}</p>
      <p>Nomes das cores: {colorNames}</p>
    </div>
  );
}

export default ProductCard; // Certifique-se de que há um export default aqui
