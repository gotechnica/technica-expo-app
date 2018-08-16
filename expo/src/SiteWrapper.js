/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import './SiteWrapper.css';

/* Header / constant app features */

let SiteWrapper = (content) => (
  <div className="App">
    <nav className="navbar navbar-expand-md">
      <Link to="/">
        <img className="logo" src={require('./imgs/technica-logo.svg')}
          alt="Technica Logo"/>
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
