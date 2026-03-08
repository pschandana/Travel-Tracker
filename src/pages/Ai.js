// pages/AI.jsx

import { useState, useEffect } from "react";
import AnalystLayout from "../components/AnalystLayout";
import API from "../services/api";
import "./ai.css";

export default function AI() {

  const [region, setRegion] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  const selectRegion = async (place) => {

    setSelectedLocation(place);
    setRegion(place.display_name);
    setSuggestions([]);
    setLoading(true);
    setData(null);

    try {

      const payload = {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon)
      };

      if (date) payload.date = date;

      const res = await API.post(
        "/analyst/ai-insights",
        payload,
        { headers: { Authorization: localStorage.getItem("analystToken") } }
      );

      setData(res.data);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const retrain = async () => {

    setLoading(true);

    try {
      await API.post(
        "/analyst/ai-retrain",
        {},
        { headers: { Authorization: localStorage.getItem("analystToken") } }
      );

      if (selectedLocation) {
        selectRegion(selectedLocation);
      }

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <AnalystLayout>

      <h2 className="ai-title">🤖 Smart City LSTM Intelligence Engine</h2>

      {/* REGION SEARCH */}
      <div className="ai-search-box">

        <input
          value={region}
          placeholder="Search City / Region..."
          onChange={(e) => setRegion(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div className="ai-suggestion-box">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="ai-suggestion-item"
                onClick={() => selectRegion(s)}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* DATE FILTER */}
      <div className="ai-date-filter">
        <label>Filter by Date (Optional)</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* RETRAIN BUTTON */}
      <div className="ai-action-row">
        <button className="ai-retrain-btn" onClick={retrain}>
          🔁 Retrain AI Model
        </button>
      </div>

      {loading && (
        <div className="ai-loading">
          Running AI Intelligence...
        </div>
      )}

      {data && !loading && (

        <>
          <div className="ai-dashboard">

            <div className="ai-card big-score">
              <h3>Congestion Score</h3>
              <div className="score-value">
                {data.congestion_score}
              </div>
            </div>

            <div className="ai-card">
              <h3>Risk Level</h3>
              <p className={`risk-${data.risk_level.toLowerCase()}`}>
                {data.risk_level}
              </p>
            </div>

            <div className="ai-card">
              <h3>Predicted Next Hour</h3>
              <p>{data.predicted_next_hour_traffic || 0}</p>
            </div>

            <div className="ai-card">
              <h3>Model Accuracy (RMSE)</h3>
              <p>{data.model_accuracy_rmse}</p>
            </div>

            <div className="ai-card">
              <h3>CO₂ Emission</h3>
              <p>{data.co2_emission} kg</p>
            </div>

            <div className="ai-card">
              <h3>Average Distance</h3>
              <p>{data.avg_distance} km</p>
            </div>

          </div>

          {/* 🔥 AI RECOMMENDATION PANEL */}
          <div className="ai-recommendation">
            <h3>🧠 AI Recommendation</h3>
            <p>{data.recommendation}</p>
          </div>

          {/* MODE DISTRIBUTION */}
          {data.mode_distribution && (
            <div className="ai-card full-width">
              <h3>🚗 Mode Distribution</h3>

              {Object.entries(data.mode_distribution).map(([mode, count], i) => {

                const total = Object.values(data.mode_distribution)
                  .reduce((a, b) => a + b, 0);

                const percent =
                  total > 0
                    ? ((count / total) * 100).toFixed(1)
                    : 0;

                return (
                  <div key={i} className="mode-bar-wrapper">

                    <div className="mode-label">
                      <span>{mode}</span>
                      <span>{percent}%</span>
                    </div>

                    <div className="mode-bar-bg">
                      <div
                        className="mode-bar-fill"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </>
      )}

    </AnalystLayout>
  );
}