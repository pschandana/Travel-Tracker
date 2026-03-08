import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";

function BottomNav() {

  const navigate = useNavigate();
  const location = useLocation();


  return (

    <div className="bottom-nav">


      <NavItem icon="🏠" text="Home" path="/home" />
      <NavItem icon="🚗" text="Trip" path="/trips" />
      <NavItem icon="📜" text="History" path="/history" />
      <NavItem icon="📊" text="Stats" path="/analytics-advanced" />
      <NavItem icon="👤" text="Profile" path="/profile" />


    </div>
  );
}



function NavItem({ icon, text, path }) {

  const navigate = useNavigate();
  const location = useLocation();

  const active = location.pathname === path;


  return (

    <div
      className={`nav-item ${active ? "active" : ""}`}
      onClick={() => navigate(path, { replace: true })}
    >

      <div className="nav-icon">{icon}</div>

      <span>{text}</span>

    </div>
  );
}


export default BottomNav;
