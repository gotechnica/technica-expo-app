import React, { Component } from 'react';
import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '../node_modules/@fortawesome/fontawesome-free-solid';
library.add(faExclamationTriangle);

class Error extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let icon = this.props.icon == undefined ?
      faExclamationTriangle : this.props.icon;
    let className = this.props.iconstyle == undefined ?
      "fa-exclamation-triangle" : this.props.iconstyle;

    return (
      <div className="btn-group error-group" role="group">
        <span className="error-icon">
          <FontAwesomeIcon icon={icon} className={className}/>
        </span>
        <span className="error-text">
          {this.props.text}
        </span>
      </div>
    );
  }

}

export default Error;
