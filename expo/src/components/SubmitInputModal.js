import React, { Component } from "react";

import "../App.css";

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
export default class SubmitInputModal extends Component {
    constructor(props) {
        super(props);
        this.state = { inputValue: "" };
    }
    render() {
        return (
            <div className="modal fade" id={this.props.modalId} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.modalTitle}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.bodyText != null
                                ? <p className="modal-text">{this.props.bodyText}</p>
                                : null
                            }
                            <div className="form-group">
                                <label>{this.props.inputLabel}{this.props.isInputRequired ? "*" : null}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={this.props.inputPlaceholder}
                                    onChange={(e) => this.setState({ inputValue: e.target.value })}
                                    required={this.props.isInputRequired || false}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className="button button-secondary"
                                data-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="button button-primary"
                                data-dismiss="modal"
                                onClick={() => this.props.completeAction(this.state.inputValue)}
                                disabled={this.props.isInputRequired && this.state.inputValue == ""}
                            >
                                {this.props.submitText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
