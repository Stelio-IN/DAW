import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../assets/style/loja.css";
import { FiFilter, FiHeart, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useFavorites } from "../../context/FavoritesContext";

function LojaJibbitz() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jibbitzCategoryFromUrl = searchParams.get("jibbitzCategory");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [error, setError] = useState(null);

  // =========================
  // Fetch de categorias de Jibbitz
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/jibbitz/categories");
        if (!res.ok) throw new Error("Erro ao buscar categorias");
        const data = await res.json();
        setCategories(data);

        if (jibbitzCategoryFromUrl) {
          const categoryExists = data.some(
            (cat) => cat.category_id === parseInt(jibbitzCategoryFromUrl),
          );
          if (categoryExists) {
            handleCategorySelect(parseInt(jibbitzCategoryFromUrl), true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [jibbitzCategoryFromUrl]);

  // =========================
  // Fetch de todos os jibbitz inicialmente
  // =========================
  useEffect(() => {
    if (!jibbitzCategoryFromUrl) {
      const fetchAllJibbitz = async () => {
        try {
          const res = await fetch("http://localhost:3005/api/jibbitz/jibs/");
          if (!res.ok) throw new Error("Erro ao buscar Jibbitz");
          const data = await res.json();
          setProducts(data);
        } catch (err) {
          console.error(err);
          setError("Erro ao carregar produtos");
        }
      };
      fetchAllJibbitz();
    }
  }, [jibbitzCategoryFromUrl]);

  // =========================
  // Lidar com filtro por categoria
  // =========================
  const handleCategorySelect = async (categoryId, fromUrl = false) => {
    const alreadySelected = selectedCategories.includes(categoryId);
    let newSelected = [];

    if (alreadySelected && !fromUrl) {
      newSelected = selectedCategories.filter((id) => id !== categoryId);
    } else {
      newSelected = [...selectedCategories, categoryId];
    }

    setSelectedCategories(newSelected);

    try {
      if (newSelected.length === 0) {
        const res = await fetch("http://localhost:3005/api/jibbitz/jibs/");
        const data = await res.json();
        setProducts(data);
      } else {
        const res = await fetch(
          `http://localhost:3005/api/jibbitz/jibs/category/${categoryId}`,
        );
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao filtrar produtos");
    }
  };

  // =========================
  // Remover filtro clicando no "x"
  // =========================
  const removeFilter = (categoryId) => {
    handleCategorySelect(categoryId);
  };

  const toggleFiltro = () => setActiveFilter(activeFilter ? null : "categoria");

  return (
    <div className="content-loja1">
      <div className="shop_filter_container">
        <input type="radio" id="filtragem" name="menu_toggle" />
        <input type="radio" id="cancel_filtragem" name="menu_toggle" />

        <div className="filter_container">
          <label
            htmlFor="cancel_filtragem"
            className="cancel_filtragem"
            onClick={toggleFiltro}
          >
            &times;
          </label>

          <div className="filtros">
            <h3>Filtros</h3>

            {/* Filtros aplicados */}
            {selectedCategories.length > 0 && (
              <div className="applied-filters">
                {selectedCategories.map((catId) => {
                  const cat = categories.find((c) => c.category_id === catId);
                  return (
                    <div key={catId} className="filter-tag">
                      <span>{cat?.name}</span>
                      <FiX
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() => removeFilter(catId)}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Checkboxes de categorias */}
            <div onClick={() => setActiveFilter("categoria")}>
              <h4>Categoria</h4>
              {activeFilter === "categoria" && (
                <div className="filter-options">
                  {categories.map((cat) => (
                    <label key={cat.category_id}>
                      <input
                        type="checkbox"
                        value={cat.category_id}
                        checked={selectedCategories.includes(cat.category_id)}
                        onChange={() => handleCategorySelect(cat.category_id)}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="catalog-container1">
          <header className="catalog-header">
            <h3>Jibbitz</h3>
          </header>

          <label
            htmlFor="filtragem"
            className="filtragem"
            onClick={toggleFiltro}
          >
            <FiFilter /> Filtros
          </label>

          <section className="catalog-items1">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="catalog-product1" key={product.jibbitz_id}>
                  <picture className="catalog-image1">
                    <img
                      src={product.primary_image_url}
                      alt={product.name}
                      loading="lazy"
                    />
                    {product.is_on_promotion && product.discount_percentage && (
                      <div className="promotion-badge">
                        {product.discount_percentage}% OFF
                      </div>
                    )}
                  </picture>

                  <div className="catalog-detail1">
                    <p>
                      <small>{product.name}</small>
                    </p>

                    {product.is_on_promotion && product.promo_price ? (
                      <samp className="price-container">
                        <span className="original-price">
                          {product.base_price} MZN
                        </span>
                        <strong className="promo-price">
                          {product.promo_price} MZN
                        </strong>
                        {product.promotion_name && (
                          <div className="promotion-name">
                            {product.promotion_name}
                          </div>
                        )}
                      </samp>
                    ) : (
                      <samp className="price-container">
                        {product.base_price} MZN
                      </samp>
                    )}
                  </div>

                  <div className="catalog-button1">
                    <button
                      className="product-button1"
                      onClick={() =>
                        navigate(`/jibbitz/detalhes/${product.jibbitz_id}`)
                      }
                    >
                      Ver mais
                    </button>
                    <button
                      className="btn_favorito"
                      onClick={() => toggleFavorite(product)}
                    >
                      {favorites.some(
                        (item) => item.product_id === product.jibbitz_id,
                      ) ? (
                        <FaHeart color={"gray"} />
                      ) : (
                        <FiHeart size={25} />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Não há produtos nessa categoria.</p>
            )}
          </section>
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LojaJibbitz;
