import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/style/loja.css";
import { useFavorites } from "../../context/FavoritesContext";
import {  FiHeart, FiFilter } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
function Loja() {
  const [openFilters, setOpenFilters] = useState([]); // Array para filtros abertos
  const [genders, setGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    min: 0,
    max: 5000,
  });
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [sortOption, setSortOption] = useState("A-Z");
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroOpen, setFiltroOpen] = useState(false);
  const [products, setProducts] = useState([]); // Novidade: produtos buscados
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const tamanhoRef = useRef();
const [currency, setCurrency] = useState("MZN"); 
  const toggleFiltro = () => setFiltroOpen(!filtroOpen);

  const handleClickOutside = (event) => {
    if (tamanhoRef.current && !tamanhoRef.current.contains(event.target)) {
      // não faz nada
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateAppliedFilters = (filterType, filterLabel) => {
    let updatedFilters = [...appliedFilters];
    const filterIndex = updatedFilters.findIndex(
      (filter) => filter.label === filterLabel
    );

    if (filterIndex === -1) {
      updatedFilters.push({ type: filterType, label: filterLabel });
    } else {
      updatedFilters = updatedFilters.filter(
        (filter) => filter.label !== filterLabel
      );
    }

    setAppliedFilters(updatedFilters);
  };

  // Busca dados estáticos para filtros
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, sizeRes, genderRes, colorRes] = await Promise.all([
          fetch("http://localhost:3005/api/categories"),
          fetch("http://localhost:3005/api/sizes"),
          fetch("http://localhost:3005/api/gender"),
          fetch("http://localhost:3005/api/colors"),
        ]);
        setCategories(await catRes.json());
        setSizes(await sizeRes.json());
        setGenders(await genderRes.json());
        setColors(await colorRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Monta query string e busca produtos
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();

      if (selectedCategories.length > 0) params.append("category", selectedCategories.join(","));
      if (selectedGender.length > 0) params.append("gender", selectedGender.join(","));
      if (selectedColor.length > 0) params.append("color", selectedColor.join(","));
      if (selectedSizes.length > 0) params.append("size", selectedSizes.join(","));
      if (selectedPriceRange.min !== 0) params.append("priceMin", selectedPriceRange.min);
      if (selectedPriceRange.max !== 5000) params.append("priceMax", selectedPriceRange.max);
      if (searchTerm.trim() !== "") params.append("search", searchTerm.trim());

      const res = await fetch(`http://localhost:3005/api/products/pr/filters?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Sempre que qualquer filtro, preço ou search mudar, busca produtos
  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedGender, selectedColor, selectedSizes, selectedPriceRange, searchTerm]);

  // Seleção de filtros
  const handleCategorySelect = (categoryId) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(updated);
    const label = categories.find((c) => c.category_id === categoryId)?.name;
    updateAppliedFilters("Category", label);
  };

  const handleGenderSelect = (genderId) => {
    const updated = selectedGender.includes(genderId)
      ? selectedGender.filter((id) => id !== genderId)
      : [...selectedGender, genderId];
    setSelectedGender(updated);
    const label = genders.find((g) => g.gender_id === genderId)?.name;
    updateAppliedFilters("Gender", label);
  };

  const handleColorSelect = (colorId) => {
    const updated = selectedColor.includes(colorId)
      ? selectedColor.filter((id) => id !== colorId)
      : [...selectedColor, colorId];
    setSelectedColor(updated);
    const label = colors.find((c) => c.color_id === colorId)?.name;
    updateAppliedFilters("Color", label);
  };

  const handleSizeSelect = (sizeId) => {
    const updated = selectedSizes.includes(sizeId)
      ? selectedSizes.filter((id) => id !== sizeId)
      : [...selectedSizes, sizeId];
    setSelectedSizes(updated);
    const label = sizes.find((s) => s.size_id === sizeId)?.size;
    updateAppliedFilters("Size", label);
  };

  const handlePriceChange = (field, value) => {
    const newRange = { ...selectedPriceRange, [field]: Number(value) };
    if (newRange.min <= newRange.max) setSelectedPriceRange(newRange);
    else setError("Preço mínimo deve ser menor ou igual ao máximo");
  };

  // Abre ou fecha filtro individual
  const handleFilterClick = (filter) => {
    setOpenFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };


   const convertPrice = (price, targetCurrency) => {
    if (targetCurrency === "MZN") {
      return price.toFixed(2); // Retorna o preço original se for MZN ou a taxa não existir
    }
  };

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

            <div className="applied-filters">
              {appliedFilters.map((f, i) => (
                <div key={i} className="filter-tag">
                  <span>{f.label}</span>
                </div>
              ))}
            </div>

            {/* Categoria */}
            <div onClick={() => handleFilterClick("estilo")}>
              <h4>Estilo</h4>
              {openFilters.includes("estilo") && (
                <div className="filter-options">
                  {categories.map((c) => (
                    <label key={c.category_id}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c.category_id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleCategorySelect(c.category_id)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Cores */}
            <div onClick={() => handleFilterClick("cor")}>
              <h4>Cor</h4>
              {openFilters.includes("cor") && (
                <div className="filter-options">
                  {colors.map((c) => (
                    <label key={c.color_id}>
                      <input
                        type="checkbox"
                        checked={selectedColor.includes(c.color_id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleColorSelect(c.color_id)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Tamanho (sem tipo) */}
            <div onClick={() => handleFilterClick("tamanho")}>
              <h4>Tamanho</h4>
              {openFilters.includes("tamanho") && (
                <div className="filter-options" ref={tamanhoRef}>
                  {sizes.map((s) => (
                    <label key={s.size_id}>
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(s.size_id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleSizeSelect(s.size_id)}
                      />
                      {s.size}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Gênero */}
            <div onClick={() => handleFilterClick("genero")}>
              <h4>Gênero</h4>
              {openFilters.includes("genero") && (
                <div className="filter-options">
                  {genders.map((g) => (
                    <label key={g.gender_id}>
                      <input
                        type="checkbox"
                        checked={selectedGender.includes(g.gender_id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleGenderSelect(g.gender_id)}
                      />
                      {g.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Preço */}
            <div onClick={() => handleFilterClick("preco")}>
              <h4>Preço</h4>
              {openFilters.includes("preco") && (
                <div className="filter-options">
                  <label>Mínimo:</label>
                  <input
                    type="number"
                    value={selectedPriceRange.min}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                  />
                  <label>Máximo:</label>
                  <input
                    type="number"
                    value={selectedPriceRange.max}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pesquisa e ordenação */}
        <div className="catalog-container1">
          <input
            type="text"
            className="inputpesquisa"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="sort-by">
            <p>Ordenar por:</p>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="mais-vendidos">Mais Vendidos</option>
              <option value="preco-crescente">Preço: Menor para Maior</option>
              <option value="preco-decrescente">Preço: Maior para Menor</option>
            </select>
          </div>

          
          <header className="catalog-header">
            <h3>Filtros aplicáveis</h3>
          </header>

          <label htmlFor="filtragem" className="filtragem" onClick={toggleFiltro}>
            <i className="bx bx-x"> Filtros </i>
            <p><FiFilter /></p>
          </label>

          <section className="catalog-items1">
                      {products.length > 0 ? (
                        products.map((product) => (
                          <div className="catalog-product1" key={product.product_id}>
                            <picture className="catalog-image1">
                              <img
                                src={product.primary_image_url}
                                alt={product.product_name}
                                loading="lazy"
                              />
                            </picture>
                            <div className="catalog-detail1">
                              <p>
                                <small>{product.product_name}</small>
                              </p>
                              <p>
                                <samp>
                                 {product.base_price} Mzn
                                </samp>
                              </p>
                            </div>
                            <div className="catalog-button1">
                              <div className="colors">
                            {Array.isArray(product.colors) &&
                              // Filtra cores únicas pelo color_id
                              Array.from(
                                new Map(product.colors.map(c => [c.color_id, c])).values()
                              ).map((color) => (
                                <div
                                  key={color.color_id}
                                  className="color-box"
                                  style={{ backgroundColor: color.hex_code }}
                                  title={color.name}
                                />
                              ))}
                          </div>
                              <button
                                className="product-button1"
                                onClick={() =>
                                  navigate(`/produto/detalhes/${product.product_id}`)
                                }
                              >
                                Ver mais
                              </button>
                              <button
                                className="btn_favorito"
                                onClick={() => {
                                  console.log("Produto favorito clicado:", product);
                                  toggleFavorite(product);
                                }}
                              >
                                {favorites.some(
                                  (item) => item.product_id === product.product_id,
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

export default Loja;
