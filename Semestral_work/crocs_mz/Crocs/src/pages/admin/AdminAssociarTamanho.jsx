import React, { useEffect, useState } from 'react';
import '../../assets/style/AdminCoresTamanhos.css';

const AdminCoresTamanhos = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [coresProduto, setCoresProduto] = useState([]);
  const [coresSelecionada, setCorSelecionada] = useState('');
  const [sizes, setSizes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [formData, setFormData] = useState({
    size_id: '',
    gender_id: '',
    stock_quantity: '',
    sku: '',
    price_override: '',
    cost_price: '',
  });

  /* ================== FETCH INICIAL ================== */
  useEffect(() => {
    fetchProdutos();
    fetchSizes();
    fetchGenders();
  }, []);

  const fetchProdutos = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/product-colors/prod/');
      const data = await res.json();
      setProdutos(data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  const fetchSizes = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/sizes');
      const data = await res.json();
      setSizes(data);
    } catch (err) {
      console.error('Erro ao buscar tamanhos:', err);
    }
  };

  const fetchGenders = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/gender');
      const data = await res.json();
      setGenders(data);
    } catch (err) {
      console.error('Erro ao buscar gêneros:', err);
    }
  };

  /* ================== SELECIONAR PRODUTO ================== */
  const handleProdutoClick = (produto) => {
    setProdutoSelecionado(produto);

    // Filtra todas as cores desse produto
    const coresDoProduto = produtos.filter((p) => p.product_id === produto.product_id);
    setCoresProduto(coresDoProduto);

    setCorSelecionada('');
  };

  /* ================== HANDLE INPUT ================== */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================== ENVIAR DADOS ================== */
  const handleSubmit = async () => {
    if (!produtoSelecionado || !coresSelecionada) {
      alert('Selecione um produto e uma cor.');
      return;
    }

    const payload = {
      product_color_id: coresSelecionada,
      size_id: formData.size_id,
      gender_id: formData.gender_id,
      stock_quantity: Number(formData.stock_quantity),
      sku: formData.sku,
      price_override: Number(formData.price_override),
      cost_price: Number(formData.cost_price),
    };

    try {
      const res = await fetch('http://localhost:3005/api/product-color-size', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar SKU');

      alert('SKU criado com sucesso!');
      setFormData({
        size_id: '',
        gender_id: '',
        stock_quantity: '',
        sku: '',
        price_override: '',
        cost_price: '',
      });

      fetchProdutos(); // atualizar lista de produtos
    } catch (err) {
      console.error('Erro ao criar SKU:', err);
      alert('Erro: ' + err.message);
    }
  };

  /* ================== RENDER ================== */
  return (
    <div className="cores-tamanhos-container">
      <h2>Gestão de Variações de Produto</h2>

      <div className="main-section">
        {/* ================== PRODUTOS ================== */}
        <div className="produtos-table-wrapper">
          <h3>Produtos com Cores</h3>
          <table className="produtos-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Stock Total</th>
              </tr>
            </thead>
            <tbody>
              {produtos
                .filter((p, index, self) => self.findIndex((i) => i.product_id === p.product_id) === index)
                .map((p) => {
                  const stockTotal = produtos
                    .filter((c) => c.product_id === p.product_id)
                    .reduce((sum, c) => sum + (c.stock_quantity_total ?? 0), 0);

                  return (
                    <tr
                      key={p.product_id}
                      onClick={() => handleProdutoClick(p)}
                      className={produtoSelecionado?.product_id === p.product_id ? 'selected' : ''}
                    >
                      <td>{p.product_name}</td>
                      <td>{p.description}</td>
                      <td>{p.price}</td>
                      <td>{p.status}</td>
                      <td>{stockTotal}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* ================== FORM + DIV CORES ================== */}
        <div className="form-div-section">
          <div className="form-wrapper">
            <h3>Adicionar Variação (SKU)</h3>

            <div className="form-row">
              <label>Cor:</label>
              <select value={coresSelecionada} onChange={(e) => setCorSelecionada(e.target.value)}>
                <option value="">Selecione</option>
                {coresProduto.map((c) => (
                  <option key={c.product_color_id} value={c.product_color_id}>
                    {c.Color?.name} ({c.stock_quantity_total ?? 0} em stock)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Tamanho:</label>
              <select name="size_id" value={formData.size_id} onChange={handleInputChange}>
                <option value="">Selecione</option>
                {sizes.map((s) => (
                  <option key={s.size_id} value={s.size_id}>
                    {s.size}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Gênero:</label>
              <select name="gender_id" value={formData.gender_id} onChange={handleInputChange}>
                <option value="">Selecione</option>
                {genders.map((g) => (
                  <option key={g.gender_id} value={g.gender_id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Stock:</label>
              <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} />
            </div>

            <div className="form-row">
              <label>SKU:</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} />
            </div>

            <div className="form-row">
              <label>Preço:</label>
              <input type="number" name="price_override" value={formData.price_override} onChange={handleInputChange} />
            </div>

            <div className="form-row">
              <label>Custo:</label>
              <input type="number" name="cost_price" value={formData.cost_price} onChange={handleInputChange} />
            </div>

            <button onClick={handleSubmit}>Salvar Variação</button>
          </div>

          {/* ================== DIV DE CORES ================== */}
          <div className="cores-stock-div">
            <h3>Cores do Produto e Stock</h3>
            {coresProduto.length === 0 ? (
              <p>Selecione um produto para ver as cores disponíveis.</p>
            ) : (
              <ul>
                {coresProduto.map((c) => (
                  <li key={c.product_color_id}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        backgroundColor: c.Color?.hex_code || '#fff',
                        border: '1px solid #000',
                        marginRight: '5px',
                      }}
                    ></span>
                    {c.Color?.name} — {c.stock_quantity_total ?? 0} em stock
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoresTamanhos;
