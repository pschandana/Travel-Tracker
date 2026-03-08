// components/AnalystLayout.jsx

import BottomNav from "./Bottom";

export default function AnalystLayout({ children }) {

  return (
    <div className="mobile-wrapper">

      <div className="page-content">
        {children}
      </div>

      <BottomNav />

    </div>
  );
}