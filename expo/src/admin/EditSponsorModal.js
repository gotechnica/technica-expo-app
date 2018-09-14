/* react components */
import React, { Component } from 'react';

const InvalidAccessErr = (
  <div className="alert alert-danger">
    <strong>Invalid access code! </strong>
      This access code is already in use. Please enter a different code.
  </div>
);

class EditSponsorModal extends Component {

  // Expect the sponsor access code from this.props.sponsorCode
  constructor(props) {
    super(props);

    // TODO filter challenges against initial access code given as prop

    this.state = {
      access_code: this.props.sponsorCode,
      invalid_access: false,
      company_name: this.props.sponsorName
    };
  }

  saveSponsor(e) {
    let valid = true;

    if(valid) {
      // TODO: Send access code and company name to db if valid access code
      // TODO: Update state against db change

      // Close modal
      document.getElementById("btnCancelEditSponsorModal" + this.props.editID).click();
    } else {
      // Show errors
      this.setState({invalid_access: true});
    }
  }

  render() {
    console.log(this.state)
    console.log(this.props)
    return (
      <div className="modal fade" id={this.props.editID}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Sponsor</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">

              <div className="form-group">
                <label>Access Code</label>
                <input type="text" className="form-control"
                  id="lblAccessCode"
                  value={this.state.access_code.toString()}
                  onChange = {(event) => this.setState({access_code:event.target.value})}/>
                {this.state.invalid_access ? InvalidAccessErr : ""}
              </div>
              <div className="form-group">
                <label>Sponsor Name</label>
                <input type="text" className="form-control"
                  id="lblSponsorName"
                  value={this.state.company_name.toString()}
                  onChange = {(event) => this.setState({company_name:event.target.value})}/>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button"
                className="button button-secondary"
                data-dismiss="modal"
                id={"btnCancelEditSponsorModal" + this.props.editID}>Cancel</button>
              <button type="button" className="button button-primary"
                onClick={(event) => {
                    this.saveSponsor(event);
                  }}>
                  Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default EditSponsorModal;
