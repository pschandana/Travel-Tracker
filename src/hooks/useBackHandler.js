import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


function useBackHandler() {

  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {

    const token = localStorage.getItem("token");

    const handleBack = () => {

      if (!token) return;

      const path = location.pathname;

      // If already home → exit (handled by capacitor)
      if (path === "/home") return;

      // From any page → go home
      navigate("/home", { replace: true });

    };


    window.addEventListener("popstate", handleBack);


    return () => {
      window.removeEventListener("popstate", handleBack);
    };

  }, [location, navigate]);

}


export default useBackHandler;
