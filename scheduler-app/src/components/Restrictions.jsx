import { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import "./Restrictions.css";

const Restrictions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [restrictions, setRestrictions] = useState({
    startDate: "2025-01-15T09:00",
    endDate: "2025-05-20T17:00",
    preferredDays: [],
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const toggleDay = (day) => {
    setRestrictions((prev) => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter((d) => d !== day)
        : [...prev.preferredDays, day],
    }));
  };

  return (
    <div className="restrictions-container">
      <button
        className="restrictions-toggle glass glass-hover"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Restrictions</span>
        <ChevronDown
          className={`chevron ${isOpen ? "rotate" : ""}`}
          size={20}
        />
      </button>

      {isOpen && (
        <div className="restrictions-panel glass">
          <div className="restriction-group">
            <label className="restriction-label">
              <Calendar size={18} />
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              className="restriction-input glass"
              value={restrictions.startDate}
              onChange={(e) =>
                setRestrictions({ ...restrictions, startDate: e.target.value })
              }
            />
          </div>

          <div className="restriction-group">
            <label className="restriction-label">
              <Calendar size={18} />
              End Date & Time
            </label>
            <input
              type="datetime-local"
              className="restriction-input glass"
              value={restrictions.endDate}
              onChange={(e) =>
                setRestrictions({ ...restrictions, endDate: e.target.value })
              }
            />
          </div>

          <div className="restriction-group">
            <label className="restriction-label">Preferred Days</label>
            <div className="days-grid">
              {days.map((day) => (
                <button
                  key={day}
                  className={`day-btn glass-hover ${
                    restrictions.preferredDays.includes(day) ? "active" : ""
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restrictions;
