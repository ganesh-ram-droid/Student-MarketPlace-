import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContextCore";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
