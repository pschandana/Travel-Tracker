// components/BottomNav.jsx

import { NavLink, useNavigate } from "react-router-dom";
import "./Bottom.css"


export default function BottomNav() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("analystToken");
    navigate("/");
  };

  return (
    <div className="bottom-nav">

<NavLink to="/analyst/dashboard">🏠</NavLink>
<NavLink to="/analyst/heatmap">🔥</NavLink>
<NavLink to="/analyst/peak-hour">⏱</NavLink>
<NavLink to="/analyst/analytic">📊</NavLink>
<NavLink to="/analyst/ai">🤖</NavLink>


      <button onClick={logout}>🚪</button>

    </div>
  );
}