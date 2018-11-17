import React, { Component } from 'react';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';

import { faExclamationTriangle } from '../node_modules/@fortawesome/fontawesome-free-solid';
import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
library.add(faExclamationTriangle);


class Error extends Component {

  render() {

    let font_awesome_icon = this.props.icon === undefined ?
      faExclamationTriangle : this.props.icon;
    let className = this.props.iconstyle === undefined ?
      "fa-exclamation-triangle" : this.props.iconstyle;
    let icon = this.props.technica_icon === undefined ?
      <FontAwesomeIcon icon={font_awesome_icon} className={className} />
      :
      <img src={this.props.technica_icon} className={className} />;
    return (
      <div className="btn-group error-group" role="group">
        <span className="error-icon">
          {icon}
        </span>
        <span className="error-text">
          {this.props.children === undefined ? this.props.text : this.props.children}
        </span>
      </div>
    );
  }

}

export default Error;
