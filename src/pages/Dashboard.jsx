// pages/Dashboard.jsx

import { useEffect, useState } from "react";
import AnalystLayout from "../components/AnalystLayout";
import API from "../services/api";
import "./dashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {

  const [data, setData] = useState(null);
  const [time, setTime] = useState(new Date());

  const fetchDashboard = () => {
    API.get("/analyst/dashboard", {
      headers: {
        Authorization: localStorage.getItem("analystToken")
      }
    })
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    const clock = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clock);
    };
  }, []);

  if (!data) {
    return (
      <AnalystLayout>
        <div className="dashboard-loading">
          Initializing Smart City Analytics...
        </div>
      </AnalystLayout>
    );
  }

  // Fake small trend preview (until backend gives time-series)
  const tripTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Trips",
        data: [
          data.total_trips * 0.7,
          data.total_trips * 0.75,
          data.total_trips * 0.8,
          data.total_trips * 0.85,
          data.total_trips * 0.9,
          data.total_trips
        ],
        borderColor: "#36A2EB",
        tension: 0.4
      }
    ]
  };

  const revenueDistanceData = {
    labels: ["Revenue", "Distance"],
    datasets: [
      {
        label: "Comparison",
        data: [data.total_cost, data.total_distance],
        backgroundColor: ["#FF6384", "#4BC0C0"]
      }
    ]
  };

  const congestionLevel =
    data.total_trips > 500 ? "High" :
    data.total_trips > 200 ? "Moderate" :
    "Low";

  return (
    <AnalystLayout>

      <div className="dashboard-header">
        <h2>🚦 Smart City Analytics Board</h2>
        <span>{time.toLocaleTimeString()}</span>
      </div>

      {/* ================= KPI CARDS ================= */}

      <div className="dashboard-grid">

        <div className="kpi-card trips">
          <h3>Total Trips</h3>
          <p>{data.total_trips}</p>
        </div>

        <div className="kpi-card distance">
          <h3>Total Distance</h3>
          <p>{data.total_distance} km</p>
        </div>

        <div className="kpi-card revenue">
          <h3>Total Revenue</h3>
          <p>₹ {data.total_cost}</p>
        </div>

        <div className="kpi-card duration">
          <h3>Avg Duration</h3>
          <p>{data.avg_duration} mins</p>
        </div>

      </div>

      {/* ================= CONGESTION STATUS ================= */}

      <div className={`congestion-box ${congestionLevel.toLowerCase()}`}>
        🚥 Congestion Level: <strong>{congestionLevel}</strong>
      </div>

      {/* ================= MINI TREND ================= */}

      <div className="chart-section">
        <h3>Weekly Trip Trend</h3>
        <Line data={tripTrendData} />
      </div>

      {/* ================= REVENUE VS DISTANCE ================= */}

      <div className="chart-section">
        <h3>Revenue vs Distance</h3>
        <Bar data={revenueDistanceData} />
      </div>

      {/* ================= AI SUMMARY ================= */}

      <div className="ai-summary">
        <h3>🤖 AI System Insight</h3>
        <p>
          Based on current mobility patterns, congestion appears
          <strong> {congestionLevel} </strong>.
          Consider optimizing public transport and adaptive signal control.
        </p>
      </div>

    </AnalystLayout>
  );
}