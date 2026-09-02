import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

const Routes = ({ children }) => {
  const { pathname } = useLocation();

  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const { cartitems } = useSelector((state) => state.cart);

  if (
    isAuthenticated &&
    role === "user" &&
    (pathname.startsWith("/dashboard") || pathname === "/adminlogin")
  ) {
    return <Navigate to="/" />;
  }

  // Dashboard ko लागि Admin authentication र role check
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    if (role !== "admin") {
      return <Navigate to="/" />;
    }
  }

  if (
    isAuthenticated &&
    role === "user" &&
    (pathname === "/Login" || pathname === "/signup")
  ) {
    return <Navigate to="/" />;
  }

  if (!isAuthenticated && pathname === "/order") {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && cartitems.length === 0 && pathname === "/checkout") {
    return <Navigate to="/" />;
  }
  if (!isAuthenticated && cartitems.length === 0 && pathname === "/checkout") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Routes;
