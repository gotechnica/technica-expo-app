import React, { useState } from "react";

import "App.css";

/**
 * @props
 * modalId - unique id for this modal (safest to only use once in the entire app)
 * modalTitle - h5 to display (main confirmation text)
 * bodyText - p to offer any explanations/descriptions/information (leave null if not needed)
 * inputLabel - label of the input you want from the user
 * inputPlaceholder - placeholder text for the input box
 * isInputRequired - boolean
 * completeAction - method bound to calling class to be called on confirmation,
 *                  takes @param inputValue (user inputted text)
 * submitText - what to display on the submit button (e.g. "Submit" or "Import from Devpost")
 */
export default function SubmitInputModal(props) {
  const [inputValue, setInput] = useState("");

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
            {props.bodyText != null ? (
              <p className="modal-text">{props.bodyText}</p>
            ) : null}
            <div className="form-group">
              <label>
                {props.inputLabel}
                {props.isInputRequired ? "*" : null}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={props.inputPlaceholder}
                onChange={e => setInput(e.target.value)}
                required={props.isInputRequired || false}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="button button-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button-primary"
              data-dismiss="modal"
              onClick={() => props.completeAction(inputValue)}
              disabled={props.isInputRequired && inputValue === ""}
            >
              {props.submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
