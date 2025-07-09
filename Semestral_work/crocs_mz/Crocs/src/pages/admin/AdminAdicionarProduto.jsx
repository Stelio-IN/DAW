import React, { useState, useEffect } from 'react';
import '../../assets/style/AdminAdicionarProduto.css';
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi';

const AdminAdicionarProduto = () => {
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    nome: '',
    categoria: '',
    categoriaNome: '',
    subcategoria: '',
    preco: '',
    descricao: '',
    tags: [],
  });

  const [novaCategoria, setNovaCategoria] = useState('');
  const [descricaoCategoria, setDescricaoCategoria] = useState('');
const [categorias, setCategorias] = useState([]);
  // Função atualizada para carregar e mostrar preview das imagens
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const newImagesPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            progress: 100,
            src: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagesPromises).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
    });
  };

  const handleRemoveImage = (name) => {
    setImages(images.filter((img) => img.name !== name));
  };

 

  // BACKEND
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.nome,
          description: form.descricao,
          price: parseFloat(form.preco),
          stock_quantity: 100, // ou outro valor padrão
          category_id: 1, // ajuste conforme sua lógica
          gender_id: 2, // ajuste conforme sua lógica
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }

      const data = await response.json();
      alert(`✅ Produto criado com sucesso! ID: ${data.product_id}`);
      setForm({
        nome: '',
        categoria: '',
        subcategoria: '',
        preco: '',
        descricao: '',
        tags: [],
      });
      setImages([]);
    } catch (error) {
      console.error(error);
      alert('❌ Erro ao criar produto');
    }
  };

  // Puxar categorias
    useEffect(() => {
      const fetchCategorias = async () => {
        try {
          const res = await fetch('http://localhost:3005/api/categories');
          const data = await res.json();
          setCategorias(data);
        } catch (err) {
          console.error('Erro ao buscar categorias:', err);
        }
      };
      fetchCategorias();
    }, []);

    // Criar nova categoria 
   const adicionarCategoria = async () => {
  const nome = novaCategoria.trim();
  const descricao = descricaoCategoria.trim();

  if (!nome) {
    alert('Digite o nome da categoria.');
    return;
  }

  // Verifica se já existe
  const jaExiste = categorias.some(
    (cat) => cat.name.toLowerCase() === nome.toLowerCase()
  );
  if (jaExiste) {
    alert('❌ Essa categoria já existe.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3005/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nome,
        description: descricao,
      }),
    });

    if (!response.ok) throw new Error('Erro ao criar nova categoria.');

    const novaCategoriaCriada = await response.json();

    setCategorias((prev) => [...prev, novaCategoriaCriada]);
    setNovaCategoria('');
    setDescricaoCategoria('');
    alert('✅ Categoria adicionada com sucesso!');
  } catch (error) {
    console.error(error);
    alert('❌ Erro ao adicionar categoria.');
  }
};




  return (
    <div className="add-product-container">
      {/* Lado esquerdo - Upload */}
      <div className="upload-section">
        <h2>Add Images</h2>
        <div className="dropzone">
          <FiUploadCloud size={48} className="upload-icon" />
          <p>
            Drop your files here. or <span>Browse</span>
          </p>
          <input type="file" multiple onChange={handleImageUpload} />
        </div>
        <div className="uploaded-list">
          {images.map((img, index) => (
            <div key={index} className="file-item">
              <div className="file-name">
                <img src={img.src || '/placeholder-shoe.png'} alt="preview" />
                <div>
                  <p>{img.name}</p>
                  <small>{img.size}</small>
                </div>
              </div>
              <div className="progress-bar">
                <div style={{ width: `${img.progress}%` }} />
              </div>
              <button onClick={() => handleRemoveImage(img.name)} className="delete-btn">
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

     <div className="form-section">
  <h2>Informações do Produto</h2>

  <label>Produto</label>
  <input
    type="text"
    value={form.nome}
    onChange={(e) => setForm({ ...form, nome: e.target.value })}
  />

  <label>Categoria</label>
  <select
    value={form.categoria}
    onChange={(e) => {
      const selectedId = e.target.value;
      const selected = categorias.find(cat => cat.category_id.toString() === selectedId);
      setForm({
        ...form,
        categoria: selectedId,
        categoriaNome: selected?.name || '',
      });
    }}
  >
   
    {categorias.map((cat) => (
      <option key={cat.category_id} value={cat.category_id}>
        {cat.name}
      </option>
    ))}
  </select>

  <label>Categoria Selecionada</label>
  <input type="text" value={form.categoriaNome} readOnly />

  {/* 🔽 NOVA DIV para inserir categorias */}
  <div className="categoria-inserir">
   <label>➕ Adicionar Nova Categoria</label>
<div className="categoria-form">
  <input
    type="text"
    value={novaCategoria}
    onChange={(e) => setNovaCategoria(e.target.value)}
    placeholder="Category Name (e.g. Sports, Classic...)"
  />
  <input
    type="text"
    value={descricaoCategoria}
    onChange={(e) => setDescricaoCategoria(e.target.value)}
    placeholder="Short description..."
  />
  <button onClick={adicionarCategoria}>Adicionar</button>
</div>

    {categorias.length > 0 && (
      <div className="categorias-lista">
        {categorias.map((cat) => (
          <span key={cat.category_id} className="categoria-tag">
            {cat.name}
          </span>
        ))}
      </div>
    )}
  </div>

  

  <label>Preço</label>
  <input
    type="text"
    value={form.preco}
    onChange={(e) => setForm({ ...form, preco: e.target.value })}
  />

  <label>Descrição</label>
  <textarea
    rows={4}
    value={form.descricao}
    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
  />


  <button className="publish-btn" onClick={handleSubmit}>
    Cadastrar novo produto
  </button>
</div>
    </div>
  );
};

export default AdminAdicionarProduto;
