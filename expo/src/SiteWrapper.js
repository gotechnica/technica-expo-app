import React from "react";
import { Link } from "react-router-dom";
import hackathon_logo from "customize/imgs/bitcamp-logo.png";
import "SiteWrapper.css";

/* Header / constant app features */

let SiteWrapper = (content) => (
  <div className="App">
    <nav className="navbar navbar-expand-md">
      <Link to="/">
        <div class="header">
          <img className="logo" src={hackathon_logo} alt="Logo" />
        </div>
      </Link>
    </nav>
    <div className="container">{content}</div>
  </div>
);

export default SiteWrapper;
