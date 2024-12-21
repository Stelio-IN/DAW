import React, { useEffect, useState } from 'react';

const PayPalButton = ({ totalMZN }) => {
  const [totalUSD, setTotalUSD] = useState(0);

  useEffect(() => {
    // Obter a taxa de câmbio de MZN para USD
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          'https://open.er-api.com/v6/latest/MZN' // URL da API de exemplo
        );
        const data = await response.json();
        const exchangeRate = data.rates.USD; // Taxa de câmbio de MZN para USD
        setTotalUSD((totalMZN * exchangeRate).toFixed(2)); // Calcula o valor em USD com 2 casas decimais
      } catch (error) {
        console.error('Erro ao obter a taxa de câmbio:', error);
      }
    };

    fetchExchangeRate();
  }, [totalMZN]); // Reexecuta quando o total em MZN mudar

  useEffect(() => {
    if (totalUSD > 0) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: totalUSD, // Usa o valor convertido
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert(`Pagamento concluído por ${details.payer.name.given_name}`);
          });
        },
        onError: (err) => {
          console.error('Erro no PayPal:', err);
        },
      }).render('#paypal-button-container');
    }
  }, [totalUSD]); // Reexecuta o botão PayPal quando totalUSD mudar

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
