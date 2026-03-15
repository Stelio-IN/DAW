const MPESA_API_URL = 'http://localhost:3005/api/mpesa/pay';

export const payWithMpesa = async ({ amount, phoneNumber }) => {
  const response = await fetch(MPESA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      phoneNumber,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data?.success) {
    const error = new Error(data?.message || 'Erro ao processar pagamento M-Pesa');
    error.details = data;
    throw error;
  }

  return data;
};