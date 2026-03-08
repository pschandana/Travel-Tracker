import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome() {

  const navigate = useNavigate();

  return (

    <div className="welcome-container">


      {/* TOP */}
      <div className="top-section">

        <h1>🚗 Smart Trip Tracker</h1>

        <p className="tagline">
          Your Travel. Your Data. Your Control.
        </p>

      </div>


      {/* AUTO SCROLL BAR */}
      <div className="scroll-box">

        <div className="scroll-text">

          📍 Live Tracking • 🗺 Route History • 📊 Analytics (Coming Soon) • 
          🤖 AI Insights (Coming Soon) • 🔔 Notifications • 🚀 Faster Travel • 
          📍 Live Tracking • 🗺 Route History • 📊 Analytics (Coming Soon)

        </div>

      </div>


      {/* FEATURES */}
      <div className="features-section">

        <div className="feature">
          📍 Live Tracking
        </div>

        <div className="feature">
          🗺 Route History
        </div>

        <div className="feature">
          📊 Analytics
          <span></span>
        </div>

        <div className="feature">
          🤖 Smart AI
          <span>Coming Soon</span>
        </div>

      </div>


      {/* LOGIN / REGISTER */}
      <div className="login-section">


        <button
          className="btn user-btn"
          onClick={() => navigate("/login")}
        >
          🔐 User Login
        </button>


        <button
          className="btn register-btn"
          onClick={() => navigate("/register")}
        >
          ✍️ Register
        </button>


        <button
  className="btn analyst-btn"
  onClick={() => navigate("/analyst/login")}
>
  📊 Analyst Login
</button>


      </div>


      {/* FOOTER */}
      <div className="footer">

        Track smarter. Travel better 💙

      </div>

    </div>
  );
}

export default Welcome;
