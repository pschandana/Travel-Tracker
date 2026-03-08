import {
    MapContainer,
    TileLayer,
    useMap,
    CircleMarker
  } from "react-leaflet";
  import { useEffect, useState, useRef } from "react";
  import L from "leaflet";
  import "leaflet.heat";
  import AnalystLayout from "../components/AnalystLayout";
  import API from "../services/api";
  import "./heatmap.css";
  
  function HeatLayer({ points, enabled }) {
    const map = useMap();
    const heatRef = useRef(null);
  
    useEffect(() => {
      if (!enabled || !points || points.length === 0) return;
  
      const heatPoints = points.map(p => [
        p.lat,
        p.lng,
        p.intensity * 8 // 🔥 Boost visibility
      ]);
  
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
      }
      heatRef.current = L.heatLayer(heatPoints, {
        radius: 60,          // 🔥 Larger spread
        blur: 50,            // 🔥 More smooth blending
        maxZoom: 17,
        minOpacity: 0.4,     // 🔥 Makes base glow visible
        max: 8,              // 🔥 Better scaling for small dataset
        gradient: {
          0.0: "#0000ff",     // deep blue
          0.2: "#00ffff",     // cyan
          0.4: "#00ff00",     // green
          0.6: "#ffff00",     // yellow
          0.8: "#ff8000",     // orange
          1.0: "#ff0000"      // strong red center
        }
      }).addTo(map);
  
    }, [points, enabled, map]);
  
    return null;
  }
  
  function FlyToLocation({ center }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo(center, 12, { duration: 1.5 });
    }, [center, map]);
    return null;
  }
  
  export default function Heatmap() {
  
    const [data, setData] = useState([]);
    const [modes, setModes] = useState({});
    const [region, setRegion] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [center, setCenter] = useState([12.97, 77.59]);
    const [radius, setRadius] = useState(5);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("both"); // heat | points | both
    const [hotspot, setHotspot] = useState(null);
  
    useEffect(() => {
      if (!region) return;
  
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
  
      const lat = parseFloat(place.lat);
      const lng = parseFloat(place.lon);
  
      setCenter([lat, lng]);
      setRegion(place.display_name);
      setSuggestions([]);
      setLoading(true);
  
      try {
        const res = await API.post(
          "/analyst/heatmap",
          { lat, lng, radius },
          { headers: { Authorization: localStorage.getItem("analystToken") } }
        );
  
        setData(res.data.heat_points);
        setModes(res.data.top_modes);
  
        if (res.data.heat_points.length > 0) {
          const maxPoint = res.data.heat_points.reduce((a, b) =>
            a.intensity > b.intensity ? a : b
          );
          setHotspot(maxPoint);
        }
  
      } catch (err) {
        console.error(err);
      }
  
      setLoading(false);
    };
  
    const totalModes = Object.values(modes).reduce((a, b) => a + b, 0);
  
    return (
      <AnalystLayout>
  
        {/* 🔘 Toggle */}
        <div className="toggle-container">
          <button onClick={() => setViewMode("heat")}>🔥 Heat</button>
          <button onClick={() => setViewMode("points")}>📍 Points</button>
          <button onClick={() => setViewMode("both")}>🔀 Both</button>
        </div>
  
        {/* 🔥 Region Search */}
        <div className="region-filter">
          <input
            value={region}
            placeholder="Search City / Region..."
            onChange={(e) => setRegion(e.target.value)}
          />
  
          {suggestions.length > 0 && (
            <div className="suggestion-box">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="suggestion"
                  onClick={() => selectRegion(s)}
                >
                  {s.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* 🔥 Radius Slider */}
        <div className="radius-slider">
          <label>Search Radius: {radius} km</label>
          <input
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
        </div>
  
        {/* 🔥 MAP */}
        <div className="map-wrapper">
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: "55vh", borderRadius: "15px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
  
            <FlyToLocation center={center} />
  
            <HeatLayer
              points={data}
              enabled={viewMode !== "points"}
            />
  
            {(viewMode === "points" || viewMode === "both") &&
              data.map((p, i) => (
                <CircleMarker
                  key={i}
                  center={[p.lat, p.lng]}
                  radius={6}
                  pathOptions={{
                    color: "#ff0000",
                    fillColor: "#ff0000",
                    fillOpacity: 0.8
                  }}
                />
              ))}
  
            {hotspot && (
              <CircleMarker
                center={[hotspot.lat, hotspot.lng]}
                radius={14}
                className="pulse-marker"
              />
            )}
  
          </MapContainer>
  
          <div className="legend">
            <span>Low</span>
            <div className="legend-bar"></div>
            <span>High</span>
          </div>
        </div>
  
        {/* 🔥 MODE PANEL */}
        <div className="mode-panel">
          <h3>🚗 Traffic Contributing Modes</h3>
  
          {loading && <p>Loading traffic data...</p>}
  
          {!loading && totalModes === 0 && (
            <p>No traffic data available</p>
          )}
  
          {!loading && totalModes > 0 &&
            Object.entries(modes).map(([mode, count], i) => {
  
              const percent = ((count / totalModes) * 100).toFixed(1);
  
              return (
                <div key={i} className="mode-item">
                  <div className="mode-label">
                    <span>{mode}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="mode-bar">
                    <div
                      className="mode-fill"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
  
      </AnalystLayout>
    );
  }