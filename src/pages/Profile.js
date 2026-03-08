import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import "./Profile.css";
import BottomNav from "../components/BottomNav";



function Profile() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [photo, setPhoto] = useState("");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");


  useEffect(() => {
    loadProfile();
  }, []);


  // Load profile
  const loadProfile = async () => {

    try {

      const res = await API.get("/profile");

      setUser(res.data);

      if (res.data.photo) {
        setPhoto("https://travel-spdt.onrender.com" + res.data.photo);
      }

    } catch {
      alert("Unauthorized");
      navigate("/");
    }
  };


  // Upload profile photo
  const uploadPhoto = async (e) => {

    const file = e.target.files[0];

    if (!file) return;


    const formData = new FormData();

    formData.append("photo", file);


    try {

      const res = await API.post(
        "/update-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );


      setPhoto("https://travel-spdt.onrender.com" + res.data.photo);

      alert("Photo updated");

    } catch {
      alert("Upload failed");
    }
  };


  // Update password
  const updatePassword = async () => {

    if (!oldPass || !newPass) {
      alert("Fill all fields");
      return;
    }


    try {

      await API.post("/update-password", {
        old_password: oldPass,
        new_password: newPass
      });


      alert("Password updated");

      setOldPass("");
      setNewPass("");

    } catch {
      alert("Wrong old password");
    }
  };


  // Logout
  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };


  if (!user) return <h3>Loading...</h3>;


  return (
    <div className="profile">

      {/* HEADER */}
      <div className="profile-header">

        <h2>Hi {user.name} 👋</h2>

        <button onClick={logout}>
          🚪 Logout
        </button>

      </div>


      {/* PHOTO */}
      <div className="photo-box">

        <img
          src={photo || "/default-avatar.png"}
          alt="profile"
        />

        <label className="upload-btn">

          Change Photo

          <input
            type="file"
            accept="image/*"
            onChange={uploadPhoto}
            hidden
          />

        </label>

      </div>


      {/* INFO */}
      <div className="info">

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Place:</b> {user.place}</p>
        <p><b>Mobile No:</b> {user.mobile}</p>

      </div>


      {/* PASSWORD */}
      <div className="password-box">

        <h3>🔐 Change Password</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />

        <button onClick={updatePassword}>
          Update Password
        </button>

      </div>
    <BottomNav />

    </div>
  );
}

export default Profile;
