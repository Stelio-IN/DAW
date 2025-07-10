import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiFilter } from 'react-icons/fi';
import '../../assets/style/AdminProduto.css';

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [filtro, setFiltro] = useState('All');
const navigate = useNavigate();
  const categorias = ['All', 'Most purchased', 'Basketball', 'Running', 'Skateboard', 'Football'];

  useEffect(() => {
    fetch("http://localhost:3005/api/products/pr")
      .then((response) => response.json())
      .then((data) => {
        setProdutos(data);
        if (data.length > 0) setProdutoSelecionado(data[0]);
      })
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  const produtosFiltrados = filtro === 'All'
    ? produtos
    : produtos.filter((p) => p.category_name === filtro); // ajuste conforme a chave real da categoria

    //Funcao para ir para detalhes do produto
  const goToDetails = (IdProduct) => {
    navigate(`/admin/produto/detalhe/${IdProduct}`);
  }
  return (
    <div className="admin-produtos-container">
      {/* Lado esquerdo: lista de produtos */}
      <div className="product-list-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <input type="text" placeholder="Search product..." className="input-busca" />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-preto"><FiPlus /> Add New Product</button>
            <button className="btn-cinza"><FiFilter /></button>
          </div>
        </div>

        <div className="product-filters">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={`filter-button ${filtro === cat ? 'ativo' : ''}`}
              onClick={() => setFiltro(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="product-list">
          {produtosFiltrados.map((prod) => (
            <div
              key={prod.product_id}
              className="product-card"
              onClick={() => setProdutoSelecionado(prod)}
            >
              <img src={prod.primary_image_url || 'https://via.placeholder.com/150'} alt={prod.product_name} />
              <div className="product-title">{prod.product_name}</div>
              <div className="product-price">{prod.price} MZN</div>
              <div className="product-price">Stock: {prod.stock_quantity ?? 0}</div>

              <div className="colors">
                {Array.isArray(prod.colors) &&
                  prod.colors
                    .filter((color) => color.hex_code)
                    .map((color, index) => (
                      <div
                        key={index}
                        className="color-box"
                        style={{ backgroundColor: color.hex_code }}
                        title={color.name}
                      />
                    ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lado direito: detalhes do produto */}
      <div className="product-details-section">
        <h3>Edit Products</h3>
        {produtoSelecionado && (
          <>
            <img
              src={produtoSelecionado.primary_image_url || 'https://via.placeholder.com/150'}
              alt="Produto"
            />

            <div>
              <label>Product Name</label>
              <input type="text" value={produtoSelecionado.product_name} readOnly />
            </div>

            <div>
              <label>Description</label>
              <textarea value={produtoSelecionado.description || ''} rows={4} readOnly />
            </div>

            <div>
              <label>Category</label>
              <textarea value={produtoSelecionado.name || ''} readOnly />
            </div>
<div>
  <button onClick={() => goToDetails(produtoSelecionado.product_id)}>
          Ver Detalhes do Produto
  </button>
</div>
            <div>
              <label>Colors</label>
              <div className="colors">
                {Array.isArray(produtoSelecionado.colors) &&
                  produtoSelecionado.colors
                    .filter((color) => color.hex_code)
                    .map((color, index) => (
                      <div
                        key={index}
                        className="color-box"
                        style={{ backgroundColor: color.hex_code }}
                        title={color.name}
                      />
                    ))}
              </div>
            </div>

            <div className="details-buttons">
              <button className="discard-btn">Discard</button>
              <button className="update-btn">Update Product</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
