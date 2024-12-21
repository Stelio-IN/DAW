import React, { createContext, useContext, useState, useEffect } from "react";

// Cria o contexto
const FavoritesContext = createContext();

// Hook personalizado para acessar o contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites deve ser usado dentro de um FavoritesProvider");
  }
  return context;
};

// Provider do contexto
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    // Tenta carregar favoritos do localStorage
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Salva os favoritos no localStorage sempre que eles forem alterados
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Alternar entre adicionar/remover favoritos
  const toggleFavorite = (product) => {
    setFavorites((prev) =>
      prev.some((item) => item.product_id === product.product_id)
        ? prev.filter((item) => item.product_id !== product.product_id) // Remove se já está nos favoritos
        : [...prev, product] // Adiciona se não está nos favoritos
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
