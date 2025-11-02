import { Check } from "lucide-react";
import "./ScheduleOptions.css";

const ScheduleOptions = ({ scheduleOptions, onSelectSchedule }) => {
  return (
    <div className="schedule-options-container">
      <h2 className="options-title">Choose a Schedule Option</h2>
      <p className="options-subtitle">Select from up to 3 generated schedule variations</p>

      <div className="options-grid">
        {scheduleOptions.map((option, idx) => (
          <div key={idx} className="option-card glass glass-hover">
            <div className="option-header">
              <h3 className="option-title">Option {idx + 1}</h3>
              <span className="option-label">{option.label}</span>
            </div>

            <div className="option-schedule">
              {option.courses.map((course, courseIdx) => (
                <div key={courseIdx} className="option-course">
                  <div className="course-info">
                    <span className="course-code">{course.code}</span>
                    <span className="course-name">{course.name}</span>
                  </div>
                  <div className="course-time-info">
                    <span className="time-slot">
                      {course.day} @ {course.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="select-option-btn"
              onClick={() => onSelectSchedule(option)}
            >
              <Check size={18} />
              <span>Select This Schedule</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleOptions;
