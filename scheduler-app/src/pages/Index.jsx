import { useState } from "react";
import Header from "../components/Header";
import Scheduler from "../components/Scheduler";
import Progress from "../components/Progress";
import "./Index.css";

const Index = () => {
  const [activeSection, setActiveSection] = useState("scheduler");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  return (
    <div className="app-container">
      <Header onMenuToggle={handleMenuToggle} />

      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-content glass">
          <button
            className={`sidebar-item ${activeSection === "scheduler" ? "active" : ""}`}
            onClick={() => handleSectionChange("scheduler")}
          >
            <span className="sidebar-icon">📅</span>
            <span>Scheduler</span>
          </button>
          <button
            className={`sidebar-item ${activeSection === "progress" ? "active" : ""}`}
            onClick={() => handleSectionChange("progress")}
          >
            <span className="sidebar-icon">📊</span>
            <span>Progress</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <main className="main-content">
        {activeSection === "scheduler" ? <Scheduler /> : <Progress />}
      </main>
    </div>
  );
};

export default Index;
