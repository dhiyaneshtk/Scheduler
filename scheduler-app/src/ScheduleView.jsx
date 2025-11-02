import React from "react";
import { useLocation } from "react-router-dom";
import "./ScheduleView.css";

function ScheduleView() {
  const location = useLocation();
  const schedule = location.state?.schedule || [];

  if (!schedule || schedule.length === 0) {
    return (
      <div className="schedule-container">
        <h1>📅 Your Weekly Schedule</h1>
        <p className="no-schedule">No schedule generated yet.</p>
      </div>
    );
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Group classes by day
  const scheduleByDay = {};
  for (const day of days) scheduleByDay[day] = [];
    schedule.forEach((course) => {
    const dayList = Array.isArray(course.days)
        ? course.days
        : course.days.split("|");

    dayList.forEach((d) => {
        const cleanDay = d.trim();
        if (scheduleByDay[cleanDay]) {
        scheduleByDay[cleanDay].push(course);
        }
    });
    });

  return (
    <div className="schedule-container">
      <h1>📅 Your Weekly Schedule</h1>

      <div className="calendar-grid">
        {days.map((day) => (
          <div key={day} className="day-column">
            <h2>{day}</h2>
            {scheduleByDay[day].length === 0 ? (
              <p className="empty-slot">—</p>
            ) : (
              scheduleByDay[day].map((c, idx) => (
                <div key={idx} className="course-block">
                  <strong>{c.course_title}</strong>
                  <p>{c.section}</p>
                  <p>
                    {c.start_time} – {c.end_time}
                  </p>
                  <p>{c.room}</p>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScheduleView;