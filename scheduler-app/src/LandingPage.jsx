import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';


function LandingPage() {
  
  const navigate = useNavigate();

  function handleClick() {
    navigate('/dashboard');
  }
  return (
    <div>
      <h1 className="title">Course <span className="orange">Maker</span></h1>
      <button onClick={handleClick}>Get Started</button>
      
    </div>
  );
}

export default LandingPage;