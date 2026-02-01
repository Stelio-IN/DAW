import React, { useEffect, useState } from 'react';
import '../../assets/style/AdminPromotions.css';

const API = 'http://localhost:3005/api';

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [productPromotions, setProductPromotions] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProduct, setFilteredProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    discount_percentage: '',
    start_date: '',
    end_date: '',
    promo_stock_limit: '',
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [p1, p2, p3] = await Promise.all([
      fetch(`${API}/product-promotions`).then(r => r.json()),
      fetch(`${API}/product-product-promotions`).then(r => r.json()),
      fetch(`${API}/product-colors/prod-info`).then(r => r.json()),
    ]);

    setPromotions(p1);
    setProductPromotions(p2);
    setProducts(p3);
  };

  /* ================= HELPERS ================= */

  const getPromotionLevel = (a) => {
    if (a.product_color_size_id) return 'Tamanho';
    if (a.product_color_id) return 'Cor';
    return 'Produto';
  };

  const getProductName = (a) => {
    if (a.product_name) return a.product_name;

    const found = products.find(p =>
      p.product_colors?.some(pc =>
        pc.product_color_id === a.product_color_id ||
        pc.Sizes?.some(sz => sz.product_color_size_id === a.product_color_size_id)
      )
    );

    return found?.product_name || '—';
  };

  /* ================= CRUD ================= */

  const savePromotion = async () => {
    const method = selectedPromotion ? 'PUT' : 'POST';
    const url = selectedPromotion
      ? `${API}/product-promotions/${selectedPromotion.promotion_id}`
      : `${API}/product-promotions`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    resetForm();
    loadAll();
  };

  const deletePromotion = async (id) => {
    if (!window.confirm('Eliminar promoção?')) return;
    await fetch(`${API}/product-promotions/${id}`, { method: 'DELETE' });
    resetForm();
    loadAll();
  };

  const resetForm = () => {
    setSelectedPromotion(null);
    setForm({
      name: '',
      description: '',
      discount_percentage: '',
      start_date: '',
      end_date: '',
      promo_stock_limit: '',
    });
  };

  const associatePromotion = async (item, level) => {
    if (!selectedPromotion) return alert('Selecione uma promoção');

    await fetch(`${API}/product-product-promotions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promotion_id: selectedPromotion.promotion_id,
        product_id: item.product_id,
        product_color_id: level !== 'product' ? item.product_color_id : null,
        product_color_size_id: level === 'size' ? item.product_color_size_id : null,
      }),
    });

    loadAll();
  };

  const removeAssociation = async (id) => {
    await fetch(`${API}/product-product-promotions/${id}`, { method: 'DELETE' });
    loadAll();
  };

  /* ================= FILTERS ================= */

  const currentAssociations = productPromotions.filter(
    p => p.promotion_id === selectedPromotion?.promotion_id
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) return setFilteredProduct(null);

    const found = products.find(p =>
      p.product_name.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredProduct(found || null);
  };

  /* ================= UI ================= */

  return (
    <div className="admin-promotions-container">
      <h2>Gestão de Promoções</h2>

      <div className="layout">

        {/* PROMOÇÕES */}
        <div className="card table-card">
          <h3>Promoções</h3>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>%</th>
                <th>Início</th>
                <th>Fim</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {promotions.map(p => (
                <tr
                  key={p.promotion_id}
                  className={selectedPromotion?.promotion_id === p.promotion_id ? 'active-row' : ''}
                  onClick={() => { setSelectedPromotion(p); setForm(p); }}
                >
                  <td>{p.name}</td>
                  <td>{p.discount_percentage}%</td>
                  <td>{new Date(p.start_date).toLocaleDateString()}</td>
                  <td>{new Date(p.end_date).toLocaleDateString()}</td>
                  <td>
                    <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deletePromotion(p.promotion_id); }}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FORM */}
        <div className="card form-card">
          <h3>{selectedPromotion ? 'Editar Promoção' : 'Nova Promoção'}</h3>
          <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <textarea placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input type="number" placeholder="% Desconto" value={form.discount_percentage} onChange={e => setForm({ ...form, discount_percentage: e.target.value })} />
          <input type="datetime-local" value={form.start_date || ''} onChange={e => setForm({ ...form, start_date: e.target.value })} />
          <input type="datetime-local" value={form.end_date || ''} onChange={e => setForm({ ...form, end_date: e.target.value })} />
          <input type="number" placeholder="Limite de stock" value={form.promo_stock_limit || ''} onChange={e => setForm({ ...form, promo_stock_limit: e.target.value })} />
          <button onClick={savePromotion}>Salvar</button>
        </div>

        {/* ASSOCIADOS */}
        <div className="card table-card">
          <h3>Produtos Associados</h3>

          {!selectedPromotion ? (
            <p className="hint">Selecione uma promoção</p>
          ) : currentAssociations.length === 0 ? (
            <p className="hint">Nenhum produto associado</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Cor</th>
                  <th>Tamanho</th>
                  <th>Nível</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentAssociations.map(a => (
                  <tr key={a.id}>
                    <td className="product-name">{getProductName(a)}</td>
                    <td>{a.color_name || '—'}</td>
                    <td>{a.size || '—'}</td>
                    <td>
                      <span className={`level-badge level-${getPromotionLevel(a).toLowerCase()}`}>
                        {getPromotionLevel(a)}
                      </span>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => removeAssociation(a.id)}>🗑</button>
                    </td>
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

export default AdminPromotions;
