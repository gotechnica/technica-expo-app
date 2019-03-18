import React from 'react';
import { Link } from 'react-router-dom';
import hackathon_logo from './imgs/hackathon-logo.svg'
import './SiteWrapper.css';
import customize from './customize/customize'
/* Header / constant app features */

let SiteWrapper = (content) => (
  <div className="App">
    <nav className="navbar navbar-expand-md">
      <Link to="/">
        <img className="logo" src= {hackathon_logo} alt="Logo" />
      </Link>
      {/* 
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/sponsorlogin">Sponsor Login</Link>
          </li>
          <li className="nav-item">
            <Link to="/adminlogin">Admin Login</Link>
          </li>
        </ul>
      </div> */}

    </nav>
    <div className="container">
      {content}
    </div>
  </div>
);

export default SiteWrapper;
