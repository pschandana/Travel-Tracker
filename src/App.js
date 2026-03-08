import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import Welcome from "./pages/Welcome";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";

import useBackHandler from "./hooks/useBackHandler";

// 🔥 Analyst Pages
import AnalystLogin from "./pages/AnalystLogin";
import Dashboard from "./pages/Dashboard";
import Heatmap from "./pages/HeatMap";
import PeakHour from "./pages/PeakHour";
import Analytic from "./pages/Analytic";   // ✅ renamed
import AI from "./pages/Ai";
import Simulation from "./pages/Simulation";



// ===============================
// 🔐 Analyst Protected Route
// ===============================

function AnalystProtectedRoute({ children }) {

  const token = localStorage.getItem("analystToken");

  if (!token) {
    return <Navigate to="/analyst/login" replace />;
  }

  return children;
}



// ===============================
// 🔥 Router Wrapper
// ===============================

function RouterWrapper() {

  useBackHandler();

  return (

    <Routes>

      {/* ================= USER AUTH ================= */}

      <Route
        path="/"
        element={
          <AuthRedirect>
            <Welcome />
          </AuthRedirect>
        }
      />

      <Route
        path="/login"
        element={
          <AuthRedirect>
            <Login />
          </AuthRedirect>
        }
      />

      <Route
        path="/register"
        element={
          <AuthRedirect>
            <Register />
          </AuthRedirect>
        }
      />



      {/* ================= USER PROTECTED ================= */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trips"
        element={
          <ProtectedRoute>
            <Trips />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics-advanced"
        element={
          <ProtectedRoute>
            <AdvancedAnalytics />
          </ProtectedRoute>
        }
      />



      {/* =================================================== */}
      {/* ================= ANALYST SECTION ================= */}
      {/* =================================================== */}

      <Route
        path="/analyst/login"
        element={<AnalystLogin />}
      />

      <Route
        path="/analyst/dashboard"
        element={
          <AnalystProtectedRoute>
            <Dashboard />
          </AnalystProtectedRoute>
        }
      />

      <Route
        path="/analyst/heatmap"
        element={
          <AnalystProtectedRoute>
            <Heatmap />
          </AnalystProtectedRoute>
        }
      />

      <Route
        path="/analyst/peak-hour"
        element={
          <AnalystProtectedRoute>
            <PeakHour />
          </AnalystProtectedRoute>
        }
      />

      <Route
        path="/analyst/analytic"
        element={
          <AnalystProtectedRoute>
            <Analytic />
          </AnalystProtectedRoute>
        }
      />

      <Route
        path="/analyst/ai"
        element={
          <AnalystProtectedRoute>
            <AI />
          </AnalystProtectedRoute>
        }
      />

      <Route
        path="/analyst/simulation"
        element={
          <AnalystProtectedRoute>
            <Simulation />
          </AnalystProtectedRoute>
        }
      />



      {/* ================= FALLBACK ================= */}

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}



function App() {

  return (
    <BrowserRouter>
      <RouterWrapper />
    </BrowserRouter>
  );
}

export default App;