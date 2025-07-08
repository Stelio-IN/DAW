import React, { useEffect, useState } from 'react';

const PayPalButton = ({ totalMZN, onPaymentSuccess, cartItems }) => {
  const [totalUSD, setTotalUSD] = useState(0);


   // UseEffect para ver os itens do carrinho quando passados para o PayPalButton
  useEffect(() => {
    console.log("Itens do carrinho passados para PayPalButton:", cartItems);
  }, [cartItems]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/MZN');
        const data = await response.json();
        const exchangeRate = data.rates.USD;
        setTotalUSD((totalMZN * exchangeRate).toFixed(2));
      } catch (error) {
        console.error('Erro ao obter a taxa de câmbio:', error);
      }
    };

    fetchExchangeRate();
  }, [totalMZN]);

  useEffect(() => {
    const renderPayPalButton = () => {
      if (window.paypal && totalUSD > 0) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: totalUSD,
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(async (details) => {
              alert(`Pagamento concluído por ${details.payer.name.given_name}`);
          
              // Dados do pagamento
              const paymentData = {
                payerName: details.payer.name.given_name,
                payerEmail: details.payer.email_address,
                totalUSD: totalUSD,
                orderId: details.id,
                cartItems: cartItems, // Envia o carrinho completo
              };

              console.log("Dados do pagamento e carrinho sendo enviados:", paymentData); // Log para verificar
          
              // Enviar os dados para o servidor
              try {
                const response = await fetch('http://localhost:3005/api/payments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(paymentData),
                });
          
                const result = await response.json();
                console.log('Resposta do servidor:', result);
              } catch (error) {
                console.error('Erro ao enviar os dados do pagamento:', error);
              }
          
              if (onPaymentSuccess) {
                onPaymentSuccess(); // Esvazia o carrinho
              }
            });
          },
          onError: (err) => {
            console.error('Erro no PayPal:', err);
          },
        }).render('#paypal-button-container');
      }
    };

    renderPayPalButton();
  }, [totalUSD, onPaymentSuccess, cartItems]); // Dependência de cartItems

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
