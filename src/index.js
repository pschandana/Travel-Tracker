import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "leaflet/dist/leaflet.css";

import { ThemeProvider } from "./context/ThemeContext";

import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { PushNotifications } from "@capacitor/push-notifications";


// ===============================
// ANDROID BACK + SWIPE CONTROL
// ===============================

if (Capacitor.isNativePlatform()) {
CapApp.addListener("backButton", () => {

  const token = localStorage.getItem("token");

  const path = window.location.pathname;


  if (token) {

    // If home → exit app
    if (path === "/home") {

      CapApp.exitApp();

    } else {

      // Go home from anywhere
      window.location.href = "/home";

    }

  } else {

    window.history.back();

  }
});


  // ===============================
  // PUSH NOTIFICATIONS
  // ===============================

  PushNotifications.requestPermissions().then(result => {

    if (result.receive === "granted") {
      PushNotifications.register();
    }

  });


  PushNotifications.addListener("registration", token => {
    console.log("Push token:", token.value);
  });


  PushNotifications.addListener("registrationError", err => {
    console.log("Push error:", err);
  });


  PushNotifications.addListener("pushNotificationReceived", notification => {
    console.log("Notification:", notification);
  });

}



// ===============================
// RENDER APP
// ===============================

const root = ReactDOM.createRoot(
  document.getElementById("root")
);


root.render(

  <React.StrictMode>

    <ThemeProvider>

      <App />

    </ThemeProvider>

  </React.StrictMode>

);


reportWebVitals();
