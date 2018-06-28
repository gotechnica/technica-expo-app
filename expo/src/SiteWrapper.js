/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

/* Header / constant app features */

let SiteWrapper = (content) => (
  <div className="App">
    <nav className="navbar navbar-expand-md">
      <Link to="/">
        <img src={require('./technica-logo-white.svg')}
          alt="Technica Logo" height="50px"/>
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/sponsorlogin">Sponsor Login</Link>
          </li>
          <li className="nav-item">
            <Link to="/adminlogin">Admin Login</Link>
          </li>
        </ul>
      </div>

    </nav>
    <div className="container">
      {content}
    </div>
  </div>
);

export default SiteWrapper;
