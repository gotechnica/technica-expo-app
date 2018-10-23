/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';
import Login from './Login.js';

const Backend = require('./Backend.js');

const InvalidErr = (
  <div className="alert alert-danger">
    <strong>Invalid login! </strong>
      {`Please see a member of the Technica staff if
      you don't know your access code or are having
      trouble logging in.`}
  </div>
);

/* Sponsor login page content (see PRD) */
class SponsorLogin extends Component {

  constructor() {
    super();
    this.state = {
      loggedIn: false,
      error: ""
    };
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(e, accessCode) {
    Backend.axiosRequest.post('api/login/sponsor', {access_code: accessCode})
      .then((data) => {
        if (data.includes('Logged in')) {
          this.setState({
            loggedIn: true,
            error: ''
          });
          this.props.history.push({
            pathname: '/sponsor'
          });
        } else {
          this.setState({
            loggedIn: false,
            error: InvalidErr
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      SiteWrapper(
        <div className="SponsorLogin">
          <Login title="Sponsor Login"
            onLogin={this.onLogin}
            error={this.state.error}/>
        </div>
      )
    );
  }
}

export default SponsorLogin;
