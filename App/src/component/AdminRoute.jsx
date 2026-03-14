import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../services/userStorage.js";

/**
 * AdminRoute protege rotas de admin
 */
const AdminRoute = ({ children }) => {
  const user = getUser();

  if (!user || !user.isAdmin) {
    // Se não estiver logado ou não for admin, redireciona para login ou home
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
