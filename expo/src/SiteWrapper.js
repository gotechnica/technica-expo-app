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
    <nav class="navbar navbar-expand-md">
      <Link to="/">
        <img src={require('./technica-logo-white.svg')}
          alt="Technica Logo" height="50px"/>
      </Link>

      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <Link to="/sponsorlogin">Sponsor Login</Link>
          </li>
          <li class="nav-item">
            <Link to="/adminlogin">Admin Login</Link>
          </li>
        </ul>
      </div>

    </nav>
    <div class="container">
      {content}
    </div>
  </div>
);

export default SiteWrapper;
