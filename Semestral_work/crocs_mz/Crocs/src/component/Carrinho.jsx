import React, { useState, useEffect } from 'react';
import '../assets/style/carrinho.css'; 

function Carrinho() {
  const [cart, setCart] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Recupera o estado do carrinho do localStorage ao carregar a página
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartWithQuantities = storedCart.map(product => ({ ...product, quantity: 1 }));
    setCart(cartWithQuantities);
  }, []);

  // Atualiza a quantidade de um produto
  const updateQuantity = (index, delta) => {
    setCart(prevCart => {
      const updatedCart = [...prevCart];
      const item = updatedCart[index];
      if (item.quantity + delta >= 1 && item.quantity + delta <= item.stock_quantity) {
        item.quantity += delta;
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Remove um item do carrinho
  const removeFromCart = (index) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter((_, i) => i !== index);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Cálculo do total do carrinho
  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  };


  const handlePurchaseClick = () => {
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  return (
<div className="content-carrinho">
    
        <div className="container">
      {cart.length > 0 ? (
        <>

          <div className="carrinho">
              <ul className="productList">
                {cart.map((product, index) => (
                  <li key={index} className="productItem">
                    <div className="productDetails">
                      <h3>{product.name}</h3>
                      <p>Preço: {product.price}$</p>
                      <p>Quantidade em Estoque: {product.stock_quantity}</p>
                      <p>Quantidade: {product.quantity}</p>
                    </div>
                    <div className="buttons">
                      <button
                        className="button"
                        onClick={() => updateQuantity(index, 1)}
                        disabled={product.quantity >= product.stock_quantity}
                      >
                        +
                      </button>
                      <button
                        className="button"
                        onClick={() => updateQuantity(index, -1)}
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <button
                        className="button removeButton"
                        onClick={() => removeFromCart(index)}
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              
                <div className="Order_summary">
                    <div className="subtotal">
                    <p>SubTotal {2000 + 'items'}</p>
                    <p>2000 Mzn</p>
                    </div>
                    <div className="shipping">
                    <p>Shipping</p>
                    <p>Calculated on next step</p>
                    </div>
                    <div className="descounted">
                    <p>Voce Poupou</p>
                    <p> 5000 Mzn</p>
                    </div>
              
                    <div className="total">
                    <p>Total: </p>
                    <p>{calculateTotal()} Mzn</p>
                    </div>
                    <Link to="/pagamento">
                        <button className="purchaseButton" onClick={handlePurchaseClick}>
                          Realizar Compra
                         </button>
                    </Link>
              
                </div>
          </div>


         
    
          {/* Modal de Pagamento */}
          {showPaymentModal && (
            <div className="modal" onClick={handleCloseModal}>
              <div className="modalContent" onClick={(e) => e.stopPropagation()}>
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
                <button onClick={() => alert('Compra finalizada com sucesso!')}>
                  Finalizar Compra
                </button>
                <button onClick={handleCloseModal}>Fechar</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="carrinho">
        <ul className="productList">
          {cart.map((product, index) => (
            <li key={index} className="productItem">
              <div className="productDetails">
                <h3>{product.name}</h3>
                <p>Preço: {product.price}$</p>
                <p>Quantidade em Estoque: {product.stock_quantity}</p>
                <p>Quantidade: {product.quantity}</p>
              </div>
              <div className="buttons">
                <button
                  className="button"
                  onClick={() => updateQuantity(index, 1)}
                  disabled={product.quantity >= product.stock_quantity}
                >
                  +
                </button>
                <button
                  className="button"
                  onClick={() => updateQuantity(index, -1)}
                  disabled={product.quantity <= 1}
                >
                  -
                </button>
                <button
                  className="button removeButton"
                  onClick={() => removeFromCart(index)}
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
        
          <div className="order_summary">
              <div className="order">
                <h2>Order Summary</h2>
                  <div className="subtotal">
                  <p>SubTotal</p>
                  <p>2000 Mzn</p>
                  </div>
                  <div className="shipping">
                  <p>Shipping</p>
                  <p>Calculated on next step</p>
                  </div>
                  <div className="descounted">
                  <p>Voce Poupou</p>
                  <p> 5000 Mzn</p>
                  </div>
                  <div className="total">
                  <p>Total: </p>
                  <p>{calculateTotal()} Mzn</p>
                  </div>
                  <button className="purchaseButton" onClick={handlePurchaseClick}>
                    Realizar Compra
                   </button>
              </div>
        
          </div>
    </div>
      )}
        </div>
</div>

  );
}

export default Carrinho;