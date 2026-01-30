import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading authentication, please wait...</div>;
  }

  return user ? <Navigate to="/contacts" replace /> : children;
}
