import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import "./DashBoard.css";

function DashBoard() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/course")
      .then((res) => res.json())
      .then((data) => {
        setAllCourses(data);
        console.log("📚 Loaded courses from backend:", data.length);
      })
      .catch((err) => {
        console.error("❌ Failed to load courses:", err);
        setError("Could not load courses from database.");
      });
  }, []);

  const filteredCourses = allCourses.filter(
    (c) =>
      c.course_title?.toLowerCase().includes(search.toLowerCase()) ||
      c.course_code?.toLowerCase().includes(search.toLowerCase())
  );

  const addCourse = (course) => {
    setError("");
    if (!courses.find((c) => c.course_code === course.course_code)) {
      setCourses([...courses, course]);
    }
    setSearch("");
  };

  const removeCourse = (code) => {
    setError("");
    setCourses(courses.filter((c) => c.course_code !== code));
  };

  const addRestriction = () => {
    const last = restrictions[restrictions.length - 1];
    if (last && (!last.day || !last.startTime || !last.endTime)) {
      setError("⚠️ Please complete the current restriction before adding another.");
      return;
    }

    setRestrictions([
      ...restrictions,
      {
        id: Date.now(),
        day: "Monday",
        startTime: "",
        endTime: "",
        allowed: true,
      },
    ]);
  };

  const updateRestriction = (id, field, value) => {
    setRestrictions(
      restrictions.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const removeRestriction = (id) => {
    setRestrictions(restrictions.filter((r) => r.id !== id));
  };

  const generateSchedule = async () => {
    setError("");

    if (courses.length === 0) {
      setError("⚠️ Please select at least one course before generating a schedule.");
      return;
    }

    for (const r of restrictions) {
      if (!r.day || !r.startTime || !r.endTime) {
        setError("⚠️ Please fill out all fields for each time restriction.");
        return;
      }
    }

    const data = { courses, restrictions };
    console.log("Sending data to backend:", data);

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.status === "success") {
        setError(`✅ Successfully generated ${result.valid_schedules} valid schedules.`);
      } else {
        setError("❌ Schedule generation failed.");
      }
    } catch (err) {
      setError("❌ Could not connect to backend. Please check your server.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header-section">
        <h1 className="title">
          Course<span>Maker</span>
        </h1>
        <p className="subtitle">Build your perfect schedule</p>
      </header>

      {/* Search Section */}
      <section className="section">
        <div className="section-header">
          <Search className="icon" />
          <h2>Find Courses</h2>
        </div>

        <input
          type="text"
          placeholder="Search for a course (e.g., DDDD 101)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {search.length > 0 && (
          <div className="dropdown">
            {filteredCourses.length === 0 ? (
              <p className="no-results">No results found.</p>
            ) : (
              <div className="dropdown-grid">
                {filteredCourses.slice(0, 12).map((course, idx) => (
                  <div
                    key={idx}
                    onClick={() => addCourse(course)}
                    className="dropdown-item"
                  >
                    <div className="code-tag">{course.course_code}</div>
                    <p>{course.course_title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Selected Courses */}
      {courses.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>📚 Selected Courses</h2>
            <span className="badge">{courses.length}</span>
          </div>

          <div className="card-list">
            {courses.map((course, idx) => (
              <div key={idx} className="card">
                <div>
                  <div className="code">{course.course_code}</div>
                  <p>{course.course_title}</p>
                </div>
                <button onClick={() => removeCourse(course.course_code)} className="close-btn">
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Restrictions */}
      <section className="section">
        <div className="section-header">
          <h2>⏰ Schedule Time Restrictions</h2>
          {restrictions.length > 0 && <span className="badge">{restrictions.length}</span>}
        </div>

        {restrictions.map((r) => (
          <div key={r.id} className="restriction-card">
            <select value={r.day} onChange={(e) => updateRestriction(r.id, "day", e.target.value)}>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>

            <input
              type="time"
              value={r.startTime}
              onChange={(e) => updateRestriction(r.id, "startTime", e.target.value)}
            />

            <input
              type="time"
              value={r.endTime}
              onChange={(e) => updateRestriction(r.id, "endTime", e.target.value)}
            />

            <select
              value={r.allowed ? "allowed" : "not-allowed"}
              onChange={(e) => updateRestriction(r.id, "allowed", e.target.value === "allowed")}
            >
              <option value="allowed">Allowed</option>
              <option value="not-allowed">Not Allowed</option>
            </select>

            <button onClick={() => removeRestriction(r.id)} className="close-btn">
              ×
            </button>
          </div>
        ))}

        <button onClick={addRestriction} className="add-btn">
          + Add Restriction
        </button>
      </section>

      {/* Generate */}
      {(courses.length > 0 || restrictions.length > 0) && (
        <div className="generate-section">
          <button onClick={generateSchedule} className="generate-btn">
            Generate Schedule →
          </button>
          {error && (
            <p className={`status-msg ${error.startsWith("✅") ? "success" : "error"}`}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default DashBoard;