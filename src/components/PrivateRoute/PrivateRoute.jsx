import { Navigate } from "react-router-dom";

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken"); 

  if (isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
