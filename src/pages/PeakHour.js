// pages/PeakHour.jsx

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import AnalystLayout from "../components/AnalystLayout";
import API from "../services/api";
import "./peakhour.css";

// 🔥 FIX LEAFLET ICON
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FlyToLocation({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function PeakHour() {

  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const [center, setCenter] = useState([12.97, 77.59]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // 🔥 REGION SEARCH
  useEffect(() => {

    if (!city) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await API.get(
          `/analyst/search-region?q=${city}`,
          { headers: { Authorization: localStorage.getItem("analystToken") } }
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(delay);

  }, [city]);

  const selectCity = async (place) => {

    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);

    setCenter([lat, lng]);
    setSuggestions([]);
    setCity(place.display_name);

    setLoading(true);
    setResult(null); // 🔥 CLEAR OLD RESULT

    try {

      const payload = { lat, lng };

      if (selectedDate && selectedDate.trim() !== "") {
        payload.date = selectedDate;
      }

      const res = await API.post(
        "/analyst/peak-hour",
        payload,
        { headers: { Authorization: localStorage.getItem("analystToken") } }
      );

      console.log("API RESULT:", res.data);

      // 🔥 FORCE SAFE RESULT
      if (res.data) {
        setResult({
          peak_hour: res.data.peak_hour,
          trip_count: res.data.trip_count,
          modes: res.data.modes || {}
        });
      }

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <AnalystLayout>

      <h2 className="peak-title">⏱ Peak Hour Intelligence</h2>

      {/* 🔍 Search */}
      <div className="peak-search">
        <input
          placeholder="Search City / Region..."
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        {suggestions.length > 0 && (
          <div className="peak-suggestions">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => selectCity(s)}
                className="peak-suggestion-item"
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📅 Date Filter */}
      <div className="date-filter">
        <label>Select Date (Optional)</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* 🗺 Map */}
      <div className="peak-map-wrapper">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: "40vh", borderRadius: "15px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyToLocation center={center} />
          <Marker position={center} />
        </MapContainer>
      </div>

      {/* 🔄 Loading */}
      {loading && (
        <p className="loading-text">
          Analyzing traffic data...
        </p>
      )}

      {/* 📊 RESULT */}
      {!loading && result && (

        <div className="peak-result-card">

          <div className="peak-hour-box">
            <h3>Peak Hour</h3>
            <span>
              {result.peak_hour !== null
                ? `${result.peak_hour}:00`
                : "No Data"}
            </span>
          </div>

          <div className="trip-count-box">
            <h3>Total Trips (Peak Hour)</h3>
            <span>{result.trip_count}</span>
          </div>

          {/* 🚗 Modes */}
          {result.modes && Object.keys(result.modes).length > 0 && (

            <div className="mode-section">
              <h4>🚦 Traffic Contributing Modes</h4>

              {(() => {

                const total =
                  Object.values(result.modes)
                    .reduce((a, b) => a + b, 0);

                return Object.entries(result.modes)
                  .map(([mode, count], i) => {

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
                          />
                        </div>

                      </div>
                    );
                  });

              })()}

            </div>
          )}

        </div>
      )}

    </AnalystLayout>
  );
}