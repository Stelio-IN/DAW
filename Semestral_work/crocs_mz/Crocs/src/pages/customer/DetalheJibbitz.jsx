import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../assets/style/about.css";
import "../../assets/style/detalhesProduto.css";
import { useFavorites } from "../../context/FavoritesContext";

const JibbitzDetalhado = () => {
  const { jibbitzID } = useParams();
  const navigate = useNavigate();

  const [jibbitz, setJibbitz] = useState(null);
  const [relatedJibbitz, setRelatedJibbitz] = useState([]);
  const [imagemPrincipal, setImagemPrincipal] = useState(null);

  const { favorites, toggleFavorite } = useFavorites();

  // Fetch jibbitz
  useEffect(() => {
    if (jibbitzID) {
      fetch(`http://localhost:3005/api/jibbitz/jibs/${jibbitzID}`)
        .then((res) => res.json())
        .then((data) => {
          setJibbitz(data.jibbitz);
          setRelatedJibbitz(data.related_jibbitz || []);

          const primary =
            data.jibbitz.images?.find((img) => img.is_primary) ||
            data.jibbitz.images?.[0];

          setImagemPrincipal(primary?.image_url);
        })
        .catch((err) =>
          console.error("Erro ao buscar detalhes do jibbitz:", err),
        );
    }
  }, [jibbitzID]);

  // Adicionar ao carrinho
  const addToCart = () => {
    if (!jibbitz) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const price = jibbitz.promo_price || jibbitz.base_price;

   const item = {
  cart_item_id: `jibbitz_${jibbitz.jibbitz_id}`, // 🔑 NOVO
  type: "jibbitz",                              // 🔑 NOVO

  jibbitz_id: jibbitz.jibbitz_id,
  name: jibbitz.name,

  base_price: Number(jibbitz.base_price),
  price: Number(jibbitz.promo_price || jibbitz.base_price),

  quantity: 1,
  stock_quantity: jibbitz.stock_quantity,

  image_url: imagemPrincipal,

  promotion: {
    is_on_promotion: Boolean(jibbitz.promo_price),
    discount_percentage: jibbitz.discount_percentage || null,
    promo_price: jibbitz.promo_price || null,
  },
};


   const existing = cart.find(i => i.cart_item_id === item.cart_item_id);


    if (existing) {
      if (existing.quantity < existing.stock_quantity) {
        existing.quantity += 1;
      }
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Jibbitz adicionado ao carrinho");
  };

  if (!jibbitz)
    return <p style={{ padding: "40px" }}>Carregando detalhes do Jibbitz...</p>;

  const isPromo = Boolean(jibbitz.promo_price);

  return (
    <div className="container-detalhes-produto">
      <section className="container_detalhes">
        {/* COLUNA ESQUERDA */}
        <div className="col-esquerda">
          <div className="imagem-principal">
            <img
              src={imagemPrincipal}
              alt={jibbitz.name}
              className="principal"
            />
          </div>

          <div className="opcoes">
            {jibbitz.images?.map((img) => (
              <img
                key={img.image_id}
                src={img.image_url}
                alt="thumb"
                onClick={() => setImagemPrincipal(img.image_url)}
                style={{
                  cursor: "pointer",
                  border:
                    imagemPrincipal === img.image_url
                      ? "2px solid black"
                      : "1px solid #ddd",
                  borderRadius: "6px",
                  marginRight: "8px",
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="col-direita">
          <h1>{jibbitz.name}</h1>

          {/* PREÇO */}
          <p style={{ fontWeight: "bold", fontSize: "20pt" }}>
            {isPromo ? (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#888",
                    marginRight: "10px",
                  }}
                >
                  {Number(jibbitz.base_price).toLocaleString("pt-MZ", {
                    style: "currency",
                    currency: "MZN",
                  })}
                </span>

                <span style={{ color: "red" }}>
                  {Number(jibbitz.promo_price).toLocaleString("pt-MZ", {
                    style: "currency",
                    currency: "MZN",
                  })}
                </span>

                <span
                  style={{
                    background: "red",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    marginLeft: "10px",
                    fontSize: "12px",
                  }}
                >
                  -{jibbitz.discount_percentage}%
                </span>
              </>
            ) : (
              <span>
                {Number(jibbitz.base_price).toLocaleString("pt-MZ", {
                  style: "currency",
                  currency: "MZN",
                })}
              </span>
            )}
          </p>

          <p style={{ maxWidth: "600px", fontStyle: "italic" }}>
            {jibbitz.description}
          </p>

          {/* OUTROS JIBBITZ (como variantes) */}
          {relatedJibbitz.length > 0 && (
            <>
              <p className="label">Outras opções</p>
              <div className="alternativas">
                {relatedJibbitz.map((j) => (
                  <img
                    key={j.jibbitz_id}
                    src={j.primary_image_url}
                    alt={j.name}
                    onClick={() =>
                      navigate(`/jibbitz/detalhes/${j.jibbitz_id}`)
                    }
                    style={{
                      cursor: "pointer",
                      borderRadius: "6px",
                      marginRight: "8px",
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* BOTÕES */}
          <button className="cart" onClick={addToCart}>
            Adicionar ao Carrinho
          </button>

          <button onClick={() => toggleFavorite(jibbitz)} className="favor">
            {favorites.some((f) => f.jibbitz_id === jibbitz.jibbitz_id)
              ? "Remover dos Favoritos"
              : "Adicionar aos Favoritos"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default JibbitzDetalhado;
