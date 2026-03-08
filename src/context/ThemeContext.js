import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();


export function ThemeProvider({ children }) {

  const [dark, setDark] = useState(false);


  // Load saved theme
  useEffect(() => {

    const saved = localStorage.getItem("darkMode");

    if (saved === "true") {
      setDark(true);
      document.body.classList.add("dark");
    }

  }, []);


  // Toggle theme
  const toggleTheme = () => {

    setDark(prev => {

      const newValue = !prev;

      if (newValue) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }

      localStorage.setItem("darkMode", newValue);

      return newValue;
    });
  };


  return (

    <ThemeContext.Provider value={{ dark, toggleTheme }}>

      {children}

    </ThemeContext.Provider>
  );
}
