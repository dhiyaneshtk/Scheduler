import { Clock, MapPin, User } from "lucide-react";
import "./Calendar.css";

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Calendar = ({ scheduledCourses }) => {
  const getCoursesForSlot = (day, time) => {
    return scheduledCourses.filter(
      (course) => course.day === day && course.time === time
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">Weekly Schedule</h2>
      </div>

      <div className="calendar-grid glass">
        <div className="calendar-time-column">
          <div className="time-header"></div>
          {timeSlots.map((time) => (
            <div key={time} className="time-slot">
              <Clock size={14} />
              <span>{time}</span>
            </div>
          ))}
        </div>

        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-day-column">
            <div className="day-header">
              <span className="day-name">{day}</span>
            </div>
            {timeSlots.map((time) => {
              const courses = getCoursesForSlot(day, time);
              return (
                <div key={`${day}-${time}`} className="calendar-cell">
                  {courses.map((course, idx) => (
                    <div key={idx} className="course-block glass-hover">
                      <div className="course-code">{course.code}</div>
                      <div className="course-details">
                        <div className="course-detail-item">
                          <MapPin size={12} />
                          <span>{course.room}</span>
                        </div>
                        <div className="course-detail-item">
                          <User size={12} />
                          <span>{course.professor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
