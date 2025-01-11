import React from "react";
import { useFavorites } from "../context/FavoritesContext.jsx";
import '../assets/style/favorito.css'
const Favoritos = () => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="content-favorite">
      <div className="contentoo">
        <main>
          <header className="cabecalho">
            <h1>Meus Favoritos</h1>
          </header>
          <section className="favoritoo">
            {favorites.length > 0 ? (
              favorites.map((product) => (
                <div key={product.product_id} className="productoo">
                  <picture>
                    <img
                      src={product.primary_image_url}
                      alt={product.product_name}
                      loading="lazy"
                    />
                  </picture>
                  <div className="detaill">
                    <p>{product.product_name}</p>
                    <samp>{product.price} MZN</samp>
                  </div>
                  <button onClick={() => toggleFavorite(product)} className="remove">
                    Remover
                  </button>
                  <button onClick={() => toggleFavorite(product)} className="add">
                 Adicionar ao carrinho
                  </button>
                </div>
              ))
            ) : (
              <p>Você ainda não tem favoritos.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Favoritos;
