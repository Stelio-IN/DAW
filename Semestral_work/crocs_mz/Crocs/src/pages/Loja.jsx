import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style/loja.css";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";
function Loja() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [gender, setGender] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [selectedPriceRange, setSelectedPriceRange] = React.useState({
    min: 0,
    max: 5000,
  });
  const [sortOption, setSortOption] = useState("a-z");
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();


  

  // Referência para o filtro de tamanho
  const tamanhoRef = useRef();

  // Função para detectar cliques fora do filtro de tamanho
  const handleClickOutside = (event) => {
    if (tamanhoRef.current && !tamanhoRef.current.contains(event.target)) {
      setActiveFilter(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortProducts = (products, sortOption) => {
    if (sortOption === "A-Z") {
      return [...products].sort((a, b) =>
        a.product_name.localeCompare(b.product_name)
      );
    }
    if (sortOption === "Z-A") {
      return [...products].sort((a, b) =>
        b.product_name.localeCompare(a.product_name)
      );
    }
    if (sortOption === "preco-crescente") {
      return [...products].sort((a, b) => a.price - b.price);
    }
    if (sortOption === "preco-decrescente") {
      return [...products].sort((a, b) => b.price - a.price);
    }
    return products; // Padrão: sem ordenação específica
  };

  useEffect(() => {
    const sortedProducts = sortProducts(products, sortOption);
    setProducts(sortedProducts);
  }, [sortOption, products]);

  // Save filter state to localStorage
  const saveFiltersToLocalStorage = () => {
    localStorage.setItem("activeFilter", activeFilter);
    localStorage.setItem("gender", gender);
    localStorage.setItem("selectedSizes", JSON.stringify(selectedSizes));
    localStorage.setItem(
      "selectedPriceRange",
      JSON.stringify(selectedPriceRange)
    );
  };

  // Load filter state from localStorage
  const loadFiltersFromLocalStorage = () => {
    const storedActiveFilter = localStorage.getItem("activeFilter");
    const storedGender = localStorage.getItem("gender");
    const storedSelectedSizes = JSON.parse(
      localStorage.getItem("selectedSizes") || "[]"
    );
    const storedSelectedPriceRange = JSON.parse(
      localStorage.getItem("selectedPriceRange") || '{"min":0,"max":10000}'
    );

    if (storedActiveFilter) setActiveFilter(storedActiveFilter);
    if (storedGender) setGender(storedGender);
    if (storedSelectedSizes.length > 0) setSelectedSizes(storedSelectedSizes);
    if (storedSelectedPriceRange)
      setSelectedPriceRange(storedSelectedPriceRange);
  };

  useEffect(() => {
    loadFiltersFromLocalStorage();
  }, []);

  useEffect(() => {
    saveFiltersToLocalStorage();
  }, [activeFilter, gender, selectedSizes, selectedPriceRange]);

  const handleFilterClick = (filter) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
  };

  const handleCheckboxChange = (event, setState) => {
    const { value, checked } = event.target;
    setState((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender); // Define o gênero selecionado
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size); // Atualiza o tamanho selecionado
  };

  // Busca os produtos ao carregar o componente
  useEffect(() => {
    fetchProducts(); // Busca sem filtro inicialmente
  }, []);

  // Manipula a pesquisa
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    fetchProducts(value); // Faz a busca conforme o termo
  };

  // moeda conversao

  const [currency, setCurrency] = useState("MZN"); // Moeda padrão
  const [exchangeRates, setExchangeRates] = useState({}); // Taxas de câmbio

  // Função para buscar taxas de câmbio dinamicamente
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/MZN"
        );
        const data = await response.json();
        setExchangeRates(data.rates); // Define todas as taxas disponíveis
      } catch (error) {
        console.error("Erro ao buscar taxas de câmbio:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Função para converter o preço
  const convertPrice = (price, targetCurrency) => {
    if (targetCurrency === "MZN" || !exchangeRates[targetCurrency]) {
      return price.toFixed(2); // Retorna o preço original se for MZN ou a taxa não existir
    }
    return (price * exchangeRates[targetCurrency]).toFixed(2);
  };

  // Atualizar moeda selecionada
  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
  };

  // Fetching all products from the API
  const fetchProducts = async (search = "") => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/products/pr?search=${search}`
      );
      const data = await response.json();
      setProducts(sortProducts(data, sortOption));
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // Função para buscar produtos por categoria
  const fetchProductsByCategory = async (categoryId) => {
    if (!categoryId) {
      console.error("Categoria inválida");
      return;
    } else {
      console.log("categoria valida");
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/products/pr/byCategory/${categoryId}`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Atualiza o estado de produtos no componente pai
      } else {
        setError("Erro ao buscar produtos.");
      }
    } catch (error) {
      setError("Erro de conexão.");
    }
  };

  // Função para buscar produtos por cor
  const fetchProductsByColor = async (colorId) => {
    if (!colorId) {
      console.error("Cor  inválida");
      return;
    } else {
      console.log("cor valida");
    }
    try {
      const response = await fetch(
        `http://localhost:3005/api/products/pr/byColor/${colorId}`
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Atualiza o estado de produtos no componente pai
      } else {
        setError("Erro ao buscar produtos.");
      }
    } catch (error) {
      setError("Erro de conexão.");
    }
  };

  // Buscar categorias ao carregar o componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Erro ao buscar categorias");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchCategories();
  }, []);

  // Buscar cores ao carregar o componente
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/colors");
        if (response.ok) {
          const data = await response.json();
          setColors(data);
        } else {
          console.error("Erro ao buscar cores");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchColors();
  }, []);

  // Função para selecionar uma categoria
  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId);
    fetchProductsByColor(colorId); // Busca produtos ao selecionar a categoria
  };

  // Função para selecionar uma categoria
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProductsByCategory(categoryId); // Busca produtos ao selecionar a categoria
  };

  // Busca pelo preco do produto
  const handlePriceChange = (field, value) => {
    const newPriceRange = {
      ...selectedPriceRange,
      [field]: Number(value),
    };

    if (newPriceRange.min <= newPriceRange.max) {
      setSelectedPriceRange(newPriceRange);
      fetchProductsByPrice(newPriceRange.min, newPriceRange.max);
    } else {
      console.error("O preço mínimo deve ser menor ou igual ao preço máximo.");
    }
  };

  const fetchProductsByPrice = async (minPrice, maxPrice) => {
    if (minPrice > maxPrice) {
      console.error("O preço mínimo não pode ser maior que o preço máximo.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/products/pr/byPrice/${minPrice}/${maxPrice}`
      );
      console.log("Resposta do servidor:", response);
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Atualiza o estado de produtos no componente pai
      } else {
        const errorData = await response.json();
        console.error("Erro do servidor:", errorData);
        setError(errorData.message || "Erro ao buscar produtos.");
        return;
      }
    } catch (error) {
      setError("Erro de conexão.");
    }
  };

  return (
    <div className="content-loja1">
      <div className="shop_filter_container">
        <div className="filter_container">
          <div className="filtros">
            <h3>Filtros</h3>

            <div onClick={() => handleFilterClick("estilo")}>
              <h4>Estilo</h4>
              {activeFilter === "estilo" && (
                <div
                  className="filter-options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3>Categorias</h3>
                  {categories.map((category) => (
                    <label key={category.category_id}>
                      <input
                        type="checkbox"
                        name="category"
                        value={category.category_id}
                        checked={selectedCategory === category.category_id}
                        onChange={() =>
                          handleCategorySelect(category.category_id)
                        }
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div onClick={() => handleFilterClick("cor")}>
              <h4>Cor</h4>
              {activeFilter === "cor" && (
                <div
                  className="filter-options"
                  onClick={(e) => e.stopPropagation()}
                >
                  {colors.map((colors) => (
                    <label key={colors.name}>
                      <input
                        type="checkbox"
                        value={colors.name}
                        checked={selectedColor === colors.color_id}
                        onChange={() => handleColorSelect(colors.color_id)}
                      />
                      {colors.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div onClick={() => handleFilterClick("tamanho")}>
              <h4>Tamanho</h4>
              {activeFilter === "tamanho" && (
                <div
                  className="filter-options"
                  ref={tamanhoRef}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <p onClick={() => setGender("masculino")}>Homem</p>
                    <p onClick={() => setGender("feminino")}>Mulher</p>
                  </div>
                  {gender && (
                    <div>
                      <h4>
                        Tamanhos{" "}
                        {gender === "masculino" ? "Masculino" : "Femininos"}
                      </h4>
                      <div className="size-options">
                        {gender === "masculino" && (
                          <>
                            <label>
                              <input
                                type="checkbox"
                                value="G"
                                onChange={(e) =>
                                  handleCheckboxChange(e, setSelectedSizes)
                                }
                              />
                              G
                            </label>
                          </>
                        )}
                        {gender === "feminino" && (
                          <>
                            <label>
                              <input
                                type="checkbox"
                                value="GG"
                                onChange={(e) =>
                                  handleCheckboxChange(e, setSelectedSizes)
                                }
                              />
                              GG
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div onClick={() => handleFilterClick("preco")}>
              <h4>Preço</h4>
              {activeFilter === "preco" && (
                <div
                  className="filter-options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="price-inputs">
                    <label>Preço Mínimo:</label>
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      step="100"
                      value={selectedPriceRange.min}
                      onChange={(e) => handlePriceChange("min", e.target.value)}
                    />
                    <label>Preço Máximo:</label>
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      step="100"
                      value={selectedPriceRange.max}
                      onChange={(e) => handlePriceChange("max", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="catalog-container1">
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              padding: "10px",
              width: "250px",
              borderRadius: "5px",
              backgroundColor: "white",
              border: "1px solid black",
              position: "absolute",
              right: "32%",
              borderColor: "gray",
            }}
          />

          <div className="sort-by">
            <p htmlFor="sort-select">Ordenar por:</p>
            <select
              id="sort-select"
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

          <header className="catalog-header"></header>
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
                    <samp>
                      {currency === "MZN"
                        ? `${product.price} MZN`
                        : `${convertPrice(
                            product.price,
                            currency
                          )} ${currency}`}
                    </samp>
                    {/**<select
                      value={currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                    >
                      <option value="MZN">MZN</option>
                      <option value="USD">USD</option>
                      <option value="ZAR">ZAR</option>
                    </select>*/}
                  </div>
                  <div className="catalog-button1">
                    <div className="colors">
                      {Array.isArray(product.colors) &&
                        product.colors.map((color, index) => (
                          <div
                            key={index}
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
                      <img src="shopping-cart-solid.svg" alt="" />
                    </button>
                    <button
                      className="btn_favorito"
                      onClick={() => {
                        console.log("Produto favorito clicado:", product);
                        toggleFavorite(product);
                      }}
                    >
                      {favorites.some(
                        (item) => item.product_id === product.product_id
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
