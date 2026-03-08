import { useState, useEffect, useRef } from "react";
import API from "../services/api";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import BottomNav from "../components/BottomNav";
import "./Trip.css";

import { LocalNotifications } from "@capacitor/local-notifications";
import { Geolocation } from "@capacitor/geolocation";



// ================= ICONS =================

const startIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const endIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});



// ================= AUTO CENTER =================

function AutoCenter({ position }) {

  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);

  return null;
}



// ================= MAIN =================

function Trips() {

  const [tracking, setTracking] = useState(false);
  const [saved, setSaved] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [purpose, setPurpose] = useState("");

  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);

  const [cost, setCost] = useState("");
  const [companions, setCompanions] = useState("");

  const [mode, setMode] = useState("Walk");

  const watchId = useRef(null);



  // ================= RESTORE =================

  useEffect(() => {

    const active = localStorage.getItem("trip_active");

    if (active === "true") {

      setTracking(true);

      setRoute(
        JSON.parse(localStorage.getItem("trip_route") || "[]")
      );

      setDistance(
        parseFloat(localStorage.getItem("trip_distance")) || 0
      );

      const st = localStorage.getItem("trip_start_time");

      if (st) setStartTime(new Date(st));

      startTracking();
    }

  }, []);




  // ================= DISTANCE =================

  const calcDistance = (p1, p2) => {

    const R = 6371;

    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLng = (p2.lng - p1.lng) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(p1.lat * Math.PI / 180) *
      Math.cos(p2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };




  // ================= TRACKING =================

  const startTracking = async () => {

    const perm = await Geolocation.requestPermissions();

    if (perm.location !== "granted") {
      alert("Please allow location permission");
      return;
    }


    watchId.current = await Geolocation.watchPosition(
      { enableHighAccuracy: true },

      (pos, err) => {

        if (!pos || err) return;

        const point = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };


        setRoute(prev => {

          let newDistance = distance;

          if (prev.length > 0) {

            newDistance += calcDistance(
              prev[prev.length - 1],
              point
            );

            setDistance(newDistance);

            localStorage.setItem(
              "trip_distance",
              newDistance
            );
          }


          const newRoute = [...prev, point];

          localStorage.setItem(
            "trip_route",
            JSON.stringify(newRoute)
          );

          return newRoute;
        });

      }
    );
  };




  // ================= START =================

  const startTrip = async () => {

    await LocalNotifications.schedule({
      notifications: [
        {
          title: "🚗 Trip Started",
          body: "GPS tracking started",
          id: 1
        }
      ]
    });


    const now = new Date();

    setTracking(true);
    setSaved(false);

    setStartTime(now);
    setEndTime(null);

    setRoute([]);
    setDistance(0);


    localStorage.setItem("trip_active", "true");
    localStorage.setItem("trip_start_time", now.toISOString());
    localStorage.setItem("trip_route", "[]");
    localStorage.setItem("trip_distance", "0");


    await startTracking();
  };




  // ================= STOP =================

  const stopTrip = async () => {

    if (watchId.current !== null) {

      await Geolocation.clearWatch({
        id: watchId.current
      });
    }

    setTracking(false);
    setEndTime(new Date());

    localStorage.removeItem("trip_active");
  };




  // ================= SAVE =================

  const saveTrip = async () => {

    if (route.length < 2 || !purpose) {
      alert("Please fill all details");
      return;
    }


    const start = route[0];
    const end = route.at(-1);

    const duration =
      (new Date(endTime) - new Date(startTime)) / 60000;


    await API.post("/trips", {

      start_lat: start.lat,
      start_lng: start.lng,

      end_lat: end.lat,
      end_lng: end.lng,

      start_time: startTime,
      end_time: endTime,

      distance: distance.toFixed(2),
      duration: duration.toFixed(2),

      cost,
      companions,

      mode,
      purpose,

      route
    });


    alert("🎉 Trip Saved!");

    setSaved(true);


    localStorage.removeItem("trip_route");
    localStorage.removeItem("trip_distance");
    localStorage.removeItem("trip_start_time");

    setCost("");
    setCompanions("");
    setPurpose("");
    setMode("Walk");
  };




  // ================= STATUS =================

  const getMessage = () => {

    if (saved) return "✅ Trip saved";

    if (!tracking && !endTime) return "👉 Click Start";

    if (tracking) return "📍 Tracking...";

    if (endTime) return "✍️ Save trip";

    return "";
  };




  // ================= UI =================

  return (

    <div className="trip-container">

      <h2>🚗 Smart Trip Tracker</h2>


      <div className="status-msg">
        {getMessage()}
      </div>



      <div className="control-box">

        {!tracking && !endTime && (
          <button className="btn start" onClick={startTrip}>
            ▶️ Start Trip
          </button>
        )}

        {tracking && (
          <button className="btn stop" onClick={stopTrip}>
            ⏹️ Stop Trip
          </button>
        )}

      </div>



      {route.length > 0 && (

        <div className="map-box">

          <MapContainer
            center={[route[0].lat, route[0].lng]}
            zoom={16}
            style={{ height: "300px", width: "100%" }}
          >

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            <Polyline
              positions={route.map(p => [p.lat, p.lng])}
              color="blue"
            />


            <Marker
              position={[route[0].lat, route[0].lng]}
              icon={startIcon}
            />


            <Marker
              position={[
                route.at(-1).lat,
                route.at(-1).lng
              ]}
              icon={endIcon}
            />


            <AutoCenter
              position={[
                route.at(-1).lat,
                route.at(-1).lng
              ]}
            />

          </MapContainer>

        </div>
      )}



      {/* ================= DETAILS ================= */}

      {endTime && (

        <div className="save-box">

          <h3>📝 Trip Details</h3>


          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option>Walk</option>
            <option>Bike</option>
            <option>Cycle</option>
            <option>Car</option>
            <option>Bus</option>
            <option>Auto</option>
            <option>Train</option>
          </select>


          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="">Select Purpose</option>
            <option>Work</option>
            <option>Study</option>
            <option>Leisure</option>
            <option>Shopping</option>
            <option>Travel</option>
          </select>


          <input
            placeholder="Cost (₹)"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />


          <input
            placeholder="Companions"
            value={companions}
            onChange={(e) => setCompanions(e.target.value)}
          />


          <button className="btn save" onClick={saveTrip}>
            💾 Save Trip
          </button>

        </div>
      )}


      <BottomNav />

    </div>
  );
}

export default Trips;
