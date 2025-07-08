import React, { useState, useEffect } from 'react';

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

  // Estilo dos elementos
  const styles = {
    container: {
      marginTop: '100px',
      padding: '20px',
      maxWidth: '600px',
      margin: '100px auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    },
    productList: {
      listStyle: 'none',
      padding: 0,
    },
    productItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #ddd',
      padding: '10px 0',
    },
    productDetails: {
      flexGrow: 1,
    },
    buttons: {
      display: 'flex',
      gap: '8px',
    },
    button: {
      padding: '5px 10px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    removeButton: {
      backgroundColor: '#dc3545',
    },
    total: {
      fontWeight: 'bold',
      marginTop: '20px',
      textAlign: 'right',
    },
    purchaseButton: {
      marginTop: '20px',
      padding: '10px 16px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '400px',
      width: '100%',
    },
  };

  const handlePurchaseClick = () => {
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <div style={styles.container}>
      
      {cart.length > 0 ? (
        <>
          <ul style={styles.productList}>
            {cart.map((product, index) => (
              <li key={index} style={styles.productItem}>
                <div style={styles.productDetails}>
                  <h3>{product.name}</h3>
                  <p>Preço: {product.price}$</p>
                  <p>Quantidade em Estoque: {product.stock_quantity}</p>
                  <p>Quantidade: {product.quantity}</p>
                </div>
                <div style={styles.buttons}>
                  <button
                    style={styles.button}
                    onClick={() => updateQuantity(index, 1)}
                    disabled={product.quantity >= product.stock_quantity}
                  >
                    +
                  </button>
                  <button
                    style={styles.button}
                    onClick={() => updateQuantity(index, -1)}
                    disabled={product.quantity <= 1}
                  >
                    -
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.removeButton }}
                    onClick={() => removeFromCart(index)}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div style={styles.total}>
            <p>Total: {calculateTotal()}$</p>
          </div>
          <button style={styles.purchaseButton} onClick={handlePurchaseClick}>
            Realizar Compra
          </button>

          {/* Modal de Pagamento */}
          {showPaymentModal && (
            <div style={styles.modal} onClick={handleCloseModal}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
                <button onClick={() => alert('Compra finalizada com sucesso!')}>Finalizar Compra</button>
                <button onClick={handleCloseModal}>Fechar</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>O carrinho está vazio.</p>
      )}
    </div>
  );
}

export default Carrinho;