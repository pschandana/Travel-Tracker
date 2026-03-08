import { useEffect, useState } from "react";
import axios from "axios";
import API from "../services/api";
import AnalystLayout from "../components/AnalystLayout";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Simulation() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSimulation = async () => {
    try {
      const res = await API.get("/analyst/simulation", {
        headers: { Authorization: localStorage.getItem("analystToken") }
      });
      setData(res.data);
    } catch (err) {
      console.error("Simulation fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulation();
  }, []);

  if (loading) {
    return (
      <AnalystLayout>
        <div className="loader">Running Smart City Simulation...</div>
      </AnalystLayout>
    );
  }

  if (!data) return null;

  const chartData = {
    labels: ["Current Trips", "Projected Trips"],
    datasets: [
      {
        label: "Traffic Projection",
        data: [
          data.projected_trips / 1.18,
          data.projected_trips
        ]
      }
    ]
  };

  return (
    <AnalystLayout>

      <h2>🏙 Smart City Simulation Engine</h2>

      <div className="simulation-grid">

        <div className="sim-card growth">
          <h3>📈 Projected Trips</h3>
          <p>{Math.round(data.projected_trips)}</p>
        </div>

        <div className="sim-card co2">
          <h3>🌫 CO₂ Projection</h3>
          <p>{data.co2_projection.toFixed(2)} Tons</p>
        </div>

      </div>

      {/* Projection Chart */}
      <div className="chart-container">
        <Bar data={chartData} />
      </div>

      {/* Policy Panel */}
      <div className="policy-panel">
        <h3>🧠 AI Policy Recommendation</h3>
        <p>{data.policy_recommendation}</p>
      </div>

      {/* Manual Re-run */}
      <button className="simulate-btn" onClick={fetchSimulation}>
        🔄 Re-run Simulation
      </button>

    </AnalystLayout>
  );
}