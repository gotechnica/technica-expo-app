import React, { Component } from 'react';

class WarningModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
      console.log(this.props.id);
      return(
        <div class="modal modal-warning" id ={this.props.id}>
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
             <h5 class="modal-title">Warning</h5>
             <button type="button" class="close" data-dismiss="modal-warning" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
      </div>
      
      <div class="modal-body">
        <p>Are you sure you want to delete {this.props.project_name} from the database?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick = {this.props.deleteProject()}>Yes</button>
      </div>
    </div>
  </div>
</div>
 )
    }
}

export default WarningModal;