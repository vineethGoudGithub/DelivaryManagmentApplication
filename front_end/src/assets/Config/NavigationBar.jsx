import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css'

const NavigationBar = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/CustomerHome">Home</Link></li>
        <li><a href="#about" onClick={(e) => {
          e.preventDefault();
          scrollToSection('about');
        }}>About</a></li>
        <li><a href="#products" onClick={(e) => {
          e.preventDefault();
          scrollToSection('products');
        }}>Products</a></li>
        <li><a href="#cart" onClick={(e) => {
          e.preventDefault();
          scrollToSection('cart');
        }}>Cart</a></li>
        <li><a href="#contact" onClick={(e) => {
          e.preventDefault();
          scrollToSection('contact');
        }}>Contact Us</a></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
