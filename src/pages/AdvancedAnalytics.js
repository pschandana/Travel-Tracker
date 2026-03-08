import { useEffect, useState } from "react";
import API from "../services/api";

import "./AdvancedAnalytics.css";
import BottomNav from "../components/BottomNav";

import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";



function AdvancedAnalytics() {

  const [data, setData] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");



  useEffect(() => {
    fetchWeekly();
  }, []);



  // ================= FETCH WEEK =================

  const fetchWeekly = async () => {

    try {

      const res = await API.get("/weekly-analytics");
      setData(res.data);

    } catch {

      alert("Failed to load analytics");

    }
  };



  // ================= FETCH RANGE =================

  const fetchRange = async () => {

    if (!fromDate || !toDate) {
      alert("Select both dates");
      return;
    }

    try {

      const res = await API.get(
        `/range-analytics?start=${fromDate}&end=${toDate}`
      );

      setData(res.data);

    } catch {

      alert("Failed to load range analytics");

    }
  };



  // ================= DOWNLOAD =================

  const download = async () => {

    try {

      let url = "/export";

      if (fromDate && toDate) {
        url += `?start=${fromDate}&end=${toDate}`;
      }


      // Get file
      const res = await API.get(url, {
        responseType: "blob"
      });


      // WEB
      if (!Capacitor.isNativePlatform()) {

        const blob = new Blob([res.data]);

        const link = document.createElement("a");

        link.href = window.URL.createObjectURL(blob);
        link.download = "trips_report.csv";

        link.click();

        return;
      }


      // ================= MOBILE =================

      // Convert to base64
      const base64 = await blobToBase64(res.data);


      const fileName =
        `trips_${Date.now()}.csv`;


      await Filesystem.writeFile({

        path: fileName,

        data: base64,

        directory: Directory.Documents

      });


      alert("✅ File saved in Documents folder");


    } catch (err) {

      console.log(err);

      alert("Download failed");

    }
  };



  // ================= BLOB → BASE64 =================

  const blobToBase64 = (blob) => {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);

    });
  };



  if (!data) return <h3>Loading...</h3>;



  // ================= UI =================

  return (

    <div className="advanced-analytics">

      <h1>📊 Smart Analytics</h1>



      {/* DATE FILTER */}
      <div className="date-filter">

        <div>

          <label>From</label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

        </div>



        <div>

          <label>To</label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

        </div>



        <button onClick={fetchRange}>
          🔍 Apply
        </button>

        <button onClick={fetchWeekly}>
          ♻️ Reset
        </button>

      </div>



      {/* KPI */}
      <div className="kpi-grid">

        <div className="kpi blue">
          <h3>Total Trips</h3>
          <p>{data.total_trips}</p>
        </div>

        <div className="kpi green">
          <h3>Distance (km)</h3>
          <p>{data.total_distance}</p>
        </div>

        <div className="kpi purple">
          <h3>Time (min)</h3>
          <p>{data.total_time}</p>
        </div>

        <div className="kpi orange">
          <h3>Total Cost (₹)</h3>
          <p>{data.total_cost}</p>
        </div>

      </div>



      {/* MODE */}
      <div className="panel">

        <h2>🚗 Mode Breakdown</h2>

        {Object.keys(data.mode_percent).map(k => (

          <div key={k} className="mode-row">
            <span>{k}</span>
            <span>{data.mode_percent[k]}%</span>
          </div>

        ))}

      </div>



      {/* INSIGHTS */}
      <div className="panel">

        <h2>💡 Smart Insights</h2>

        {data.insights.length === 0 &&
          <p>No insights available</p>
        }

        {data.insights.map((i, idx) => (

          <div key={idx} className="insight">
            • {i}
          </div>

        ))}

      </div>



      {/* EXPORT */}
      <div className="export-box">

        <button onClick={download}>
          📥 Download Report
        </button>

      </div>



      <BottomNav />

    </div>
  );
}

export default AdvancedAnalytics;
