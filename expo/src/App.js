/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

/* styles */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/* custom components */
import Card from './Card.js';
import Table from './Table.js';

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
            <Link to="/sponsor">Sponsor Login</Link>
          </li>
          <li class="nav-item">
            <Link to="/admin">Admin Login</Link>
          </li>
        </ul>
      </div>

    </nav>
    <div class="container">
      {content}
    </div>
  </div>
);

const Home = () => (
  SiteWrapper(
    <div class="Home">
      <div class="row">
        <div class="col">
          <Card title="Search and Filter" content="replace this" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <Table />
        </div>
      </div>
    </div>
  )
);

const AdminLogin = () => (
  <div class="AdminLogin">
    adminlogin
  </div>
);

const Admin = () => (
  SiteWrapper(
    <div class="Admin">
      admin
    </div>
  )
);

const SponsorLogin = () => (
  <div class="SponsorLogin">
    sponsorlogin
  </div>
);

const Sponsor = () => (
  SiteWrapper(
    <div class="Sponsor">
      sponsor
    </div>
  )
);

const Routing = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/admin" component={Admin}/>
      <Route path="/sponsor" component={Sponsor}/>
    </div>
  </Router>
)

export default Routing
