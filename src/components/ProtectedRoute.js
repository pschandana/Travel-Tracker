import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");
  const location = useLocation();

  // Not logged in → go to login
  if (!token) {

    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Logged in → allow
  return children;
}

export default ProtectedRoute;
