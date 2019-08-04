import React, { Component } from "react";

import "../App.css";

class WarningModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="modal fade" id={this.props.modalId} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete All {this.props.whatToDelete}?</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="modal_warning_text">Are you sure you want to delete all {this.props.whatToDelete.toLowerCase()}?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="button button-secondary no" data-dismiss="modal">No</button>
                            <button type="button" className="button button-primary yes" data-dismiss="modal" onClick={this.props.deleteAll}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WarningModal;
