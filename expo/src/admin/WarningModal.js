import React, { Component } from 'react';

import '../App.css';

class WarningModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div class="modal fade" id="modalWarning" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Delete All Projects?</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p className="modal_warning_text">Are you sure you want to delete all projects?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="button button-secondary no" data-dismiss="modal">No</button>
                            <button type="button" class="button button-primary yes" onClick={this.props.deleteAllProjects}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WarningModal
