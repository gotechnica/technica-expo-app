/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';
import Login from './Login.js';
import Error from './Error.js';
import axios from 'axios';
let Backend = require('./Backend.js');

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
    if(this.state.loggedIn) {
      this.props.history.push({
       pathname: '/admin'
      });
    } else {
      axios.get(Backend.httpFunctions.url + 'api/whoami')
        .then((response)=>{
          let credentials = response['data'];
          if(credentials != undefined && credentials.user_type == 'admin') {
            this.setState({loggedIn:true, error:""});

            this.props.history.push({
             pathname: '/admin'
            });
          }
        });
    }
  }

  onLogin(e, accessCode) {
    // TODO Validate login code in place
    let codeExists = accessCode != undefined && accessCode != '';

    if (codeExists) {
      this.setState({logggedIn:true, error:""});

      // Try to set logged in state for admin
      Backend.httpFunctions.postCallback('api/login/admin', {
          access_code: accessCode
        }, (status)=> {
          if(status == 200) {
            // Log in was successful
            // Clear errors on component
            this.setState({loggedIn:true, error:""});

            // Move to admin page
            this.props.history.push({
             pathname: '/admin'
            });
          } else {
            // Log in failed, show error
            this.setState({loggedIn:false, error:InvalidErr});
          }
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
