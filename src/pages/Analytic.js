// pages/Analytic.jsx

import { Pie, Doughnut, Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import AnalystLayout from "../components/AnalystLayout";
import API from "../services/api";
import "./analytic.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

export default function Analytic() {

  const [region, setRegion] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [modeData, setModeData] = useState({});
  const [hourlyData, setHourlyData] = useState({});
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔍 Region Search
  useEffect(() => {

    if (!region) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await API.get(
          `/analyst/search-region?q=${region}`,
          { headers: { Authorization: localStorage.getItem("analystToken") } }
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(delay);

  }, [region]);

  const fetchAnalytics = async (lat = null, lng = null) => {

    setLoading(true);

    try {

      const payload = {};
      if (lat && lng) {
        payload.lat = parseFloat(lat);
        payload.lng = parseFloat(lng);
      }

      if (fromDate) payload.from_date = fromDate;
      if (toDate) payload.to_date = toDate;

      const token = localStorage.getItem("analystToken");

      const res = await API.post(
        "/analyst/analytics-data",
        payload,
        { headers: { Authorization: token } }
      );

      setModeData(res.data.mode_distribution);
      setHourlyData(res.data.hourly_distribution);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const selectRegion = (place) => {
    setRegion(place.display_name);
    setSuggestions([]);
    fetchAnalytics(place.lat, place.lon);
  };

  const totalTrips = Object.values(modeData).reduce((a,b) => a + b, 0);
  const topMode = Object.keys(modeData).length
    ? Object.keys(modeData).reduce((a,b) =>
        modeData[a] > modeData[b] ? a : b)
    : "-";

  const colors = [
    "#36A2EB",
    "#FF6384",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#00ffcc"
  ];

  const pieChart = {
    labels: Object.keys(modeData),
    datasets: [{
      data: Object.values(modeData),
      backgroundColor: colors
    }]
  };

  const barChart = {
    labels: Object.keys(modeData),
    datasets: [{
      label: "Trips",
      data: Object.values(modeData),
      backgroundColor: "#36A2EB"
    }]
  };

  const lineChart = {
    labels: Object.keys(hourlyData),
    datasets: [{
      label: "Hourly Trips",
      data: Object.values(hourlyData),
      borderColor: "#00ffcc",
      backgroundColor: "rgba(0,255,204,0.2)",
      tension: 0.4
    }]
  };

  return (
    <AnalystLayout>

      <h2 className="analytic-title">📊 Smart Analytics Dashboard</h2>

      {/* FILTER SECTION */}
      <div className="analytic-filters">

        <input
          placeholder="Search Region..."
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div className="suggestion-box">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => selectRegion(s)}
                className="suggestion-item"
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button onClick={() => fetchAnalytics()}>
          Apply Filters
        </button>

      </div>

      {loading && <p className="analytic-loading">Loading analytics...</p>}

      {!loading && (
        <div className="analytic-container">

          {/* KPI */}
          <div className="analytic-kpi">
            <div className="kpi-card">
              <h4>Total Trips</h4>
              <p>{totalTrips}</p>
            </div>
            <div className="kpi-card">
              <h4>Top Mode</h4>
              <p>{topMode}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="analytic-grid">

            <div className="chart-card">
              <h4>Mode Share (Pie)</h4>
              <Pie data={pieChart} />
            </div>

            <div className="chart-card">
              <h4>Mode Comparison</h4>
              <Bar data={barChart} />
            </div>

            <div className="chart-card">
              <h4>Hourly Trend</h4>
              <Line data={lineChart} />
            </div>

          </div>

        </div>
      )}

    </AnalystLayout>
  );
}