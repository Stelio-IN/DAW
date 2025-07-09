import React, { useState } from 'react';
import { FiSearch, FiPlus, FiFilter } from 'react-icons/fi';
import '../../assets/style/AdminProduto.css';

const produtosFake = [
  {
    id: 1,
    nome: 'Nike Downshifter 12',
    preco: 'Rp 819,000',
    estoque: 975,
    vendidos: 768,
    categoria: 'Running',
    imagem: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/0f2f5218-2744-4079-bc97-fef5a9a187e4/downshifter-12-road-running-shoes-8tvlhd.png',
    descricao: 'Here’s to new beginnings between you and the pavement. Cushioned and flexible.'
  },
  {
    id: 2,
    nome: 'Vans Old Skool Shoe',
    preco: 'Rp 1,100,000',
    estoque: 488,
    vendidos: 217,
    categoria: 'Skateboard',
    imagem: 'https://images.vans.com/is/image/VansEU/VN000D3HY28-HERO?wid=800&hei=800&fmt=jpeg&qlt=85&resMode=sharp2&op_usm=1.75,0.3,2,0'
  }
];

export default function AdminProdutos() {
  const [produtoSelecionado, setProdutoSelecionado] = useState(produtosFake[0]);
  const [filtro, setFiltro] = useState('All');

  const categorias = ['All', 'Most purchased', 'Basketball', 'Running', 'Skateboard', 'Football'];

  const produtosFiltrados = filtro === 'All' ? produtosFake : produtosFake.filter(p => p.categoria === filtro);

  return (
    <div className="admin-produtos-container">
      <div className="produtos-lista">
        <div className="produtos-header">
          <input
            type="text"
            placeholder="Search product..."
            className="input-busca"
          />
          <div className="botoes-acoes">
            <button className="btn-preto">
              <FiPlus /> Add New Product
            </button>
            <button className="btn-cinza">
              <FiFilter />
            </button>
          </div>
        </div>

        <div className="filtros-categorias">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`filtro-btn ${filtro === cat ? 'ativo' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="produtos-grid">
          {produtosFiltrados.map(prod => (
            <div
              key={prod.id}
              className="produto-card"
              onClick={() => setProdutoSelecionado(prod)}
            >
              <img src={prod.imagem} alt={prod.nome} className="produto-imagem" />
              <h4 className="produto-nome">{prod.nome}</h4>
              <p className="produto-preco">{prod.preco}</p>
              <p className="produto-info">Stock: {prod.estoque} | Sold: {prod.vendidos}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="produto-detalhes">
        <h3>Edit Products</h3>
        {produtoSelecionado && (
          <>
            <img src={produtoSelecionado.imagem} alt="Produto" className="detalhes-imagem" />
            <div className="campo-form">
              <label>Product Name</label>
              <input type="text" value={produtoSelecionado.nome} className="input-form" />
            </div>
            <div className="campo-form">
              <label>Description</label>
              <textarea value={produtoSelecionado.descricao || ''} rows={4} className="input-form"></textarea>
            </div>
            <div className="campo-form">
              <label>Product Category</label>
              <input type="text" value={produtoSelecionado.categoria} className="input-form" />
            </div>
            <div className="botoes-detalhes">
              <button className="btn-cinza">Discard</button>
              <button className="btn-preto">Update Product</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
