import { useState } from "react";
import CourseSearch from "./CourseSearch";
import Restrictions from "./Restrictions";
import Calendar from "./Calendar";
import ScheduleOptions from "./ScheduleOptions";
import { CalendarClock } from "lucide-react";
import "./Scheduler.css";

const Scheduler = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [scheduledCourses, setScheduledCourses] = useState([]);

  const handleCourseSelect = (course) => {
    setSelectedCourses([...selectedCourses, course]);
  };

  const handleCourseRemove = (courseId) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
  };

  const generateScheduleOptions = () => {
    const timeSlots = [
      { day: "Monday", time: "9:00 AM" },
      { day: "Monday", time: "11:00 AM" },
      { day: "Tuesday", time: "10:00 AM" },
      { day: "Wednesday", time: "9:00 AM" },
      { day: "Wednesday", time: "2:00 PM" },
      { day: "Thursday", time: "1:00 PM" },
      { day: "Friday", time: "9:00 AM" },
      { day: "Friday", time: "3:00 PM" },
    ];

    const options = [];
    
    // Generate 3 different schedule variations
    for (let i = 0; i < 3; i++) {
      const scheduledCourses = selectedCourses.map((course, idx) => {
        const slotIndex = (i * 2 + idx) % timeSlots.length;
        return {
          ...course,
          ...timeSlots[slotIndex],
          room: "GOL 2341",
          professor: "Rob Hagne",
        };
      });

      options.push({
        label: i === 0 ? "Morning Focus" : i === 1 ? "Afternoon Focus" : "Balanced",
        courses: scheduledCourses,
      });
    }

    setScheduleOptions(options);
    setShowOptions(true);
  };

  const handleSelectSchedule = (selectedOption) => {
    setScheduledCourses(selectedOption.courses);
    setShowOptions(false);
    setShowCalendar(true);
  };

  const handleBackToScheduler = () => {
    setShowCalendar(false);
    setShowOptions(false);
  };

  return (
    <div className="scheduler-container">
      {!showOptions && !showCalendar ? (
        <div className="scheduler-main">
          <div className="scheduler-header">
            <h1 className="scheduler-title">Course Scheduler</h1>
            <p className="scheduler-subtitle">
              Search and add courses to build your schedule
            </p>
          </div>

          <CourseSearch
            selectedCourses={selectedCourses}
            onCourseSelect={handleCourseSelect}
            onCourseRemove={handleCourseRemove}
          />

          <Restrictions />

          {selectedCourses.length > 0 && (
            <div className="build-schedule-section">
              <button
                className="build-schedule-btn glass glass-hover"
                onClick={generateScheduleOptions}
              >
                <CalendarClock size={20} />
                Generate Schedule Options
              </button>
            </div>
          )}
        </div>
      ) : showOptions ? (
        <div className="options-view">
          <button
            className="back-btn glass glass-hover"
            onClick={handleBackToScheduler}
          >
            ← Back to Scheduler
          </button>
          <ScheduleOptions
            scheduleOptions={scheduleOptions}
            onSelectSchedule={handleSelectSchedule}
          />
        </div>
      ) : (
        <div className="calendar-view">
          <button
            className="back-btn glass glass-hover"
            onClick={handleBackToScheduler}
          >
            ← Back to Scheduler
          </button>
          <Calendar scheduledCourses={scheduledCourses} />
        </div>
      )}
    </div>
  );
};

export default Scheduler;
