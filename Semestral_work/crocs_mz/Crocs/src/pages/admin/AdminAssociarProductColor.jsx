import React, { useEffect, useState } from 'react';
import '../../assets/style/AdminCoresProduto.css';

const AdminCoresProduto = () => {
  const [produtos, setProdutos] = useState([]);
  const [cores, setCores] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('');
  const [stock, setStock] = useState('');
  const [coresProduto, setCoresProduto] = useState([]);

  /* ================= FETCH INICIAL ================= */
  useEffect(() => {
    fetchProdutos();
    fetchCores();
  }, []);

  const fetchProdutos = async () => {
    try {
      console.log('[LOG] Buscando produtos...');
      const res = await fetch('http://localhost:3005/api/products');
      const data = await res.json();
      console.log('[LOG] Produtos recebidos:', data);
      setProdutos(data);
    } catch (err) {
      console.error('[ERROR] Erro ao buscar produtos:', err);
    }
  };

  const fetchCores = async () => {
    try {
      console.log('[LOG] Buscando cores...');
      const res = await fetch('http://localhost:3005/api/colors');
      const data = await res.json();
      console.log('[LOG] Cores recebidas:', data);
      setCores(data);
    } catch (err) {
      console.error('[ERROR] Erro ao buscar cores:', err);
    }
  };

  /* ================= FETCH CORES DO PRODUTO ================= */
  const fetchCoresProduto = async (product_id) => {
    if (!product_id) return;
    try {
      console.log(`[LOG] Buscando cores do produto ${product_id}...`);
      const res = await fetch(
        `http://localhost:3005/api/product-colors/prod/${product_id}`
      );
      const data = await res.json();
      console.log('[LOG] Dados recebidos do produto:', data);

      const arrayData = Array.isArray(data) ? data : [data];

      if (arrayData.length === 0) {
        alert('Este produto ainda não possui cores associadas!');
      }

      console.log('[LOG] coresProduto setadas:', arrayData);
      setCoresProduto(arrayData);
    } catch (err) {
      console.error('[ERROR] Erro ao buscar cores do produto:', err);
      setCoresProduto([]);
    }
  };

  /* ================= ASSOCIAR COR AO PRODUTO ================= */
  const associarCor = async () => {
    if (!produtoSelecionado || !corSelecionada) {
      alert('Selecione produto e cor');
      return;
    }

    try {
      console.log('[LOG] Associando cor...');
      console.log('Produto selecionado:', produtoSelecionado);
      console.log('Cor selecionada:', corSelecionada);
      console.log('Stock:', stock);

      const res = await fetch('http://localhost:3005/api/product-colors/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: produtoSelecionado,
          color_id: corSelecionada,
         
        }),
      });

      const data = await res.json();
      console.log('[LOG] Resposta do POST:', data);

      if (!res.ok) throw new Error(data.error || 'Erro ao associar cor');

      setCorSelecionada('');
      setStock('');
      fetchCoresProduto(produtoSelecionado);
      alert('Cor associada com sucesso!');
    } catch (err) {
      console.error('[ERROR] Erro ao associar cor:', err);
      alert('Erro ao associar cor: ' + err.message);
    }
  };

  /* ================= HANDLE CLIQUE NA TABELA ================= */
  const handleProdutoClick = (produto) => {
    console.log('[LOG] Produto clicado:', produto);
    setProdutoSelecionado(produto.product_id);
    fetchCoresProduto(produto.product_id);
  };

  /* ================= RENDER ================= */
  return (
  <div className="cores-produto-container">
    <h2>Cores do Produto</h2>

    <div className="cores-produto-grid">
      {/* Coluna esquerda - Produtos */}
      <div className="produtos-col">
        <h3>Produtos</h3>
        <div className="produtos-table">
         <table>
  <thead>
    <tr>
      <th>Imagem</th>
      <th>Produto</th>
      <th>Status</th>
    </tr>
  </thead>

  <tbody>
    {produtos.map((p) => (
      <tr
        key={p.product_id}
        className={produtoSelecionado === p.product_id ? 'selected' : ''}
        onClick={() => handleProdutoClick(p)}
      >

        {/* IMAGEM */}
        <td>
          {p.primary_image_url ? (
            <img
              src={p.primary_image_url}
              alt={p.name}
              style={{
                width: "45px",
                height: "45px",
                objectFit: "cover",
                borderRadius: "6px"
              }}
            />
          ) : (
            "Sem imagem"
          )}
        </td>

        {/* NOME */}
        <td>{p.name}</td>

        {/* STATUS */}
        <td>{p.status}</td>

      </tr>
    ))}
  </tbody>
</table>
        </div>
      </div>

      {/* Coluna direita - Detalhes e ações */}
      <div className="detalhes-col">
        <h3>Produto Selecionado</h3>
        <div className="produto-selecionado">
          <span>
            {produtos.find((p) => p.product_id === produtoSelecionado)?.name || 'Nenhum produto selecionado'}
          </span>
        </div>

        <h3>Associar Nova Cor</h3>
        <div className="form-associar">
          <div>
            <label>Cor</label>
            <select
              value={corSelecionada}
              onChange={(e) => setCorSelecionada(e.target.value)}
            >
              <option value="">Selecione</option>
              {cores.map((c) => (
                <option key={c.color_id} value={c.color_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Stock (opcional)</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Quantidade em stock"
            />
          </div>

          <button onClick={associarCor}>Associar Cor</button>
        </div>

        <h3>Cores Associadas</h3>
        {coresProduto.length === 0 ? (
          <div className="empty-message">
            Este produto ainda não possui cores associadas.
          </div>
        ) : (
          <table className="cores-produto-table">
            <thead>
              <tr>
                <th>Cor</th>
                <th>Hex</th>
              </tr>
            </thead>
            <tbody>
              {coresProduto.map((cp) => (
                <tr key={cp.product_color_id}>
                  <td>
                    <div className="color-badge">
                      <div
                        className="color-dot"
                        style={{ backgroundColor: cp.Color?.hex_code || '#ccc' }}
                      />
                      {cp.Color?.name || 'Não definido'}
                    </div>
                  </td>
                  <td>{cp.Color?.hex_code || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);
};

export default AdminCoresProduto;
