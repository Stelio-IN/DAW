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

  // Adicionar ao carrinho jibbitz
  const addToCart = () => {
  if (!jibbitz) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const promotion = jibbitz.promotion || null;

  const item = {
    cart_item_id: `jibbitz_${jibbitz.jibbitz_id}`,
    type: "jibbitz",

    jibbitz_id: jibbitz.jibbitz_id,
    name: jibbitz.name,

    base_price: Number(jibbitz.base_price),
    price: Number(promotion?.promo_price || jibbitz.base_price),
    unit_cost: Number(jibbitz.cost_price || 0),
    quantity: 1,
    stock_quantity: jibbitz.stock_quantity,

    image_url: imagemPrincipal,
    

    // 🔥 PROMOÇÃO (CORRETO)
    is_on_promotion: Boolean(promotion),
    promotion_id: promotion?.promotion_id || null,
    discount_percentage: promotion?.discount_percentage || null,
    promo_price: promotion?.promo_price || null,
    promo_stock_used: promotion?.promo_stock_used || 0,
    promo_stock_limit: promotion?.promo_stock_limit || null,
  };

  console.log("🛒 JIBBITZ ADICIONADO AO CARRINHO:", item);

  const existing = cart.find(i => i.cart_item_id === item.cart_item_id);

  if (existing) {
    if (existing.quantity < existing.stock_quantity) {
      existing.quantity += 1;
    }
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
   console.group("🛒 JIBBITZ ADICIONADO AO CARRINHO");
  console.log("Item enviado para o carrinho:", item);
  console.log("Carrinho completo agora:", cart);
  console.groupEnd();
  alert("Jibbitz adicionado ao carrinho");
};


  if (!jibbitz)
    return <p style={{ padding: "40px" }}>Carregando detalhes do Jibbitz...</p>;

  const promotion = jibbitz.promotion || null;

const isPromo = Boolean(promotion?.promo_price);

const basePrice = Number(jibbitz.base_price);
const promoPrice = Number(promotion?.promo_price);
const discountPercentage = promotion?.discount_percentage;

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
        {basePrice.toLocaleString("pt-MZ", {
          style: "currency",
          currency: "MZN",
        })}
      </span>

      <span style={{ color: "red" }}>
        {promoPrice.toLocaleString("pt-MZ", {
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
        -{discountPercentage}%
      </span>
    </>
  ) : (
    <span>
      {basePrice.toLocaleString("pt-MZ", {
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
