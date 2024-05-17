import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return <Navigate to="/" />;
    }
  }

  return element;
};

export default ProtectedRoute;
