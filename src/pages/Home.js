import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import API from "../services/api";
import DarkToggle from "../components/DarkToggle";

import "./Home.css";


function Home() {

  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  /* Load Dashboard */
  useEffect(() => {
    fetchDashboard();
  }, []);


  const fetchDashboard = async () => {

    try {

      const res = await API.get("/dashboard");
      setData(res.data);

    } catch (err) {

      console.error(err);
      alert("Failed to load dashboard");

    } finally {

      setLoading(false);
    }
  };


  /* Logout */
 const logout = () => {

  localStorage.removeItem("token");

  navigate("/login", { replace: true });
};


  if (loading) {
    return <div className="loader">Loading...</div>;
  }


  if (!data) {
    return <div className="loader">No Data</div>;
  }


  return (
    <div className="home">


      {/* ================= HEADER ================= */}
      <div className="home-header">

        <div className="header-left">

          <h1>Hello 👋</h1>
          <p>Welcome back</p>

        </div>


        <div className="header-actions">

          {/* Dark Mode */}
          <DarkToggle />

          {/* Logout */}
          <button
            onClick={logout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

      </div>



      {/* ================= DASHBOARD ================= */}
      <div className="dashboard">


        <div className="card blue">
          <span>Total Trips</span>
          <h2>{data.total_trips}</h2>
        </div>


        <div className="card green">
          <span>Distance</span>
          <h2>{data.total_distance} km</h2>
        </div>


        <div className="card orange">
          <span>Total Cost</span>
          <h2>₹ {data.total_cost}</h2>
        </div>


        <div className="card purple">
          <span>Top Mode</span>
          <h2>{data.top_mode || "N/A"}</h2>
        </div>


        <div className="card teal wide">
          <span>Most Travelled Area</span>
          <h2>{data.most_travelled_area || "N/A"}</h2>
        </div>


        <div className="card red wide">
          <span>Least Travelled Area</span>
          <h2>{data.least_travelled_area || "N/A"}</h2>
        </div>


        {/* Analytics */}
        <div
          className="card analytics"
          onClick={() => navigate("/analytics")}
        >
          <span>Analytics</span>
          <h2>📊 View</h2>
        </div>


        {/* Smart Analytics */}
        <div
          className="card smart"
          onClick={() => navigate("/analytics-advanced")}
        >
          <span>Smart Stats</span>
          <h2>🤖 AI</h2>
        </div>


      </div>



      {/* ================= BOTTOM NAV ================= */}
      <div className="bottom-nav">


        <NavItem
          icon="🏠"
          text="Home"
          path="/home"
          navigate={navigate}
          location={location}
        />


        <NavItem
          icon="🚗"
          text="Trip"
          path="/trips"
          navigate={navigate}
          location={location}
        />


        <NavItem
          icon="📜"
          text="History"
          path="/history"
          navigate={navigate}
          location={location}
        />


        <NavItem
          icon="📊"
          text="Stats"
          path="/analytics-advanced"
          navigate={navigate}
          location={location}
        />


        <NavItem
          icon="👤"
          text="Profile"
          path="/profile"
          navigate={navigate}
          location={location}
        />


      </div>

    </div>
  );
}



/* ================= NAV ITEM ================= */
function NavItem({ icon, text, path, navigate, location }) {

  const active = location.pathname === path;


  return (

    <div
      className={`nav-item ${active ? "active" : ""}`}
      onClick={() => navigate(path, { replace: true })}

    >

      <div className="nav-icon">
        {icon}
      </div>

      <span>
        {text}
      </span>

    </div>
  );
}


export default Home;
