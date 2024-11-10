import axios from 'axios';

// Configuração da instância axios
const api = axios.create({
  baseURL: 'http://localhost:3005/api', // URL base para o seu servidor backend
  timeout: 5000, // Tempo máximo para uma solicitação (ajustável)
  headers: {
    'Content-Type': 'application/json',
  },
});


// Função de login com a API
const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3005/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Sucesso no login, armazene o email do usuário
        setIsLoggedIn(true);
        setUserEmail(data.email); // Assume que o servidor retorna o email
        navigate('/'); // Redireciona para a página inicial
      } else {
        alert(data.message || 'Erro no login');
      }
    } catch (error) {
      alert('Erro de comunicação com o servidor');
    }
  };
  






// Função para fazer login
export const loginUser = async (email, password) => {
  try {
    // Chama a rota de login
    const response = await api.post('/users/login', { email, password });
    return response.data; // Retorna os dados do servidor (ex.: token, informações do usuário)
  } catch (error) {
    // Tratamento de erros
    console.error('Erro ao tentar logar:', error);
    throw error.response ? error.response.data : new Error('Erro de conexão com o servidor');
  }
};

// Você pode adicionar funções para outras rotas da API como exemplo:
// Função para buscar produtos
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data; // Retorna os produtos
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error.response ? error.response.data : new Error('Erro de conexão com o servidor');
  }
};

export default api;
