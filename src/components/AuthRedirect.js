import { Navigate } from "react-router-dom";

function AuthRedirect({ children }) {

  const token = localStorage.getItem("token");

  // If logged in → never allow auth pages
  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default AuthRedirect;
