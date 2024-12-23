import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const PayPalButton = ({ totalMZN }) => {
  const [totalUSD, setTotalUSD] = useState(0);
  const [orderID, setOrderID] = useState(null);

  useEffect(() => {
    // Obter a taxa de câmbio de MZN para USD
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/MZN');
        const data = await response.json();
        const exchangeRate = data.rates.USD; // Taxa de câmbio de MZN para USD
        setTotalUSD((totalMZN * exchangeRate).toFixed(2)); // Calcula o valor em USD com 2 casas decimais
      } catch (error) {
        console.error('Erro ao obter a taxa de câmbio:', error);
      }
    };

    fetchExchangeRate();
  }, [totalMZN]);

  useEffect(() => {
    if (totalUSD > 0) {
      // Criar pedido no backend quando o totalUSD for calculado
      const createOrder = async () => {
        try {
          const response = await fetch('/paypal/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ total: totalUSD }),
          });
          const data = await response.json();
          setOrderID(data.id); // Guarda o ID do pedido retornado pelo backend
        } catch (error) {
          console.error('Erro ao criar pedido PayPal:', error);
        }
      };

      createOrder();
    }
  }, [totalUSD]);

  useEffect(() => {
    if (orderID) {
      window.paypal.Buttons({
        createOrder: () => {
          return orderID; // Usa o ID do pedido gerado pelo backend
        },
        onApprove: async (data) => {
          try {
            // Enviar a captura do pagamento para o backend
            const response = await fetch('/paypal/capture-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const captureResult = await response.json();
            alert(`Pagamento concluído por ${captureResult.payer.name.given_name}`);
          } catch (err) {
            console.error('Erro ao capturar o pagamento:', err);
          }
        },
        onError: (err) => {
          console.error('Erro no PayPal:', err);
        },
      }).render('#paypal-button-container');
    }
  }, [orderID]);

  return <div id="paypal-button-container"></div>;
};

PayPalButton.propTypes = {
  totalMZN: PropTypes.number.isRequired, // totalMZN deve ser um número obrigatório
};

export default PayPalButton;
