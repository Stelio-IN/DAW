import React, { useState, useEffect } from 'react';
import '../assets/style/carrinho.css';

function Carrinho() {
  const [cart, setCart] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [numeroCelular, setNumeroCelular] = useState('');  // Renomeado para numeroCelular
  const [endereco, setEndereco] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

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

  // Função para finalizar a compra
  const handleFinalizarCompra = async () => {
    if (!numeroCelular || !endereco) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  
    const totalValor = calculateTotal(); // Calcula o total do carrinho
  
    try {
      const response = await fetch('http://localhost:3000/iniciar-transacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numeroCelular: numeroCelular,  // Usando numeroCelular aqui
          valor: totalValor,  // Envia o valor total da transação
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Compra efetuada com sucesso!');  // Alerta de sucesso
        setPaymentMessage('Compra finalizada com sucesso!');
        localStorage.removeItem('cart'); // Limpa o carrinho após a compra
        setCart([]); // Atualiza o estado do carrinho na interface
      } else {
        alert(`Erro: ${data.erro.output_ResponseDesc}`);  // Alerta de erro
        setPaymentMessage(`Erro: ${data.erro.output_ResponseDesc}`);
      }
    } catch (error) {
      alert('Erro ao processar o pagamento. Tente novamente.');  // Alerta de erro
      setPaymentMessage('Erro ao processar o pagamento. Tente novamente.');
      console.error('Erro de requisição:', error);
    }
  };
  

  const handlePurchaseClick = () => {
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setPaymentMessage(''); // Limpa a mensagem de pagamento ao fechar o modal
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
                    <div className="product">
                      <div className="productDetails">
                        <div className="productDetails_1">
                          <img
                            src={product.image_url || 'default-image.png'}
                            alt={product.name}
                          />
                        </div>
                        <div className="productDetails_2">
                          <h3>{product.name}</h3>
                          <p>Preço: {product.price}$</p>
                          <p>Quantidade em Estoque: {product.stock_quantity}</p>
                          <p>Quantidade: {product.quantity}</p>
                        </div>
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
                        <button className="button addWishList">Adicionar favoritos</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="Order_summary">
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
                    <p>Você Poupou</p>
                    <p>5000 Mzn</p>
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

            {/* Modal de Pagamento */}
            {showPaymentModal && (
              <div className="modal" onClick={handleCloseModal}>
                <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                  <h2>Pagamento</h2>
                  <p>Total a Pagar: {calculateTotal()}$</p>
                  <label>
                    Celular:
                    <input
                      type="text"
                      placeholder="Seu celular"
                      value={numeroCelular}  // Atualizando com numeroCelular
                      onChange={(e) => setNumeroCelular(e.target.value)}  // Atualizando estado com numeroCelular
                    />
                  </label>
                  <label>
                    Local de Entrega:
                    <input
                      type="text"
                      placeholder="Endereço de entrega"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                    />
                  </label>
                  <button onClick={handleFinalizarCompra}>
                    Finalizar Compra
                  </button>
                  <button onClick={handleCloseModal}>Fechar</button>
                </div>
              </div>
            )}

            {/* Mensagem de pagamento */}
            {paymentMessage && <div className="paymentMessage">{paymentMessage}</div>}
          </>
        ) : (
          <p>Carrinho vazio</p>
        )}
      </div>
    </div>
  );
}

export default Carrinho;
