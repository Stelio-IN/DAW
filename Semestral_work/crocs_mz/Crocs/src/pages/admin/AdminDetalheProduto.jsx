import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
} from 'lucide-react';
import '../../assets/style/AdminDetalheProduto.css';

const ProductDetailPage = () => {
  const [availability, setAvailability] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('duplicate');
  const [produto, setProduto] = useState(null);
  const navigate = useNavigate();
  const { IdProduto } = useParams();
const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
      console.log("ID recebido via URL:", IdProduto)
    fetch(`http://localhost:3005/api/products/pr/${IdProduto}`)
      .then((res) => res.json())
      .then((data) => setProduto(data))
      .catch((err) => console.error("Erro ao carregar produto:", err));
  }, [IdProduto]);

  if (!produto) return <div className="loading">Carregando detalhes do produto...</div>;

 return (
  <div className="product-detail-container">
    {/* Breadcrumb e título */}
    <div className="breadcrumb">
      <span onClick={() => navigate('/admin/products')} className="breadcrumb-link">Produtos</span>
      <ChevronRight size={16} />
      <span className="breadcrumb-current">{produto.name}</span>
    </div>

    <h1 className="product-title">{produto.name}</h1>

    <div className="product-main-sections">
      {/* Seção 1: Informações principais */}
      <div className="product-info-section">
        <p><strong>Descrição:</strong> {produto.description || 'Sem descrição'}</p>
        <p><strong>Preço:</strong> {produto.price} MZN</p>
        <p><strong>Categoria:</strong> {produto.category_name || 'Não especificada'}</p>
        <p><strong>Stock Total: </strong> {produto.stock_quantity || 'Não especificada'}</p>

        <div className="product-colors">
          <strong>Cores disponíveis:</strong>
          <div className="colors">
            {Array.isArray(produto.colors) && produto.colors.length > 0 ? (
              produto.colors.map((color, index) => (
                <div key={index} className="color-item">
                  <div
                    className="color-box"
                    style={{ backgroundColor: color.hex_code }}
                    title={color.name}
                  />
                  <span className="color-label">{color.name} — Stock: {color.stock_quantity}</span>
                </div>
              ))
            ) : (
              <span>Nenhuma cor disponível</span>
            )}
          </div>
        </div>
      </div>

      {/* Seção 2: Galeria de imagens */}
     <div className="product-gallery-section">
  <h3>Imagem Principal do Produto</h3>

  {produto.primary_image_url ? (
    <div className="image-preview">
      <img src={produto.primary_image_url} alt="Imagem principal do produto" />
    </div>
  ) : (
    <p>Nenhuma imagem disponível</p>
  )}
</div>

    </div>
  </div>
);

};

export default ProductDetailPage;
