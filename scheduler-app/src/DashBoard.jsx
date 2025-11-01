import React, { useState } from 'react';
import './Dashboard.css';
import ScheduleForm from './ScheduleForm';

function Dashboard() {
  const [showForm, setShowForm] = useState(false); 

  function handleNewSemester() {
    setShowForm(!showForm);
  }

  return (
    <div> 
      {/* Top bar */}
       <div className="top-bar">
          <h1 className="logo">
            Course<span>Maker</span>
          </h1>
        <button className="createNewSemester-btn" onClick={handleNewSemester}>+ New Semester</button>
       </div>
    <div className = "dashBoard-content"> {/* Dashboard content */}
        {!showForm ? (
          <p>Welcome to your dashboard!</p>
        ) : (
          <ScheduleForm /> 
        )}
    </div>
    </div>
  );
}

export default Dashboard;