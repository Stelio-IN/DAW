// src/screens/ProdutoPesquisa.tsx
import React, { useState } from "react";
import "../../assets/style/AdminGerirEstoqueProduto.css";

export default function ProdutoPesquisa() {
  const [nome, setNome] = useState("");
  const [produto, setProduto] = useState({
    colors: [],
  });
  const [estoquesAtualizados, setEstoquesAtualizados] = useState({});

  const buscarProduto = async () => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/products/Produto/buscar-nome?nome=${nome}`
      );
      const data = await res.json();

      // Certifica-se de que cada cor tenha product_color_id (mock caso contrário)
      const coresComId = (data.colors || []).map((cor, index) => ({
        ...cor,
        product_color_id: cor.product_color_id || index + 1,
      }));

      setProduto({ ...data, colors: coresComId });
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
    }
  };

  const atualizarEstoque = async (cor) => {
    const novoEstoque = estoquesAtualizados[cor.product_color_id];
    if (novoEstoque === undefined || novoEstoque === "") {
      return alert("Insira o novo valor antes de atualizar.");
    }

    try {
      const response = await fetch(
        `http://localhost:3005/api/product-colors/${cor.product_color_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stock_quantity: parseInt(novoEstoque),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao atualizar o estoque");
      }

      alert("✅ Estoque atualizado com sucesso!");

      // Atualiza visualmente a UI
      const coresAtualizadas = produto.colors.map((c) =>
        c.product_color_id === cor.product_color_id
          ? { ...c, stock_quantity: parseInt(novoEstoque) }
          : c
      );
      setProduto({ ...produto, colors: coresAtualizadas });

      // Limpa o valor do campo
      setEstoquesAtualizados((prev) => ({
        ...prev,
        [cor.product_color_id]: "",
      }));
    } catch (err) {
      console.error("Erro ao atualizar estoque:", err);
      alert("❌ Erro ao atualizar estoque!");
    }
  };

  return (
    <div className="produto-pesquisa-container">
      <h2>🔍 Pesquisar Produto</h2>
      <div className="search-section">
        <input
          type="text"
          placeholder="Digite o nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button onClick={buscarProduto}>Buscar</button>
      </div>

      {produto && produto.name && (
        <div className="produto-detalhes">
          <img src={produto.primary_image_url} alt={produto.name} />
          <div className="info">
            <h3>{produto.name}</h3>
            <p>
              <strong>Categoria:</strong> {produto.category_name}
            </p>
            <p>
              <strong>Preço:</strong> MZN {produto.price}
            </p>
            <p>
              <strong>Descrição:</strong> {produto.description}
            </p>

            <h4>Cores e Estoques:</h4>
            <table>
              <thead>
                <tr>
                  <th>Cor</th>
                  <th>Estoque Atual</th>
                  <th>Novo Estoque</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {produto.colors?.map((cor, i) => (
                  <tr key={i}>
                    <td>
                      <span
                        className="cor-box"
                        style={{ backgroundColor: cor.hex_code }}
                      />
                      {cor.name}
                    </td>
                    <td>{cor.stock_quantity}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={estoquesAtualizados[cor.product_color_id] || ""}
                        onChange={(e) =>
                          setEstoquesAtualizados((prev) => ({
                            ...prev,
                            [cor.product_color_id]: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>
                      <button onClick={() => atualizarEstoque(cor)}>
                        Atualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
