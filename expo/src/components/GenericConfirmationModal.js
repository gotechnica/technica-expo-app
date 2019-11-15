import React, { Component } from "react";

import "App.css";

/**
 * @props
 * modalId - unique id for this modal (safest to only use once in the entire app)
 * modalTitle - h5 to display (main confirmation text)
 * bodyText - p to offer any explanations/descriptions/information
 * completeAction - method bound to calling class to be called on confirmation
 */
export default class GenericConfirmationModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="modal fade" id={this.props.modalId} role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.modalTitle}</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-text">{this.props.bodyText}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="button button-secondary no"
                data-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                className="button button-primary yes"
                data-dismiss="modal"
                onClick={this.props.completeAction}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
