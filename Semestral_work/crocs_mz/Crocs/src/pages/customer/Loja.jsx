import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/style/loja.css";
import { FiFilter } from "react-icons/fi";
import { useFavorites } from "../../context/FavoritesContext";

function Loja() {
  const [openFilters, setOpenFilters] = useState([]); // Array para filtros abertos
  const [genders, setGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [sizesTypes, setSizesTypes] = useState([]);
  const [activeSizeType, setActiveSizeType] = useState(null);
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
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const tamanhoRef = useRef();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, sizeTypeRes, sizeRes, genderRes, colorRes] =
          await Promise.all([
            fetch("http://localhost:3005/api/categories"),
            fetch("http://localhost:3005/api/sizesType"),
            fetch("http://localhost:3005/api/sizes"),
            fetch("http://localhost:3005/api/gender"),
            fetch("http://localhost:3005/api/colors"),
          ]);
        setCategories(await catRes.json());
        setSizesTypes(await sizeTypeRes.json());
        setSizes(await sizeRes.json());
        setGenders(await genderRes.json());
        setColors(await colorRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

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

  const handleSizeTypeClick = (sizeTypeId) => {
    setActiveSizeType((prev) =>
      prev === sizeTypeId ? null : sizeTypeId
    );
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
        ? prev.filter((f) => f !== filter) // remove se já aberto
        : [...prev, filter] // adiciona se fechado
    );
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

            {/* Tamanho */}
            <div onClick={() => handleFilterClick("tamanho")}>
              <h4>Tamanho</h4>
              {openFilters.includes("tamanho") && (
                <div className="filter-options" ref={tamanhoRef}>
                  {sizesTypes.map((type) => (
                    <div key={type.size_type_id}>
                      <label onClick={() => handleSizeTypeClick(type.size_type_id)}>
                        {type.name}
                      </label>

                      {activeSizeType === type.size_type_id && (
                        <div className="nested-options">
                          {sizes
                            .filter((s) => s.size_type_id === type.size_type_id)
                            .map((s) => (
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
            <p style={{ textAlign: "center", marginTop: 20 }}>
              Nenhum produto será exibido nesta versão — apenas filtros disponíveis.
            </p>
          </section>
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Loja;
