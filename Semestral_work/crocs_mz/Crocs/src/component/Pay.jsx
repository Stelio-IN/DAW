import React, { useState, useEffect } from "react";
import "../assets/style/pagamento.css";
import "../assets/style/loja.css";
import paypal from "../assets/img/paypal-logo.png";
import cartao from "../assets/img/card.svg";
import mpesa from "../assets/img/mpesa.png";
import emola from "../assets/img/emola.png";
import Timeline from "../component/TimeLine";
import PayPalButton from '../component/Paypal';

const Pay = () => {
  //const [selectedSize, setSelectedSize] = useState(null);
  const [currentStep] = useState(1);
  // Estado para controlar qual método de pagamento está ativo
  //const [activePayment, setActivePayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  

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
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartWithQuantities = storedCart.map((product) => ({
      ...product,
      quantity: 1,
    }));
    setCart(cartWithQuantities);
  }, []);

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
                <Timeline currentStep={currentStep} /> <br />
              <h3 style={{ color: "#5b5b5b" }}>Endereço de Entrega *</h3>
              <p>Preencha os dados abaixo com o seu endereço.</p>
            </div>
            <div>
              {" "}
              <select id="combo-pais">
                <option value="Moçambique">Moçambique</option>
              </select>{" "}
            </div>
            <div>
              {" "}
              <input type="text" placeholder="   Seu primeiro nome" />{" "}
              <input type="text" placeholder="   Seu sobrenome" />{" "}
            </div>
            <div>
              {" "}
              <input type="text" placeholder="   Endereço primario" />{" "}
            </div>
            <div>
              {" "}
              <input type="text" placeholder="   Endereço secundario" />{" "}
            </div>
            <div>
              <input type="text" placeholder="   Cidade" />{" "}
              <input type="text" placeholder="   Provincia" />{" "}
              <input type="number " placeholder="   Código Postal" maxLength={5} />
            </div>
            <div>
              {" "}
              <input type="number" placeholder="   Telefone" maxLength={9} />{" "}
            </div>

            <div
              style={{
                marginTop: "50px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3 style={{ color: "#5b5b5b" }}>Pagamento*</h3>
              <p>Todas as transações são seguras e encriptadas.</p>
            </div>

            <section className="Payments">
              <div>
                <p> Total a pagar: {calculateTotal()} Mzn</p>

              {/* Paypal */}
<button
  id="btn_paypal"
  onClick={() => toggleMethod('paypal')} // Altera o método de pagamento para "paypal"
>
  <img src={paypal} alt="PayPal" />
</button>

{activeMethod === 'paypal' && (
  <div className="Paypal_payment">
    <p>
      Nós vamos redirecioná-lo para o PayPal de modo a efetuar o pagamento.{' '}
      <span style={{ color: 'blue', textDecoration: 'underline' }}>
        O que é PayPal?
      </span>
    </p>
    <PayPalButton totalMZN={calculateTotal()} /> {/* Passa o valor total em MZN */}
  </div>
)}


                {/* Cartão */}
                <button id="btn_card" onClick={() => toggleMethod("card")}>
                  {" "}
                  <img src={cartao} alt="" /> <span>Cartão</span>
                </button>
                {activeMethod === "card" && (
                  <div className="Card_payment">
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

                    <button id="btn_pay">
                      {" "}
                      <span>Pagar com </span>{" "}
                      <img src={mpesa} alt="" onClick={handlePurchaseClick} />
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
                          <button
                            onClick={() =>
                              alert("Compra finalizada com sucesso!")
                            }
                          >
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
                    <button id="btn_pay">
                      {" "}
                      <span>Pagar com </span>{" "}
                      <img src={emola} alt="" onClick={handlePurchaseClick} />
                    </button>
                  </div>
                )}
              </div>
            </section>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                width: '500px'
              }}
            >
              <h3 style={{ color: "#5b5b5b" }}>Novidades & Promoções</h3>
              <p>Ao se inscrever para a nossa newsletter você receberá novidades e promoções directamente no seu e-mail.</p>
            </div>
            <input type="text" id="newsletter" placeholder="Digite o seu melhor e-mail"/>
            <input type="button" value="Quero receber novidades" id="btn_newsletter" />
           <br /><br />
          </div>
      
        </section>
        

        <section className="Detalhes">
          <div className="Order_summary">
            <ul className="productList">
              {cart.map((product, index) => (
                <li key={index} className="productItem">
                  <div className="product">
                    <div className="productDetails">
                      <div className="productDetails_1">
                        <img
                          src={product.primary_image_url || "default-image.png"}
                          alt={product.name}
                        />
                      </div>
                      <div className="productDetails_2">
                        <h3>{product.name}</h3>
                        <p>Preço: {product.price}$</p>
                        <p>Quantidade: {product.quantity}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="order">
              <h2></h2>
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
          </div>
        </section>
      </div>
    </div>
  );
};

export default Pay;
