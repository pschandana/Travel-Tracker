import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import "./Analytics.css";


function Analytics() {

  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);


  useEffect(() => {
    fetchData();
    fetchSummary();
  }, []);


  const fetchData = async () => {
    try {
      const res = await API.get("/analytics");
      setData(res.data);
    } catch {
      alert("Failed to load analytics");
    }
  };


  const fetchSummary = async () => {
    try {
      const res = await API.get("/weekly-analytics");
      setSummary(res.data);
    } catch {
      alert("Failed to load summary");
    }
  };


  if (!summary) return <h3>Loading...</h3>;


  // Mode data for pie
  const modeData = Object.keys(summary.mode_percent).map(k => ({
    name: k,
    value: summary.mode_percent[k]
  }));


  const COLORS = [
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#9c27b0",
    "#f44336",
    "#00bcd4"
  ];


  return (
    <div className="analytics">

      <h1>📊 Analytics Dashboard</h1>


      {/* KPI CARDS */}
      <div className="kpi-grid">

        <div className="kpi blue">
          <h3>Total Trips</h3>
          <p>{summary.total_trips}</p>
        </div>

        <div className="kpi green">
          <h3>Distance (km)</h3>
          <p>{summary.total_distance}</p>
        </div>

        <div className="kpi orange">
          <h3>Cost (₹)</h3>
          <p>{summary.total_cost}</p>
        </div>

        <div className="kpi purple">
          <h3>Time (min)</h3>
          <p>{summary.total_time}</p>
        </div>

      </div>


      {/* CHARTS GRID */}
      <div className="charts-grid">


        {/* Trips Trend */}
        <div className="chart-card">

          <h3>📈 Trips Trend</h3>

          <ResponsiveContainer width="100%" height={250}>

            <LineChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />
              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="trips"
                stroke="#2196f3"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>


        {/* Distance Bar */}
        <div className="chart-card">

          <h3>📊 Distance by Month</h3>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />
              <YAxis />

              <Tooltip />

              <Bar
                dataKey="distance"
                fill="#4caf50"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* Cost Bar */}
        <div className="chart-card">

          <h3>💰 Cost Analysis</h3>

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />
              <YAxis />

              <Tooltip />

              <Bar
                dataKey="cost"
                fill="#ff9800"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>


        {/* Mode Pie */}
        <div className="chart-card">

          <h3>🚗 Mode Distribution</h3>

          <ResponsiveContainer width="100%" height={250}>

            <PieChart>

              <Pie
                data={modeData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >

                {modeData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* INSIGHTS */}
      <div className="insights">

        <h3>💡 Smart Insights</h3>

        {summary.insights.length === 0 &&
          <p>No insights yet</p>
        }

        {summary.insights.map((i, idx) => (
          <p key={idx}>• {i}</p>
        ))}

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


export default Analytics;
