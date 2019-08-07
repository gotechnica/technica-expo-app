import React, { Component } from 'react';
import axiosRequest from './Backend.js';

import Error from './Error.js';
import Login from './Login.js';
import SiteWrapper from './SiteWrapper.js';
import customize from './customize/customize';

import './App.css';

const errorText = "Invalid login code! Please see a member of the "
  + customize.hackathon_name + " staff if you don't know your access "
  + "code or are having trouble logging in.";
const InvalidErr = <Error text={errorText} />;

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

  onLogin(accessCode) {
    let codeExists = accessCode !== undefined && accessCode !== '';

    if(codeExists) {
      axiosRequest.post('api/login/sponsor', {access_code: accessCode})
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
    } else {
      this.setState({
        loggedIn: false,
        error: InvalidErr
      });
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
