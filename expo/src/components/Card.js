import React, { Component } from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Card.css';

/**
 * @props
 * title - Title that goes in card header
 */
class Card extends Component {
  render() {
    return (
      <div class="card">
        <div className="card-header">
            <div className="d-flex">
              <div>
                <h4>{this.props.title}</h4>
              </div>
              <div className="ml-auto">
                <button
                  type="button"
                  className="link-button"
                  onClick={this.props.action}
                >
                  {this.props.actionName}
                  </button>
              </div>
            </div>
          </div>
        <div class="card-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Card;
