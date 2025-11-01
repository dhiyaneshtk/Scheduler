import React, { useState, useEffect } from 'react';

function ScheduleForm() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [professor, setProfessor] = useState('');
  const [time, setTime] = useState('');

  // Load courses when component starts
  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Error loading courses:', err));
  }, []);

  // Add a new course
  const handleAddCourse = (e) => {
    e.preventDefault();

    const newCourse = { name, professor, time };
    fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse)
    })
      .then(res => res.json())
      .then(added => {
        setCourses(prev => [...prev, added]); // add to list
        setName('');
        setProfessor('');
        setTime('');
      })
      .catch(err => console.error('Error adding course:', err));
  };

  return (
    <div className="schedule-form">
      <h2>Schedule Form</h2>
      <form onSubmit={handleAddCourse}>
        <input
          type="text"
          placeholder="Course name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Professor"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit">Add Course</button>
      </form>

      <h3>Current Courses</h3>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {course.name} — {course.professor} — {course.time}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ScheduleForm;
