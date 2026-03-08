import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import "./DarkToggle.css";


function DarkToggle() {

  const { dark, toggleTheme } = useContext(ThemeContext);


  return (

    <div
      className={`theme-switch ${dark ? "active" : ""}`}
      onClick={toggleTheme}
    >

      <div className="switch-thumb">

        {dark ? "🌙" : "☀️"}

      </div>

    </div>
  );
}

export default DarkToggle;
