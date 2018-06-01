/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

/* Overarching styles */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/* custom components */
import Admin from './Admin.js';
import Sponsor from './Sponsor.js';
import AdminLogin from './AdminLogin.js';
import SponsorLogin from './SponsorLogin.js';
import Home from './Home.js';

/* Routing control for app overall */
const Routing = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/admin" component={Admin}/>
      <Route path="/sponsor" component={Sponsor}/>
      <Route path="/adminlogin" component={AdminLogin}/>
      <Route path="/sponsorlogin" component={SponsorLogin}/>
    </div>
  </Router>
)

export default Routing
