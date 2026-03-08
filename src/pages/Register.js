import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import "./Register.css";


function Register() {

  const navigate = useNavigate();


  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({

    name: "",
    email: "",
    mobile: "",
    place: "",
    password: ""
  });


  const [otp, setOtp] = useState("");


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  // SEND OTP
  const sendOtp = async (e) => {

    e.preventDefault();

    setLoading(true);


    try {

      await API.post("/send-otp", form);

      alert("OTP sent to your email 📧");

      setStep(2);

    } catch (err) {

      alert(err.response?.data?.msg || "Failed to send OTP");

    }

    setLoading(false);
  };


  // VERIFY OTP
  const verifyOtp = async () => {

    setLoading(true);

    try {

      await API.post("/verify-otp", {

        email: form.email,
        otp: otp

      });

      alert("Registered Successfully 🎉");

      navigate("/login");

    } catch (err) {

      alert(err.response?.data?.msg || "Invalid OTP");

    }

    setLoading(false);
  };


  // RESEND OTP
  const resendOtp = async () => {

    try {

      await API.post("/resend-otp", {

        email: form.email

      });

      alert("OTP resent 📧");

    } catch {

      alert("Failed to resend OTP");

    }
  };


  return (

    <div className="register-container">

      <div className="register-card">


        <h2>Create Account</h2>


        {/* STEP 1 */}
        {step === 1 && (

          <form onSubmit={sendOtp}>


            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
            />


            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />


            <input
              name="mobile"
              placeholder="Mobile"
              onChange={handleChange}
              required
            />


            <input
              name="place"
              placeholder="City"
              onChange={handleChange}
              required
            />


            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />


            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>

          </form>
        )}


        {/* STEP 2 */}
        {step === 2 && (

          <div className="otp-box">

            <p className="subtitle">
              Enter OTP sent to your email
            </p>


            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />


            <button
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>


            <button
              className="resend-btn"
              onClick={resendOtp}
            >
              🔁 Resend OTP
            </button>

          </div>
        )}


      </div>

    </div>
  );
}

export default Register;
