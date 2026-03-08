import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

import "./Login.css";


function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await API.post("/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/home");

    } catch {

      alert("❌ Invalid Credentials");

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="login-container">

      <div className="login-card">

        <h2>Welcome Back 👋</h2>

        <p className="subtitle">
          Login to continue
        </p>


        <form onSubmit={handleSubmit}>

          <input
            name="email"
            type="email"
            placeholder="📧 Email"
            onChange={handleChange}
            required
          />


          <input
            name="password"
            type="password"
            placeholder="🔒 Password"
            onChange={handleChange}
            required
          />


          <button type="submit" disabled={loading}>

            {loading ? "Logging in..." : "Login"}

          </button>

        </form>


        <p className="link">

          New user?{" "}
          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
