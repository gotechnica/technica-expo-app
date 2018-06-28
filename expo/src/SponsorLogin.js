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
      Please see a member of the Technica staff if
      you don't know your access code or are having
      trouble logging in.
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
    // TODO Validate login against DB
    let validLogin = false;

    if (validLogin) {
      this.setState({logggedIn:true, error:""});

      // TODO Set logged in cookie

      this.props.history.push({
       pathname: '/sponsor'
      });
    } else {
      this.setState({loggedIn:false, error:InvalidErr});
    }
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
