import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../services/userStorage.js";

/**
 * PrivateRoute protege rotas de usuário logado
 * Recebe `children` que é o componente da rota
 */
const PrivateRoute = ({ children }) => {
  const user = getUser();

  if (!user) {
    // Se não estiver logado, redireciona para login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
