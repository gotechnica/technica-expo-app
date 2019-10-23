import React, { useState } from "react";
import Card from "components/Card.js";

/**
 * Generic login component for Admins and Sponsors
 *
 * @props
 * title - header for the login panel
 * onLogin - function to call when login clicked, args event and access code
 * error - graphic or message to show on login failure
 */

function Login(props) {
  const [accessCode, setAccessCode] = useState("");

  return (
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <Card title={props.title}>
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                props.onLogin(accessCode);
              }}
            >
              <div className="form-group">
                <label htmlFor="txtAccessCode">Access Code</label>
                <input
                  type="text"
                  id="txtAccessCode"
                  className="form-control"
                  onChange={event => setAccessCode(event.target.value)}
                />
              </div>
              <button className="button button-primary" type="submit">
                Login
              </button>
              <br />
              <br />
              {props.error}
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;
