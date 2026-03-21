import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/style/carrinho.css";
import { FiMinus, FiPlus } from "react-icons/fi";

function Carrinho() {
  const [cart, setCart] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Recupera o estado do carrinho do localStorage ao carregar a página
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    console.log("=== CARRINHO LIDO DO LOCALSTORAGE ===");
  console.log(storedCart);

    const cartWithQuantities = storedCart.map((product) => ({
      ...product,
      quantity: product.quantity || 1, // Se não existir quantity, define 1
    }));

    console.log("=== CARRINHO COM QUANTIDADES ===");
  console.log(cartWithQuantities);
    setCart(cartWithQuantities);
  }, []);

  // Atualiza a quantidade de um produto específico (considerando cor)
  const updateQuantity = (cartItemId, delta) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.cart_item_id === cartItemId) {
          const newQuantity = item.quantity + delta;
          return {
            ...item,
            quantity:
              newQuantity >= 1 && newQuantity <= item.stock_quantity
                ? newQuantity
                : item.quantity,
          };
        }
        return item;
      });

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => item.cart_item_id !== cartItemId,
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Total sem desconto (preço original)
  const calculateSubtotal = () => {
    return cart.reduce((total, product) => {
      return total + product.base_price * product.quantity;
    }, 0);
  };

  // Total a pagar (já com promoções)
  const calculateTotal = () => {
    return cart.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  // Quanto o cliente poupou
  const calculateDiscount = () => {
    return cart.reduce((total, product) => {
      if (product.is_on_promotion) {
        return total + (product.base_price - product.price) * product.quantity;
      }
      return total;
    }, 0);
  };

  const handlePurchaseClick = () => {
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="content-carrinho_">
      <div className="container_">
        {cart.length > 0 ? (
          <>
            <div className="carrinho_">
              <ul className="productList_">
                {cart.map((product) => (
                  <li key={product.cart_item_id} className="productItem_">
                    <div className="product_">
                      <div className="productDetails_">
                        <div className="productDetails_1_">
                          <img
                            src={product.primary_image_url || product.image_url}
                            alt={product.name}
                          />
                        </div>
                        <div className="productDetails_2">
                          <h3>{product.name}</h3>

                          {/* Cor */}
                          {/* ===== DETALHES ESPECÍFICOS POR TIPO ===== */}
                          {product.type === "product" && (
                            <>
                              <p className="cart-info-line">
                                <span>Cor:</span>
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >       
                                  <span
                                    style={{
                                      width: "14px",
                                      height: "14px",
                                      borderRadius: "50%",
                                      backgroundColor: product.hex_code,
                                      border: "1px solid #ccc",
                                    }}
                                  /> 
                                  {product.color}
                                </span>
                              </p>
                                    
                              <p className="cart-info-line">
                                <span>Tamanho:</span>
                                <span>
                                  {product.size} ({product.size_type})
                                </span>
                              </p>
                  
                              <p className="cart-info-line">
                                <span>SKU:</span>
                                <span>{product.sku}</span>
                              </p>
                            </>
                          )}

                          {product.type === "jibbitz" && (
                            <p className="cart-info-line">
                              <span>Tipo:</span>
                              <span>Jibbitz</span>
                            </p>
                          )}

                          {/* Preço */}
                          <p>
                            <span>Preço</span>
                            <span>
                              {product.is_on_promotion ? (
                                <>
                                  <span
                                    style={{
                                      textDecoration: "line-through",
                                      color: "#888",
                                      marginRight: "8px",
                                    }}
                                  >
                                    {product.base_price} Mzn
                                  </span>
                                  <span style={{ color: "red" }}>
                                    {product.price} Mzn
                                  </span>
                                </>
                              ) : (
                                <span>{product.price} Mzn</span>
                              )}
                            </span>
                          </p>

                          {/* Quantidade */}
                          <p>
                            <span>Quantidade</span>
                            <span>{product.quantity}</span>
                          </p>

                         {/* Stock 
                          <p className="cart-stock">
                            <span>Disponível:</span>
                            <span>{product.stock_quantity}</span>
                          </p>*/}
                        </div>
                      </div>

                      <div className="buttons_">
                        <button
                          className="button_"
                          onClick={() =>
                            updateQuantity(product.cart_item_id, 1)
                          }
                          disabled={product.quantity >= product.stock_quantity}
                        >
                          <FiPlus size={15} style={{ margin: "auto" }} />
                        </button>
                        <button
                          className="button_"
                          onClick={() =>
                            updateQuantity(product.cart_item_id, -1)
                          }
                          disabled={product.quantity <= 1}
                        >
                          <FiMinus size={15} style={{ margin: "auto" }} />
                        </button>
                        <p
                          className="button_ removeButton_"
                          onClick={() => removeFromCart(product.cart_item_id)}
                        >
                          Remover
                        </p>
                        <p className="button_ addWishList_">Favoritar</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="Order_summary_">
                <div className="order_">
                  <h2>RESUMO DO PEDIDO</h2>
                  <div className="subtotal_">
                    <p>SubTotal</p>
                    <p>
                      {calculateSubtotal().toLocaleString("pt-MZ", {
                        style: "currency",
                        currency: "MZN",
                      })}
                    </p>
                  </div>

                  <div className="shipping_">
                    <p>Entrega (Delivery)</p>
                    <p>Será calculado a seguir</p>
                  </div>

                  <div className="descounted_">
                    <p>Você Poupou</p>
                    <p style={{ color: "green" }}>
                      -
                      {calculateDiscount().toLocaleString("pt-MZ", {
                        style: "currency",
                        currency: "MZN",
                      })}
                    </p>
                  </div>

                  <div className="total_">
                    <p>Total:</p>
                    <p>
                      {calculateTotal().toLocaleString("pt-MZ", {
                        style: "currency",
                        currency: "MZN",
                      })}
                    </p>
                  </div>

                  <Link to="/pagamento">
                    <button
                      className="purchaseButton_"
                      onClick={handlePurchaseClick}
                    >
                      Finalizar Compra
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Modal de Pagamento */}
            {showPaymentModal && (
              <div className="modal" onClick={handleCloseModal}>
                <div
                  className="modalContent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2>Pagamento</h2>
                  <p>Total a Pagar: {calculateTotal()}$</p>
                  <label>
                    Celular:
                    <input type="text" placeholder="Seu celular" />
                  </label>
                  <label>
                    Local de Entrega:
                    <input type="text" placeholder="Endereço de entrega" />
                  </label>
                  <button
                    onClick={() => alert("Compra finalizada com sucesso!")}
                  >
                    Finalizar Compra
                  </button>
                  <button onClick={handleCloseModal}>Fechar</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p>Carrinho vazio</p>
        )}
      </div>
    </div>
  );
}

export default Carrinho;
