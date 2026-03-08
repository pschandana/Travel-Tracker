import { useEffect, useState } from "react";
import API from "../services/api";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap
} from "react-leaflet";

import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import BottomNav from "../components/BottomNav";


import "./History.css";


// Auto fit map to route
function FitBounds({ route }) {

  const map = useMap();

  useEffect(() => {

    if (!route || route.length === 0) return;

    const bounds = L.latLngBounds(
      route.map(p => [p.lat, p.lng])
    );

    map.fitBounds(bounds, {
      padding: [30, 30]
    });

  }, [route, map]);

  return null;
}


// Custom Marker
const createIcon = (color) => {

  return L.divIcon({

    html: ReactDOMServer.renderToString(
      <FaMapMarkerAlt size={28} color={color} />
    ),

    className: "",

    iconSize: [28, 28],
    iconAnchor: [14, 28]
  });
};


const startIcon = createIcon("green");
const endIcon = createIcon("red");


function History() {

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);


  useEffect(() => {
    fetchTrips();
  }, []);


  const fetchTrips = async () => {

    try {

      const res = await API.get("/trips");
      setTrips(res.data);

    } catch {

      alert("Failed to load trips");

    }
  };


  return (
    <div className="history-container">

      <h2>📜 Trip History</h2>


      {/* MAP VIEW */}
      {selectedTrip && (

        <div className="map-modal">

          <h3>Route: {selectedTrip.trip_no}</h3>

          <MapContainer
            style={{ height: "300px", width: "100%" }}
          >

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            <Polyline
              positions={selectedTrip.route.map(p => [p.lat, p.lng])}
              color="blue"
            />


            <Marker
              position={[
                selectedTrip.route[0].lat,
                selectedTrip.route[0].lng
              ]}
              icon={startIcon}
            />


            <Marker
              position={[
                selectedTrip.route[selectedTrip.route.length - 1].lat,
                selectedTrip.route[selectedTrip.route.length - 1].lng
              ]}
              icon={endIcon}
            />


            <FitBounds route={selectedTrip.route} />

          </MapContainer>


          <button
            onClick={() => setSelectedTrip(null)}
            className="close-btn"
          >
            ❌ Close
          </button>

        </div>
      )}


      {/* TRIP CARDS */}
      {trips.map((t) => (

        <div key={t.id} className="trip-card">

          <h3>{t.trip_no}</h3>


          <div className="trip-info">

            <p>🚗 Mode: {t.mode}</p>
            <p>🎯 Purpose: {t.purpose}</p>

            <p>📏 Distance: {t.distance} km</p>
            <p>💰 Cost: ₹{t.cost}</p>

            <p>👥 Companions: {t.companions}</p>
            <p>⏱️ Duration: {t.duration} min</p>

          </div>


          <div className="trip-actions">

            <button
              className="view-btn"
              onClick={() => setSelectedTrip(t)}
            >
              🗺️ View Route
            </button>


            <button
              className="delete-btn"
              onClick={async () => {

                if (!window.confirm("Delete trip?")) return;

                await API.delete(`/trips/${t.id}`);

                fetchTrips();

              }}
            >
              🗑️ Delete
            </button>

          </div>

        </div>
      ))}
    <BottomNav />

    </div>
  );
}

export default History;
