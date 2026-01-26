import React, { useState, useEffect } from "react";
import "../../assets/style/pagamento.css";
import "../../assets/style/loja.css";
import paypal from "../../assets/img/paypal-logo.png";
import cartao from "../../assets/img/card.svg";
import mpesa from "../../assets/img/mpesa.png";
import emola from "../../assets/img/emola.png";
import Timeline from "../../component/TimeLine";
import PayPalButton from "../customer/Paypal";

const Pay = () => {
  //const [selectedSize, setSelectedSize] = useState(null);
  const [currentStep] = useState(1);
  // Estado para controlar qual método de pagamento está ativo
  //const [activePayment, setActivePayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Dados de entrega
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Moçambique");

  const handleSubmitOrder = async () => {
  // Verifica se há método de pagamento
  if (!activeMethod) {
    alert("Selecione um método de pagamento");
    return;
  }

  // Verifica dados obrigatórios de entrega
  if (!firstName || !lastName || !address1 || !city || !phone) {
    alert("Preencha todos os dados de entrega obrigatórios");
    return;
  }

  // Prepara o carrinho para envio
  const cartPrepared = cart.map(item => {
  if (item.type === "product") {
    return {
    ...item,
    type: "product",
    product_id: Number(item.product_id),
    product_color_id: Number(item.product_color_id),
    product_color_size_id: Number(item.product_color_size_id),
    quantity: Number(item.quantity || 1),
    price: Number(item.price || 0),
    };
  }

  if (item.type === "jibbitz") {
    return {
      type: "jibbitz",
      cart_item_id: item.cart_item_id,
      jibbitz_id: Number(item.jibbitz_id),
      unit_cost: Number(item.unit_cost),
      quantity: Number(item.quantity),
      price: Number(item.price),
      stock_quantity: Number(item.stock_quantity || 0),
      is_on_promotion: item.is_on_promotion || false,
      promotion_id: item.promotion_id || null,
      discount_percentage: item.discount_percentage || null,
    };
  }

  return null;
}).filter(Boolean);



  // Validação simples
const invalidItems = cartPrepared.filter(item => {
  if (item.type === "product") return !item.product_color_size_id;
  if (item.type === "jibbitz") return !item.jibbitz_id;
  return true; // qualquer outro tipo é inválido
});

if (invalidItems.length > 0) {
  console.error("Itens inválidos no carrinho:", invalidItems);
  alert("Há produtos inválidos no carrinho.");
  return;
}


  // Verifica se o carrinho não está vazio
  if (cartPrepared.length === 0) {
    alert("O carrinho está vazio ou contém produtos inválidos.");
    return;
  }

  console.log("Cart que será enviado:", cartPrepared);

  // Cria objeto do cliente
  const customer = {
    id: 8, // teste
    deliveryInfo: {
      first_name: firstName,
      last_name: lastName,
      address1,
      address2,
      city,
      province,
      postal_code: postalCode,
      phone,
      country,
    },
  };

  try {
    const response = await fetch("http://localhost:3005/api/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        cart: cartPrepared,   // envia cart preparado
        paymentMethod: activeMethod,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao criar pedido");
      console.error("Erro do backend:", data);
      return;
    }

    console.log("VENDA REGISTADA:", data);
    alert("Venda criada com sucesso!");
    emptyCart();
  } catch (err) {
    console.error("Erro de ligação ao servidor:", err);
    alert("Erro de ligação ao servidor");
  }
};

  const handlePurchaseClick = () => {
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  // Estado para controlar qual método está ativo
  // Estado para controlar qual método está ativo
  const [activeMethod, setActiveMethod] = useState(null);

  // Função para definir o método ativo (e fechar outros)
  const toggleMethod = (method) => {
    setActiveMethod((prevMethod) => (prevMethod === method ? null : method));
  };

  // carrinho
  const [cart, setCart] = useState([]);
  // Recupera o estado do carrinho do localStorage ao carregar a página
  useEffect(() => {
    const loadCart = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    };

    // Carrega ao abrir
    loadCart();

    // Escuta mudanças do localStorage
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  

  const emptyCart = () => {
    setCart([]); // Esvazia o estado do carrinho
    localStorage.removeItem("cart"); // Remove os dados do carrinho do localStorage
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  return (
    <div className="content-pagamento">
      <div className="pagamento">
        <section className="catalog-items">
          <div className="delivery">
            <div
              style={{
                marginTop: "50px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/*<Timeline currentStep={currentStep} /> <br />*/}
              <h3 style={{ color: "#5b5b5b" }}>Endereço de Entrega *</h3>
              <p>Preencha os dados abaixo com o seu endereço.</p>
            </div>
            <div>
              {" "}
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="Moçambique">Moçambique</option>
              </select>{" "}
            </div>
            <div>
              {" "}
              <input
                type="text"
                placeholder="Seu primeiro nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Seu sobrenome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />{" "}
            </div>
            <div>
              {" "}
              <input
                type="text"
                placeholder="Endereço primario"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />{" "}
            </div>
            <div>
              {" "}
              <input
                type="text"
                placeholder="Endereço secundario"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />{" "}
            </div>
            <div>
              <input
                type="text"
                placeholder="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                type="text"
                placeholder="Provincia"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
              <input
                type="number"
                placeholder="Código Postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div>
              {" "}
              <input
                type="number"
                placeholder="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />{" "}
            </div>

            <div
              style={{
                marginTop: "50px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <button onClick={handleSubmitOrder}>Finalizarrrrr Compra</button>
            </div>

            <section className="Payments">
              <h3 style={{ color: "#5b5b5b", width: "100%" }}>Pagamento*</h3>
              <p style={{ color: "#000000", width: "100%" }}>
                Todas as transações são seguras e encriptadas.
              </p>
              <div>
                <p>
                  Total a pagar:
                  <span style={{ fontWeight: "700" }}>
                    {" "}
                    {calculateTotal()} Mzn
                  </span>
                </p>

                {/* PAYPAL */}
                <button id="btn_paypal" onClick={() => toggleMethod("paypal")}>
                  <img src={paypal} alt="" />
                </button>

                {activeMethod === "paypal" && (
                  <div className="Paypal_payment">
                    <p>
                      Nós vamos redirecioná-lo para o PayPal de modo a efetuar o
                      pagamento.{" "}
                      <span
                        style={{ color: "blue", textDecoration: "underline" }}
                      >
                        O que é PayPal?
                      </span>
                    </p>

                    <PayPalButton
                      totalMZN={calculateTotal()}
                      cartItems={cart}
                      onPaymentSuccess={handleSubmitOrder}
                    />
                  </div>
                )}

                {/* CARTÃO */}
                <button id="btn_card" onClick={() => toggleMethod("card")}>
                  <img src={cartao} alt="" /> <span>Cartão</span>
                </button>

                {activeMethod === "card" && (
                  <div className="Card_payment">
                    <label>Nome do Proprietário</label>
                    <input type="text" placeholder="Tobias Zucula Mphemo" />

                    <label>Número do cartão</label>
                    <input type="number" placeholder="1234 5678 9012 3456" />

                    <div className="div1">
                      <div>
                        <label>Data de Expiração</label>
                        <input type="text" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label>CVV</label>
                        <input type="number" placeholder="123" />
                      </div>
                    </div>

                    {/* BOTÃO FINAL DE VENDA */}
                    <button onClick={handleSubmitOrder}>
                      Finalizar Compra
                    </button>
                  </div>
                )}

                {/* MPESA */}
                <button id="btn_mpesa" onClick={() => toggleMethod("mpesa")}>
                  <img src={mpesa} alt="" />
                </button>

                {activeMethod === "mpesa" && (
                  <div className="M-pesa_payment">
                    <p>Clique no botão abaixo e confirme o pagamento.</p>

                    <button id="btn_pay" onClick={handleSubmitOrder}>
                      <span>Pagar com </span>
                      <img src={mpesa} alt="" />
                    </button>
                  </div>
                )}

                {/* EMOLA */}
                <button id="btn_emola" onClick={() => toggleMethod("emola")}>
                  <img src={emola} alt="" />
                </button>

                {activeMethod === "emola" && (
                  <div className="Emola_payment">
                    <p>Clique no botão abaixo e prossiga com o pagamento.</p>

                    <button id="btn_pay" onClick={handleSubmitOrder}>
                      <span>Pagar com </span>
                      <img src={emola} alt="" />
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>

        <section className="Detalhes">
          <div className="Order_summary">
            <ul className="productList">
              {cart.map((product) => (
              <li key={product.cart_item_id} className="productItem">
                  <div className="product">
                    <div className="productDetails">
                      <div className="productDetails_1">
                        <img
                          src={
                            product.primary_image_url ||
                            product.image_url ||
                            "default.png"
                          }
                          alt={product.name}
                        />
                      </div>
                      <div className="productDetails_2">
  <h3>{product.name}</h3>

  <p>Preço: {product.price} Mzn</p>
  <p>Quantidade: {product.quantity}</p>

  {/* ===== DETALHES POR TIPO ===== */}

  {product.type === "product" && (
    <>
      <p>Cor: {product.color}</p>
      <p>
        Tamanho: {product.size} ({product.size_type})
      </p>
    </>
  )}

  {product.type === "jibbitz" && (
    <p>Tipo: Jibbitz</p>
  )}
</div>

                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="order">
              <h2>RESUMO DO PEDIDO</h2>
              <div className="subtotal">
                <p>SubTotal</p>
                <p>0 Mzn</p>
              </div>
              <div className="shipping">
                <p>Shipping</p>
                <p>Calculated on next step</p>
              </div>
              <div className="descounted">
                <p>Voce Poupou</p>
                <p> 0 Mzn</p>
              </div>
              <div className="total">
                <p>Total: </p>
                <p> {calculateTotal()} Mzn</p>
              </div>
            </div>

            <section className="Paymentos">
              <h3 style={{ color: "#000000", width: "100%" }}>Pagamento*</h3>
              <p style={{ color: "#000000", width: "100%" }}>
                Todas as transações são seguras e encriptadas.
              </p>
              <div>
                <p>
                  {" "}
                  Total a pagar:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {calculateTotal()} Mzn
                  </span>
                </p>

                {/* Paypal */}
                <button id="btn_paypal" onClick={() => toggleMethod("paypal")}>
                  {" "}
                  <img src={paypal} alt="" />
                </button>
                {activeMethod === "paypal" && (
                  <div className="Paypal_payment">
                    <p>
                      Nós vamos redirecioná-lo para o PayPal de modo a efetuar o
                      pagamento.{" "}
                      <span
                        style={{ color: "blue", textDecoration: "underline" }}
                      >
                        O que é PayPal?
                      </span>
                    </p>
                    <PayPalButton
                      totalMZN={calculateTotal()}
                      onPaymentSuccess={emptyCart}
                      cartItems={cart} // Passando o cart como prop
                    />
                  </div>
                )}

                {/* Cartão */}
                <button id="btn_card" onClick={() => toggleMethod("card")}>
                  {" "}
                  <img src={cartao} alt="" /> <span>Cartão</span>
                </button>
                {activeMethod === "card" && (
                  <div className="Card_paymento">
                    <label htmlFor=""> Nome do Proprietário</label>
                    <input type="text" placeholder="Tobias Zucula Mphemo" />
                    <label htmlFor=""> Número do cartão</label>
                    <input
                      type="number"
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                    />
                    <div className="div1">
                      <div>
                        <label htmlFor="">Data de Expiração</label>
                        <input type="text" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label htmlFor="">CVV</label>
                        <input type="number" placeholder="Cvv" maxLength={3} />
                      </div>
                    </div>
                  </div>
                )}

                {/* M-pesa */}
                <button id="btn_mpesa" onClick={() => toggleMethod("mpesa")}>
                  {" "}
                  <img src={mpesa} alt="" />
                </button>
                {activeMethod === "mpesa" && (
                  <div className="M-pesa_payment">
                    <p>Clique no botão abaixo e confirme o pagamento..</p>

                    <button id="btn_pay" onClick={handleSubmitOrder}>
                      <span>Pagar com</span>
                      <img src={mpesa} alt="" />
                    </button>

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
                          <button onClick={handleSubmitOrder}>
                            Finalizar Compra
                          </button>

                          <button onClick={handleCloseModal}>Fechar</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Emola */}
                <button id="btn_emola" onClick={() => toggleMethod("emola")}>
                  {" "}
                  <img src={emola} alt="" />
                </button>
                {activeMethod === "emola" && (
                  <div className="Emola_payment">
                    <p>Clique no botão abaixo e prossiga com o pagamento.</p>
                    <button onClick={handleSubmitOrder}>
                      Finalizar Compra
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Pay;
