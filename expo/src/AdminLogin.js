import React, { Component } from 'react';
import axiosRequest from './Backend.js';

import Error from './Error.js';
import Login from './Login.js';
import SiteWrapper from './SiteWrapper.js';

import './App.css';


const InvalidErr = <Error text="Invalid login code!" />;

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

  componentWillMount() {
    // If already logged in, move directly to admin page
    axiosRequest.get('api/whoami')
      .then((credentials) => {
        if (credentials != undefined && credentials.user_type == 'admin') {
          this.setState({ loggedIn: true, error: "" });
          this.props.history.push({
            pathname: '/admin'
          });
        }
      });
  }

  onLogin(accessCode) {
    // TODO Validate login code in place
    let codeExists = accessCode != undefined && accessCode != '';

    if (codeExists) {
      this.setState({ logggedIn: true, error: "" });

      // Try to set logged in state for admin
      axiosRequest.post(
        'api/login/admin',
        { access_code: accessCode }
      )
        .then((status) => {
          if (status == "Logged in as admin") {
            // Log in was successful
            // Clear errors on component
            this.setState({ loggedIn: true, error: "" });

            // Move to admin page
            this.props.history.push({
              pathname: '/admin'
            });
          } else {
            // Log in failed, show error
            this.setState({ loggedIn: false, error: InvalidErr });
          }
        });
    } else {
      this.setState({ loggedIn: false, error: InvalidErr });
    }
  }

  render() {
    return (
      SiteWrapper(
        <div className="AdminLogin">
          <Login title="Admin Login"
            onLogin={this.onLogin}
            error={this.state.error} />
        </div>
      )
    );
  }
}

export default AdminLogin;
