import React from 'react';
import './Dashboard.css';

function Dashboard() {
    function handleNewSemester() {
    alert("Starting a new semester!");
  }

  return (
    <div> 
      {/* Top bar */}
       <div className="top-bar">
          <h1 className="logo">
            Course<span>Maker</span>
          </h1>
        <button className= "CreateNewSemester-btn" onClick={handleNewSemester}> + New Semester</button>
       </div>
    <div className = "dashBoard-content"> {/* Dashboard content */}
      <p>Welcome to your dashboard!</p>
    </div>
    </div>
  );
}

export default Dashboard;