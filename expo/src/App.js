import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useCachedResponseData } from "Backend.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "App.css";

import Admin from "Admin.js";
import AdminLogin from "pages/AdminLogin.js";
import Home from "pages/Home.js";
import Sponsor from "Sponsor.js";
import SponsorLogin from "pages/SponsorLogin.js";

/* Routing control for app overall */
const Routing = () => (
  <Router basename="/">
    {useCachedResponseData ? (
      <div>
        <Route exact path="/" component={Home} />
        <Redirect to="/" />
      </div>
    ) : (
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/admin" component={Admin} />
        <Route path="/sponsor" component={Sponsor} />
        <Route path="/adminlogin" component={AdminLogin} />
        <Route path="/sponsorlogin" component={SponsorLogin} />
      </div>
    )}
  </Router>
);

export default Routing;
