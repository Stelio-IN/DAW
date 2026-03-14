import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "../../assets/style/AdminDetalheProduto.css";

const ProductDetailPage = () => {
  const { IdProduto } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3005/api/products/pr/${IdProduto}`)
      .then((res) => res.json())
      .then((data) => {
        setProduto(data);

        if (data.primary_image_url) {
          setSelectedImage(data.primary_image_url);
        }
      })
      .catch((err) => console.error("Erro ao carregar produto:", err));
  }, [IdProduto]);

  if (!produto)
    return <div className="loading">Carregando detalhes do produto...</div>;

  /* ==========================
     CALCULAR STOCK TOTAL
  ========================== */

  const totalStock =
    produto.colors?.reduce((total, color) => {
      if (!color.sizes) return total;

      const colorStock = color.sizes.reduce(
        (sum, s) => sum + (s.stock_quantity || 0),
        0
      );

      return total + colorStock;
    }, 0) || 0;

  /* ==========================
     TODAS AS IMAGENS
  ========================== */

  const allImages = produto.colors
    ?.flatMap((c) => c.images || [])
    .filter(Boolean);

  return (
    <div className="product-detail-container">
      {/* ==========================
          BREADCRUMB
      ========================== */}

      <div className="breadcrumb">
        <span
          onClick={() => navigate("/admin/produtos")}
          className="breadcrumb-link"
        >
          Produtos
        </span>

        <ChevronRight size={16} />

        <span className="breadcrumb-current">{produto.name}</span>
      </div>

      <h1 className="product-title">{produto.name}</h1>

      {/* ==========================
          CONTEÚDO PRINCIPAL
      ========================== */}

      <div className="product-main-sections">
        {/* ==========================
            INFORMAÇÕES
        ========================== */}

        <div className="product-info-section">
          <p>
            <strong>Descrição:</strong>{" "}
            {produto.description || "Sem descrição"}
          </p>

          <p>
            <strong>Preço Base:</strong> {produto.base_price} MZN
          </p>

          <p>
            <strong>Categoria:</strong>{" "}
            {produto.category_name || "Não especificada"}
          </p>

          <p>
            <strong>Status:</strong> {produto.status}
          </p>

          <p>
            <strong>Stock Total:</strong> {totalStock}
          </p>

          {/* ==========================
              CORES
          ========================== */}

          <div className="product-colors">
            <strong>Cores disponíveis</strong>

            <div className="colors">
              {produto.colors?.map((color) => {
                const stock =
                  color.sizes?.reduce(
                    (sum, s) => sum + s.stock_quantity,
                    0
                  ) || 0;

                return (
                  <div key={color.product_color_id} className="color-item">
                    <div
                      className="color-box"
                      style={{ backgroundColor: color.hex_code }}
                    />

                    <div className="color-info">
                      <span>{color.name}</span>
                      <small>Stock: {stock}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==========================
              TAMANHOS
          ========================== */}

          <div className="product-sizes">
            <div>
              <strong>Tamanhos disponíveis</strong>
              {produto.colors?.map((color) =>
                color.sizes?.map((size) => (
                  <div
                    key={size.product_color_size_id}
                    className="size-row"
                  >
                    <span>
                      {color.name} - {size.size}
                    </span>
                    <span>Stock: {size.stock_quantity}</span>
                    {size.promotion && (
                      <span className="promo">
                        Promo: {size.promotion.discount_percentage}% off
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ==========================
            GALERIA
        ========================== */}

        <div className="product-gallery-section">
          <h3>Galeria do Produto</h3>

          {/* IMAGEM PRINCIPAL */}

          <div className="image-preview">
            <img
              src={selectedImage}
              alt="Produto"
            />
          </div>

          {/* THUMBNAILS */}

          <div className="thumbnail-list">
            {allImages?.map((img) => (
              <img
                key={img.image_id}
                src={img.image_url}
                alt=""
                className={`thumb ${
                  selectedImage === img.image_url ? "active" : ""
                }`}
                onClick={() => setSelectedImage(img.image_url)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;