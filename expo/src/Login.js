/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
/*
Generic login component for Admins and Sponsors
Required this.props
  title - header for the login panel
  onLogin - function to call when login clicked, args event and access code
  error - graphic or message to show on login failure
*/

class Login extends Component {

  constructor(props){
    super(props);
    this.state={
      accessCode:''
    }
  }

  render() {
    return (
      <div className="card">
        <div className="card-header">
          <h5>{this.props.title}</h5>
        </div>
        <div className="card-body">
            <div className="form-group">
              <label htmlFor="txtAccessCode">Access Code</label>
              <input type="text"
                id="txtAccessCode"
                className="form-control"
                onChange = {(event) => this.setState({accessCode:event.target.value})}
                />
            </div>
            <button  className="btn btn-primary"
              onClick={(event) => {
                  this.props.onLogin(event, this.state.accessCode);
                }}>
                Login
            </button>
            <br/>
            <br/>
            {this.props.error}
        </div>
      </div>
    );
  }

}

export default Login;
