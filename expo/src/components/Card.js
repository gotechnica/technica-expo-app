import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "components/Card.css";

/**
 * @props
 * title - Title that goes in card header
 * actionName - Optional card action name
 * action - Optional card action function
 */
function Card(props) {
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
      <div class="card-body">{props.children}</div>
    </div>
  );
}

export default Card;
