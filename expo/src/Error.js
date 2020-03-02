import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faExclamationTriangle);

class Error extends Component {
  render() {
    let font_awesome_icon =
      this.props.icon === undefined ? faExclamationTriangle : this.props.icon;
    let className =
      this.props.iconstyle === undefined
        ? "fa-exclamation-triangle"
        : this.props.iconstyle;
    return (
      <div className="btn-group error-group" role="group">
        <span className="error-icon">
          <FontAwesomeIcon icon={font_awesome_icon} className={className} />
        </span>
        <span className="error-text">
          {this.props.children === undefined
            ? this.props.text
            : this.props.children}
        </span>
      </div>
    );
  }
}

export default Error;
