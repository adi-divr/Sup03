import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // If user is not authenticated, redirect to login
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
