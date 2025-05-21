import React from 'react';
import './Explore.css';

const Explore = () => {
  return (
    <div className="explore-container">
      <div className="explore-content">
        <div className="explore-text">
          <h1>EXPLORE MILLIONS OF OFFERINGS</h1>
          <h2>GET ALL NEEDS AT YOUR DOOR STEP</h2>
        </div>
        
        <div className="stats-container">
          <div className="stat-item">
            <h3>200M+</h3>
            <p>products</p>
          </div>
          
          <div className="stat-item">
            <h3>200K+</h3>
            <p>suppliers</p>
          </div>
          
          <div className="stat-item">
            <h3>5,900</h3>
            <p>product categories</p>
          </div>
          
          <div className="stat-item">
            <h3>200+</h3>
            <p>countries and regions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;