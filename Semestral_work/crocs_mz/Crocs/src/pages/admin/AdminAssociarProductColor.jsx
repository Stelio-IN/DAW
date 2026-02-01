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

      <div className="produtos-table">
        <h3>Produtos</h3>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
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
                <td>{p.name}</td>
                <td>{p.category_name || '-'}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />

      <label>Produto Selecionado</label>
      <input
        value={
          produtos.find((p) => p.product_id === produtoSelecionado)?.name || ''
        }
        readOnly
      />

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

      <label>Stock</label>
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <button onClick={associarCor}>Associar Cor</button>

      <h3>Cores associadas</h3>
      {coresProduto.length === 0 ? (
        <p>Este produto não possui cores associadas.</p>
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
                <td>{cp.Color?.name || 'Não definido'}</td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      backgroundColor: cp.Color?.hex_code || '#fff',
                      border: '1px solid #000',
                    }}
                  />
                  {cp.Color?.hex_code || '-'}
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCoresProduto;
