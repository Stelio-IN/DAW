const USER_KEY = "auth_user";

/**
 * Salva o usuário autenticado
 */
export const saveUser = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

/**
 * Retorna o usuário autenticado
 */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Retorna apenas o token
 */
export const getToken = () => {
  const user = getUser();
  return user?.token || null;
};

/**
 * Verifica se está autenticado
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Remove o usuário (logout)
 */
export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};
