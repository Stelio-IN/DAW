import React from "react";
import { useFavorites } from "../context/FavoritesContext.jsx";

const Favoritos = () => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="content">
      <main>
        <header>
          <h1>Seus Favoritos</h1>
        </header>
        <section>
          {favorites.length > 0 ? (
            favorites.map((product) => (
              <div key={product.product_id} className="product">
                <picture>
                  <img
                    src={product.primary_image_url}
                    alt={product.product_name}
                    loading="lazy"
                  />
                </picture>
                <div className="detail">
                  <p>{product.product_name}</p>
                  <samp>{product.price} MZN</samp>
                </div>
                <button onClick={() => toggleFavorite(product)}>
                  Remover dos Favoritos
                </button>
              </div>
            ))
          ) : (
            <p>Você ainda não tem favoritos.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Favoritos;
