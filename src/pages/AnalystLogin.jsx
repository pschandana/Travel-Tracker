// pages/AnalystLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import axios from "axios";
import "./analystLogin.css";

export default function AnalystLogin() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      setLoading(true);
      const res = await API.post("/analyst/login", {
        email,
        password
      });
      localStorage.setItem("analystToken", res.data.token);
      navigate("/analyst/dashboard");

    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">
        <h2>📊 Analyst Login</h2>

        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={login}>
          {loading ? "Authenticating..." : "Login"}
        </button>
      </div>

    </div>
  );
}
