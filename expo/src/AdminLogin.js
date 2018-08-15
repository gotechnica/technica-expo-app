/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';
import Login from './Login.js';

const InvalidErr = (
  <div className="alert alert-danger">
    <strong>Invalid login! </strong>
      Are you trying to log in as an <Link to="/sponsorlogin">event sponsor</Link>?
  </div>
);

/* Admin login page content (see PRD) */
class AdminLogin extends Component {

  constructor() {
    super();
    this.state = {
      loggedIn: false,
      error: ""
    };
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(e, accessCode) {
    // TODO Validate login against DB
    let validLogin = true;

    if (validLogin) {
      this.setState({logggedIn:true, error:""});

      // TODO Set logged in cookie for admin

      this.props.history.push({
       pathname: '/admin'
      });
    } else {
      this.setState({loggedIn:false, error:InvalidErr});
    }
  }

  render() {
    return (
      SiteWrapper(
        <div className="AdminLogin">
          <Login title="Admin Login"
            onLogin={this.onLogin}
            error={this.state.error}/>
        </div>
      )
    );
  }
}

export default AdminLogin;
