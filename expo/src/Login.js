import React, { Component } from 'react';
import Card from 'components/Card.js'

/*
Generic login component for Admins and Sponsors
Required this.props
  title - header for the login panel
  onLogin - function to call when login clicked, args event and access code
  error - graphic or message to show on login failure
*/

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accessCode: ''
    }
  }

  render() {
    return (
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <Card title={this.props.title}>
            <div>
              <form onSubmit={(e) => {
                e.preventDefault();
                this.props.onLogin(this.state.accessCode);
              }}>
                <div className="form-group">
                  <label htmlFor="txtAccessCode">Access Code</label>
                  <input type="text"
                    id="txtAccessCode"
                    className="form-control"
                    onChange={(event) => this.setState({ accessCode: event.target.value })}
                  />
                </div>
                <button
                  className="button button-primary"
                  type="submit"
                >
                  Login
                </button>
                <br />
                <br />
                {this.props.error}
              </form>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

export default Login;
