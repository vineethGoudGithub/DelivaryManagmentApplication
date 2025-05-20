import React from 'react';
import { Link } from 'react-router-dom'; // Make sure to install react-router-dom
import './NavigationBar.css'
const NavigationBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/CustomerHome">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/CustomerHome">Products</Link></li>
        <li><Link to="/About">Contact Us</Link></li>
          <li><Link to="/">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
