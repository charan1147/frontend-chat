import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading authentication, please wait...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}
