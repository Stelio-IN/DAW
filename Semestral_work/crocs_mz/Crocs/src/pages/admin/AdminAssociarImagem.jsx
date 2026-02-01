import React, { useEffect, useState } from 'react';
import '../../assets/style/AdminProductImages.css';

const API = 'http://localhost:3005/api';

const AdminProductImages = () => {
  const [data, setData] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [coresProduto, setCoresProduto] = useState([]);
  const [corSelecionada, setCorSelecionada] = useState(null);

  const [imageUrl, setImageUrl] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const [editImageId, setEditImageId] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState('');

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch(`${API}/product-colors/prod-info`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  /* ================= PRODUTO ================= */
  const handleProdutoClick = (produto) => {
    setProdutoSelecionado(produto);
    setCoresProduto(data.filter(p => p.product_id === produto.product_id));
    setCorSelecionada(null);
  };

  /* ================= COR ================= */
  const handleCorClick = (cor) => {
    setCorSelecionada(cor);
  };

  /* ================= ADD ================= */
  const handleSalvarImagem = async () => {
    if (!imageUrl) return alert('Informe a URL da imagem');

    const res = await fetch(`${API}/product-images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_color_id: corSelecionada.product_color_id,
        image_url: imageUrl,
        is_primary: isPrimary ? 1 : 0,
      }),
    });

    const novaImagem = await res.json();

    setCorSelecionada({
      ...corSelecionada,
      Images: [...corSelecionada.Images, novaImagem],
    });

    setImageUrl('');
    setIsPrimary(false);
  };

  /* ================= DELETE ================= */
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Eliminar esta imagem?')) return;

    await fetch(`${API}/product-images/${imageId}`, {
      method: 'DELETE',
    });

    setCorSelecionada({
      ...corSelecionada,
      Images: corSelecionada.Images.filter(i => i.image_id !== imageId),
    });
  };

  /* ================= SET PRIMARY ================= */
  const handleSetPrimary = async (imageId) => {
    await fetch(`${API}/product-images/set-primary/${imageId}`, {
      method: 'PUT',
    });

    setCorSelecionada({
      ...corSelecionada,
      Images: corSelecionada.Images.map(img => ({
        ...img,
        is_primary: img.image_id === imageId,
      })),
    });
  };

  /* ================= UPDATE ================= */
  const handleUpdateImage = async (imageId) => {
    const res = await fetch(`${API}/product-images/${imageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: editImageUrl }),
    });

    const updated = await res.json();

    setCorSelecionada({
      ...corSelecionada,
      Images: corSelecionada.Images.map(img =>
        img.image_id === imageId ? updated : img
      ),
    });

    setEditImageId(null);
    setEditImageUrl('');
  };

  /* ================= RENDER ================= */
  return (
    <div className="admin-images-container">
      <h2>Gestão de Imagens</h2>

      <div className="layout">
        {/* PRODUTOS */}
        <div className="card">
          <h3>Produtos</h3>
          <table>
            <tbody>
              {[...new Map(data.map(p => [p.product_id, p])).values()].map(p => (
                <tr
                  key={p.product_id}
                  onClick={() => handleProdutoClick(p)}
                  className={produtoSelecionado?.product_id === p.product_id ? 'selected' : ''}
                >
                  <td>{p.product_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CORES */}
        <div className="card">
          <h3>Cores</h3>
          {!produtoSelecionado ? (
            <p className="hint">Selecione um produto</p>
          ) : (
            <div className="cores-list">
              {coresProduto.map(c => (
                <div
                  key={c.product_color_id}
                  className={`cor-item ${corSelecionada?.product_color_id === c.product_color_id ? 'active' : ''}`}
                  onClick={() => handleCorClick(c)}
                >
                  <span className="color-box" style={{ background: c.Color.hex_code }} />
                  <strong>{c.Color.name}</strong><small>Stock: {c.stock_quantity_total}</small>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* IMAGENS */}
        <div className="card">
          <h3>Imagens</h3>

          {!corSelecionada ? (
            <p className="hint">Selecione uma cor</p>
          ) : (
            <>
              {/* ADD */}
              <div className="form">
                <input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="URL da imagem"
                />
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={e => setIsPrimary(e.target.checked)}
                  />
                  Primária
                </label>
                <button onClick={handleSalvarImagem}>Adicionar</button>
              </div>

              {/* GALERIA */}
              <div className="gallery">
                {corSelecionada.Images.map(img => (
                  <div key={img.image_id} className="img-card">
                    <img src={img.image_url} alt="" />

                    {img.is_primary && <span className="badge">Primária</span>}

                    <div className="img-actions">
                      <button onClick={() => handleSetPrimary(img.image_id)}>
                        ⭐
                      </button>

                      <button
                        onClick={() => {
                          setEditImageId(img.image_id);
                          setEditImageUrl(img.image_url);
                        }}
                      >
                        ✏️
                      </button>

                      <button onClick={() => handleDeleteImage(img.image_id)}>
                        🗑
                      </button>
                    </div>

                    {editImageId === img.image_id && (
                      <div className="edit-box">
                        <input
                          value={editImageUrl}
                          onChange={e => setEditImageUrl(e.target.value)}
                        />
                        <button onClick={() => handleUpdateImage(img.image_id)}>
                          Salvar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductImages;
