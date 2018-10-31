import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Admin from './Admin.js';
import AdminLogin from './AdminLogin.js';
import Home from './Home.js';
import Sponsor from './Sponsor.js';
import SponsorLogin from './SponsorLogin.js';


/* Routing control for app overall */
const Routing = () => (
  <Router basename="/expo">
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
