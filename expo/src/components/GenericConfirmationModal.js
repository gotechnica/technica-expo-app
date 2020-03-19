import React from "react";

import "App.css";

/**
 * @props
 * modalId - unique id for this modal (safest to only use once in the entire app)
 * modalTitle - h5 to display (main confirmation text)
 * bodyText - p to offer any explanations/descriptions/information
 * completeAction - method bound to calling class to be called on confirmation
 */
export default function GenericConfirmationModal() {
  return (
    <div className="modal fade" id={props.modalId} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{props.modalTitle}</h5>
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
            <p className="modal-text">{props.bodyText}</p>
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
              onClick={props.completeAction}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
