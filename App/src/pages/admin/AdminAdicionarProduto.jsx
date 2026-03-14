import React, { useState, useEffect } from 'react';
import '../../assets/style/AdminAdicionarProduto.css';

const AdminAdicionarProduto = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',                 // ✅ CORRETO
    category_id: '',
    category_name: '',
    gender_id: '',
    status: 'ativo',
  });

  const [novaCategoria, setNovaCategoria] = useState('');
  const [descricaoCategoria, setDescricaoCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);

  /* ===================== SUBMIT PRODUTO ===================== */
  const handleSubmit = async () => {
    console.log('📤 SUBMIT CLICKADO');
    console.log('📦 FORM STATE:', form);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),               // ✅ price
      category_id: Number(form.category_id),
      gender_id: Number(form.gender_id),
      status: form.status,
    };

    console.log('📨 PAYLOAD ENVIADO:', payload);
    console.log('🔍 TYPES:', {
      price: typeof payload.price,
      category_id: typeof payload.category_id,
      gender_id: typeof payload.gender_id,
    });

    try {
      const response = await fetch('http://localhost:3005/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('📥 RESPONSE STATUS:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ RESPONSE ERROR BODY:', errorText);
        throw new Error('Erro ao criar produto');
      }

      const data = await response.json();
      console.log('✅ RESPONSE DATA:', data);

      alert(`✅ Produto criado com sucesso! ID: ${data.product_id}`);

      setForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        category_name: '',
        gender_id: '',
        status: 'ativo',
      });
    } catch (error) {
      console.error('🔥 CATCH ERROR:', error);
      alert('❌ Erro ao criar produto');
    }
  };

  /* ===================== CATEGORIAS ===================== */
  useEffect(() => {
    const fetchCategorias = async () => {
      console.log('📡 Buscando categorias...');
      try {
        const res = await fetch('http://localhost:3005/api/categories');
        console.log('📥 STATUS CATEGORIAS:', res.status);

        const data = await res.json();
        console.log('📦 CATEGORIAS RECEBIDAS:', data);

        setCategorias(data);
      } catch (err) {
        console.error('❌ Erro ao buscar categorias:', err);
      }
    };
    fetchCategorias();
  }, []);

  const adicionarCategoria = async () => {
    console.log('➕ ADICIONAR CATEGORIA CLICKADO');
    console.log('📄 NOVA CATEGORIA:', {
      name: novaCategoria,
      description: descricaoCategoria,
    });

    const nome = novaCategoria.trim();
    const descricao = descricaoCategoria.trim();

    if (!nome) {
      alert('Digite o nome da categoria.');
      return;
    }

    const jaExiste = categorias.some(
      (cat) => cat.name.toLowerCase() === nome.toLowerCase()
    );
    console.log('🔎 Categoria já existe?', jaExiste);

    if (jaExiste) {
      alert('❌ Essa categoria já existe.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome,
          description: descricao,
        }),
      });

      console.log('📥 RESPONSE STATUS CATEGORIA:', response.status);

      if (!response.ok) throw new Error();

      const novaCategoriaCriada = await response.json();
      console.log('✅ CATEGORIA CRIADA:', novaCategoriaCriada);

      setCategorias((prev) => [...prev, novaCategoriaCriada]);
      setNovaCategoria('');
      setDescricaoCategoria('');
      alert('✅ Categoria adicionada com sucesso!');
    } catch (error) {
      console.error('🔥 ERRO AO ADICIONAR CATEGORIA:', error);
      alert('❌ Erro ao adicionar categoria.');
    }
  };

  /* ===================== RENDER ===================== */
  return (
    <div className="add-product-container">
      <div className="form-section">
        <h2>Informações do Produto</h2>

        <label>Produto</label>
        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <label>Categoria</label>
        <select
          value={form.category_id}
          onChange={(e) => {
            console.log('📂 CATEGORIA SELECIONADA:', e.target.value);
            const selected = categorias.find(
              (c) => c.category_id === Number(e.target.value)
            );
            console.log('📂 CATEGORIA OBJ:', selected);

            setForm({
              ...form,
              category_id: e.target.value,
              category_name: selected?.name || '',
            });
          }}
        >
          <option value="">Selecione</option>
          {categorias.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Categoria Selecionada</label>
        <input value={form.category_name} readOnly />

        <div className="categoria-inserir">
          <label>➕ Adicionar Nova Categoria</label>
          <div className="categoria-form">
            <input
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              placeholder="Category name"
            />
            <input
              value={descricaoCategoria}
              onChange={(e) =>
                setDescricaoCategoria(e.target.value)
              }
              placeholder="Description"
            />
            <button type="button" onClick={adicionarCategoria}>
              Adicionar
            </button>
          </div>
        </div>

        <label>Preço</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => {
            console.log('💰 PREÇO DIGITADO:', e.target.value);
            setForm({ ...form, price: e.target.value });
          }}
        />

        <label>Gênero</label>
        <select
          value={form.gender_id}
          onChange={(e) =>
            setForm({ ...form, gender_id: e.target.value })
          }
        >
          <option value="">Selecione</option>
          <option value="1">Masculino</option>
          <option value="2">Feminino</option>
          <option value="3">Unissex</option>
        </select>

        <label>Status</label>
        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>

        <label>Descrição</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button className="publish-btn" onClick={handleSubmit}>
          Cadastrar novo produto
        </button>
      </div>
    </div>
  );
};

export default AdminAdicionarProduto;
