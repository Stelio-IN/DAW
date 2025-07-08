import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import "../assets/style/loja.css";
import { FiFilter, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useFavorites } from "../../context/FavoritesContext";
function Loja() {
  const [activeFilter, setActiveFilter] = useState(null);

  const [gender, setGender] = useState(null);
  const [genders, setGendere] = useState([]);

  const [selectedGender, setSelectedGender] = useState([]);

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [selectedPriceRange, setSelectedPriceRange] = React.useState({
    min: 0,
    max: 5000,
  });
  const [sortOption, setSortOption] = useState("a-z");
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa

  const [colors, setColors] = useState([]);

  const [selectedColor, setSelectedColor] = useState([]);
  const [error, setError] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();

  const [sizesTypes, setSizesTypes] = useState([]);
  const [activeSizeType, setActiveSizeType] = useState(null); // Tipo de tamanho ativo

  const [categories, setCategories] = useState([]);

  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const [filtroOpen, setFiltroOpen] = useState(false);

  const toggleFiltro = () => setFiltroOpen(!filtroOpen);
  const [selectedCategories, setSelectedCategories] = useState([]); // Inicializando como um array vazio

  const [appliedFilters, setAppliedFilters] = useState([]);


  

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
    const storedGender = JSON.parse(
      localStorage.getItem("selectedGender") || "[]"
    );
    const storedSelectedSizes = JSON.parse(
      localStorage.getItem("selectedSizes") || "[]"
    );
    const storedSelectedPriceRange = JSON.parse(
      localStorage.getItem("selectedPriceRange") || '{"min":0,"max":10000}'
    );

    if (storedActiveFilter) setActiveFilter(storedActiveFilter);
    if (storedGender.length > 0) setSelectedGender(storedGender); // Certifique-se de tratar como array
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


  const updateAppliedFilters = (filterType, filterLabel) => {
    let updatedFilters = [...appliedFilters];
    const filterIndex = updatedFilters.findIndex((filter) => filter.label === filterLabel);
  
    if (filterIndex === -1) {
      // Se o filtro ainda não está na lista, adicione-o
      updatedFilters.push({ type: filterType, label: filterLabel });
    } else {
      // Se o filtro já está na lista, remova-o
      updatedFilters = updatedFilters.filter((filter) => filter.label !== filterLabel);
    }
  
    setAppliedFilters(updatedFilters);
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
  const fetchProductsByCategories = async (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) {
      setError("Selecione pelo menos uma categoria.");
      return;
    }
    console.log("Sending categoryIds to API:", categoryIds);
    try {
      const response = await fetch(
        `http://localhost:3005/api/products/pr/byCategories/${categoryIds.join(
          ","
        )}`
      );
      console.log("API response:", response);
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

  //Função para buscar produtos por tamanhos e Gênero
  // Função para buscar produtos por gênero
  const fetchProductsByGender = async (genderId) => {
    if (!genderId || genderId.length === 0) {
      setError("Selecione pelo menos um gênero.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3005/api/products/pr/byGender/${genderId.join(",")}`
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

  // Função para obter o parâmetro de gênero da URL

  const location = useLocation();
  
 // Mapeamento entre ids e nomes de gênero
 const genderMap = {
  2: "Homem",
  3: "Mulher",
  4: "Unissex",
};

  
  



  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Aqui pegamos diretamente da URL
    const genderFromQuery = queryParams.get("gender");

    if (genderFromQuery) {
      setGender(genderMap[genderFromQuery]); // Define o nome do gênero baseado no id
      setSelectedGender([genderFromQuery]);
      fetchProductsByGender([genderFromQuery]);
    } else {
      setGender(null); // Caso não haja gênero, exibe o padrão
      fetchProducts(); // Busca todos os produtos sem filtro
    }
  }, [location.search]); // Recarrega quando a URL mudar // Recarrega quando a URL mudar





  const handleGenderSelect = (genderId) => {
    let updatedGender = [...selectedGender];
  
    if (updatedGender.includes(genderId)) {
      updatedGender = updatedGender.filter((id) => id !== genderId);
    } else {
      updatedGender.push(genderId);
    }
  
    console.log("Updated gender:", updatedGender);
    setSelectedGender(updatedGender);
  
    const genderLabel = genders.find((gender) => gender.gender_id === genderId)?.name;
    updateAppliedFilters("Gender", genderLabel);
  
    if (updatedGender.length > 0) {
      fetchProductsByGender(updatedGender);
    } else {
      fetchProducts(); // Busca todos os produtos sem filtro
    }
  };
  

  // Função para buscar produtos por tamanhos
  const fetchProductsBySizes = async (sizeIds) => {
    if (!sizeIds || sizeIds.length === 0) {
      setError("Selecione pelo menos um tamanho.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/products/pr/bySizes/${sizeIds.join(",")}`
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Atualiza o estado de produtos no componente pai
        setError(null); // Limpa o erro caso a busca seja bem-sucedida
      } else {
        setError("Erro ao buscar produtos.");
      }
    } catch (error) {
      setError("Erro de conexão ao buscar produtos.");
      console.error(error);
    }
  };

  // Lógica para selecionar ou desmarcar tamanhos
  const handleSizeSelect = (sizeId) => {
    const updatedSizes = selectedSizes.includes(sizeId)
      ? selectedSizes.filter((id) => id !== sizeId) // Remove o tamanho
      : [...selectedSizes, sizeId]; // Adiciona o tamanho
  
    console.log("Updated sizes:", updatedSizes);
    setSelectedSizes(updatedSizes);
  
    // Atualize os filtros aplicados
    const sizeLabel = sizes.find((size) => size.size_id === sizeId)?.size;
    updateAppliedFilters("Size", sizeLabel);
  
    if (updatedSizes.length > 0) {
      fetchProductsBySizes(updatedSizes); // Busca produtos com os tamanhos selecionados
    } else {
      fetchProducts(); // Busca todos os produtos sem filtros
    }
  };
  

  // Função para buscar produtos por cor
  const handleColorSelect = (colorId) => {
    let updatedColors = [...selectedColor];
  
    if (updatedColors.includes(colorId)) {
      updatedColors = updatedColors.filter((id) => id !== colorId);
    } else {
      updatedColors.push(colorId);
    }
  
    console.log("Updated colors:", updatedColors);
    setSelectedColor(updatedColors);
  
    const colorLabel = colors.find((color) => color.color_id === colorId)?.name;
    updateAppliedFilters("Color", colorLabel);
  
    if (updatedColors.length > 0) {
      fetchProductsByColor(updatedColors);
    } else {
      fetchProducts(); // Busca todos os produtos sem filtro
    }
  };
  

  const fetchProductsByColor = async (colorId) => {
    if (!colorId || colorId.length === 0) {
      setError("Selecione pelo menos uma cor.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3005/api/products/pr/byColor/${colorId.join(",")}`
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

  // Buscar Tipos de tamanhos ao carregar o componente
  useEffect(() => {
    const fetchSizeTypes = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/sizesType");
        if (response.ok) {
          const data = await response.json();
          setSizesTypes(data);
        } else {
          console.error("Erro ao buscar tipos tamanhos");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchSizeTypes();
  }, []);

  // Buscar Tipos ao carregar o componente
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/sizes");
        if (response.ok) {
          const data = await response.json();
          setSizes(data);
        } else {
          console.error("Erro ao buscar tamanhos");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchSizes();
  }, []);

  // Buscar Generos ao carregar o componentecd backendsemestral

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/gender");
        if (response.ok) {
          const data = await response.json();
          setGendere(data);
        } else {
          console.error("Erro ao buscar generos");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    };

    fetchGenders();
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
  // Função para selecionar uma categoria
  const handleCategorySelect = (categoryId) => {
    let updatedCategories = [...selectedCategories];
  
    if (updatedCategories.includes(categoryId)) {
      updatedCategories = updatedCategories.filter((id) => id !== categoryId);
    } else {
      updatedCategories.push(categoryId);
    }
  
    console.log("Updated categories:", updatedCategories);
    setSelectedCategories(updatedCategories);
  
    const categoryLabel = categories.find((category) => category.category_id === categoryId)?.name;
    updateAppliedFilters("Category", categoryLabel);
  
    if (updatedCategories.length > 0) {
      fetchProductsByCategories(updatedCategories);
    } else {
      fetchProducts(); // Busca todos os produtos sem filtro
    }
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

  // Função para buscar tamanhos associados a um tipo
  const handleSizeTypeClick = async (sizeTypeId) => {
    setActiveSizeType(sizeTypeId); // Define o tipo de tamanho ativo

    try {
      const response = await fetch(
        `http://localhost:3005/api/sizes/type/${sizeTypeId}`
      );

      if (response.ok) {
        const data = await response.json();
        setSizes(data); // Atualiza os tamanhos associados ao tipo
      } else {
        console.error("Erro ao buscar tamanhos associados ao tipo.");
      }
    } catch (error) {
      console.error("Erro de conexão ao buscar tamanhos:", error);
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
            <i className="bx bx-x"></i>
            &times;
          </label>

          <div className="filtros">
            <h3>Filtros</h3>

            <div className="applied-filters">
  {appliedFilters.map((filter, index) => (
    <div key={index} className="filter-tag">
      <span>{filter.label}</span>
    </div>
  ))}
</div>


            <div onClick={() => handleFilterClick("estilo")}>
              <h4>Estilo</h4>
              {activeFilter === "estilo" && (
                <div
                  className="filter-options"
                  onClick={(e) => e.stopPropagation()}
                >
                  {categories.map((category) => (
                    <label key={category.category_id}>
                      <input
                        type="checkbox"
                        name="category"
                        value={category.category_id}
                        checked={selectedCategories.includes(
                          category.category_id
                        )}
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
                  {colors.map((color) => (
                    <label key={color.name}>
                      <input
                        type="checkbox"
                        value={color.name}
                        checked={selectedColor.includes(color.color_id)}
                        onChange={() => handleColorSelect(color.color_id)}
                      />
                      {color.name}
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
                  onClick={(e) => e.stopPropagation()}
                >
                  {sizesTypes.map((sizeType) => (
                    <div key={sizeType.size_type_id}>
                      <label
                        onClick={() =>
                          handleSizeTypeClick(sizeType.size_type_id)
                        }
                      >
                        {sizeType.name}
                      </label>

                      {activeSizeType === sizeType.size_type_id && (
                        <div className="nested-options">
                          {sizes
                            .filter(
                              (size) =>
                                size.size_type_id === sizeType.size_type_id
                            )
                            .map((size) => (
                              <label key={size.size_id}>
                                <input
                                  type="checkbox"
                                  value={size.size_id}
                                  checked={selectedSizes.includes(size.size_id)}
                                  onChange={() =>
                                    handleSizeSelect(size.size_id)
                                  }
                                />
                                {size.size}
                              </label>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {error && <p className="error-message">{error}</p>}{" "}
              {/* Exibe erros */}
            </div>

            <div onClick={() => handleFilterClick("genero")}>
              <h4>Gênero</h4>
              {activeFilter === "genero" && (
                <div
                  className="filter-options"
                  onClick={(e) => e.stopPropagation()}
                >
                  {genders.map((gender) => (
                    <label key={gender.name}>
                      <input
                        type="checkbox"
                        value={gender.name}
                        checked={selectedGender.includes(gender.gender_id)}
                        onChange={() => handleGenderSelect(gender.gender_id)}
                      />
                      {gender.name}
                    </label>
                  ))}
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
            className="inputpesquisa"
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={handleSearch}
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

          <header className="catalog-header">
          <h3>{gender || "Todos os Produtos"}</h3>
          </header>
          <label
            htmlFor="filtragem"
            className="filtragem"
            onClick={toggleFiltro}
          >
            <i className="bx bx-x"> Filtros </i>

            <p>
              <FiFilter />
            </p>
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
