// src/screens/AdminProdutoDetalhe.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../assets/style/AdminGerirEstoqueProduto.css";

export default function AdminProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    fetchProduto();
  }, [id]);

  const fetchProduto = async () => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/products/Produto/buscar-nome/${id}`
      );
      if (!res.ok) throw new Error("Produto não encontrado");
      const data = await res.json();
      setProduto(data);
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      setProduto(null);
    } finally {
      setLoading(false);
    }
  };

  const atualizarTamanho = async (sizeId) => {
    const payload = updates[sizeId];
    if (!payload) return alert("Nenhuma alteração feita.");

    try {
      const response = await fetch(
        `http://localhost:3005/api/product-color-sizes/${sizeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar");
      alert("✅ Atualizado com sucesso");
      fetchProduto();
      setUpdates((prev) => ({ ...prev, [sizeId]: null }));
    } catch (err) {
      console.error(err);
      alert("❌ Erro ao atualizar");
    }
  };

  if (loading) return <div className="loading">Carregando detalhes do produto...</div>;
  if (!produto) return <div className="error">Produto não encontrado</div>;

  return (
    <div className="produto-detalhe-container">
      {/* HEADER PRODUTO */}
      <div className="produto-header">
        <h2>{produto.name}</h2>
        <div className="header-grid">
          <p><strong>Status:</strong> <span className={`status-badge ${produto.status}`}>{produto.status}</span></p>
          <p><strong>Categoria:</strong> {produto.category_name}</p>
          <p><strong>Gênero:</strong> {produto.gender_name}</p>
          <p><strong>Preço Base:</strong> MZN {produto.price}</p>
          <p className="full-width"><strong>Descrição:</strong> {produto.description}</p>
        </div>
      </div>

      {/* CORES */}
      {produto.colors && produto.colors.map((cor) => (
        <div key={cor.product_color_id} className="color-card">
          <div className="color-header">
            <div
              className="color-circle"
              style={{ backgroundColor: cor.hex_code }}
            />
            <h3>{cor.color_name}</h3>
          </div>

          {/* IMAGENS */}
          <div className="color-images">
            {cor.images && cor.images.length > 0 ? (
              cor.images.map((img, index) => (
                <img key={index} src={img} alt={`Produto ${cor.color_name}`} />
              ))
            ) : (
              <p className="no-images">Sem imagens</p>
            )}
          </div>

          {/* TAMANHOS */}
          {cor.sizes && cor.sizes.length > 0 ? (
            <div className="sizes-wrapper">
              <table className="sizes-table">
                <thead>
                  <tr>
                    <th>Tamanho</th>
                    <th>Tipo</th>
                    <th>SKU</th>
                    <th>Estoque</th>
                    <th>Custo</th>
                    <th>Preço Override</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {cor.sizes.map((size) => (
                    <tr key={size.product_color_size_id}>
                      <td>{size.size}</td>
                      <td>{size.size_type}</td>
                      <td>{size.sku || "-"}</td>
                      <td>
                        <div className="stock-control">
                          <span className="current-stock">{size.stock_quantity}</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="+"
                            value={updates[size.product_color_size_id]?.add_stock || ""}
                            onChange={(e) =>
                              setUpdates((prev) => ({
                                ...prev,
                                [size.product_color_size_id]: {
                                  ...prev[size.product_color_size_id],
                                  add_stock: parseInt(e.target.value) || 0,
                                },
                              }))
                            }
                          />
                        </div>
                      </td>
                      <td>MZN {size.cost_price}</td>
                      <td>
                        <input
                          type="number"
                          defaultValue={size.price_override || ""}
                          placeholder="Opcional"
                          onChange={(e) =>
                            setUpdates((prev) => ({
                              ...prev,
                              [size.product_color_size_id]: {
                                ...prev[size.product_color_size_id],
                                price_override: e.target.value === "" ? null : parseFloat(e.target.value),
                              },
                            }))
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn-update"
                          onClick={() => atualizarTamanho(size.product_color_size_id)}
                        >
                          Atualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-sizes">⚠️ Esta cor ainda não possui tamanhos.</p>
          )}
        </div>
      ))}
    </div>
  );
}