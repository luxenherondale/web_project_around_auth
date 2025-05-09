import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

// Este componente verifica si el usuario está logueado
// Si lo está, renderiza el componente protegido
// Si no, redirige al usuario a la página de login

function ProtectedRoute({ element: Component, ...props }) {
  const { loggedIn } = useContext(AuthContext);

  return loggedIn ? (
    <Component {...props} />
  ) : (
    <Navigate to="/signin" replace />
  );
}

export default ProtectedRoute;
