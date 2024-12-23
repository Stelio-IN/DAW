import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Importe o PropTypes

const PayPalButton = ({ totalMZN, setCart }) => {

 // Verifique se setCart é uma função
 useEffect(() => {
  console.log("setCart é uma função? ", typeof setCart === "function"); // Verifica o tipo de setCart
}, [setCart]);

  const [totalUSD, setTotalUSD] = useState(0);
  const [paypalReady, setPaypalReady] = useState(false);

  // Função para carregar o script do PayPal
  const loadPayPalScript = () => {
    return new Promise((resolve, reject) => {
      if (window.paypal) {
        return resolve(window.paypal);
      }

      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AeqHhzKjUTSwvliDMKisOV8up3ylSUw7uNGESVORC0DJxIHz9ZmC0Atg7cFIM-ihdtscWCuREUweiBJi"; // Substitua com seu Client ID do PayPal
      script.async = true;
      script.onload = () => resolve(window.paypal);
      script.onerror = () => reject(new Error("Failed to load PayPal script"));

      document.body.appendChild(script);
    });
  };

  // Verifica se o PayPal foi carregado
  useEffect(() => {
    loadPayPalScript()
      .then(() => setPaypalReady(true))
      .catch((error) => console.error("Erro ao carregar o script do PayPal:", error));
  }, []);

  // Converte o valor de MZN para USD
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/MZN");
        const data = await response.json();
        const exchangeRate = data.rates.USD; // Taxa de câmbio de MZN para USD
        setTotalUSD((totalMZN * exchangeRate).toFixed(2)); // Calcula o valor em USD com 2 casas decimais
      } catch (error) {
        console.error("Erro ao obter a taxa de câmbio:", error);
      }
    };

    fetchExchangeRate();
  }, [totalMZN]); // Reexecuta quando o total em MZN mudar

  // Configuração do botão PayPal
  useEffect(() => {
    if (paypalReady && totalUSD > 0) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: totalUSD, // Usa o valor convertido
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          try {
            const details = await actions.order.capture();
            console.log("Detalhes da transação:", details);
            const products = JSON.parse(localStorage.getItem("cart"));
            setCart([]); // Limpa o carrinho

            // Produtos do carrinho
            const userID = 1; // ID do usuário autenticado (ajuste conforme necessário)
            const enderecoEntrega = "Rua Exemplo, 123, Cidade, País"; // Exemplo de endereço

            // Envia os dados para o backend
            const response = await fetch("http://localhost:3005/api/payments/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderID: data.orderID,
                userID,
                products: products.map((product) => ({
                  id: product.id,
                  name: product.name,
                  quantity: product.quantity,
                  price: product.price,
                })),
                enderecoEntrega,
              }),
            });
            console.log("Resposta do PayPal:", response); // resposta do paypal
            const result = await response.json();
            if (response.ok) {
              localStorage.removeItem("cart"); // Esvazia o carrinho
              setCart([]); // Atualiza o estado do carrinho
              alert("Compra concluída com sucesso!");
            } else {
              alert(`Erro: ${result.error}`);
            }
          } catch (error) {
            console.error("Erro ao capturar a ordem:", error);
            console.error("Detalhes do erro:", error.response?.data || error.message);
            alert("Erro ao processar o pagamento.");
          }
        },
        onError: (err) => {
          console.error("Erro no PayPal:", err);
        },
      }).render("#paypal-button-container");
    }
  }, [paypalReady, totalUSD, setCart]); // Reexecuta o botão PayPal quando totalUSD mudar ou PayPal estiver pronto

  return <div id="paypal-button-container"></div>;
};

// Validação das props com PropTypes
PayPalButton.propTypes = {
  totalMZN: PropTypes.number.isRequired, // totalMZN deve ser um número obrigatório
  setCart: PropTypes.func.isRequired, // setCart deve ser uma função obrigatória
};

export default PayPalButton;
