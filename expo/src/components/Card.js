import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "components/Card.css";

/**
 * @props
 * title - Title that goes in card header
 * action
 * actionName
 */
export default function Card(props) {
  return (
    <div class="card">
      <div className="card-header">
        <div className="d-flex">
          <div>
            <h4>{props.title}</h4>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              className="link-button"
              onClick={props.action}
            >
              {props.actionName}
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">{props.children}</div>
    </div>
  );
}
