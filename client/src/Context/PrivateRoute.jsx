import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Navigate to="/?isadmin=true" />;
};

export default PrivateRoute;
