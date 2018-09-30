/* react components */
import React, { Component } from 'react';
import Error from '../Error.js';
import axios from 'axios';

let Backend = require('../Backend.js');


const InvalidAccessErr = <Error text="Invalid access code!
  This access code is already in use. Please enter a different code."/>;

const MissingFieldErr = <Error text="Invalid form!
  Please fill out all form fields."/>;

class EditSponsorModal extends Component {

  constructor(props) {
    super(props);

    // TODO filter challenges against initial access code given as prop

    this.state = {
      access_code: this.props.sponsorCode,
      invalid_access: false,
      company_name: this.props.sponsorName,
      missing_access: false,
      missing_company: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      access_code: nextProps.sponsorCode,
      invalid_access: false,
      company_name: nextProps.sponsorName,
      missing_access: false,
      missing_company: false
    });
  }

  saveSponsor(e) {

    axios.get(Backend.httpFunctions.url + 'api/companies')
      .then(response => {
        let sponsors = response['data'];

        let validAccess = true;
        for(let i = 0; i < sponsors.length; i++) {
          // Validate that code does not exist
          // With the exception of the original code saved to self being overriden
          // If existing code matches state code and exsiting code is not the code given as a prop
          if(sponsors[i].access_code == this.state.access_code
            && sponsors[i].access_code != this.props.sponsorCode) {
            validAccess = false;
          }
        }

        let missingAccess = this.state.access_code == ''
          || this.state.access_code == undefined;

        let missingCompany = this.state.company_name == ''
          || this.state.company_name == undefined;

        let valid = validAccess && !missingAccess && !missingCompany;

        let sponsor_id = this.props.sponsorID;
        // TODO: add actual ID here, trash or recreate other fields in post???
        if(valid) {
          Backend.httpFunctions.postCallback('api/companies/id/' + sponsor_id, {
            "company_name": this.state.company_name,
          	"access_code": this.state.access_code
          }, this.props.onEdit);

          // Reset state and close modal
          this.setState({
            missing_company: false,
            invalid_access: false,
            missing_access: false
          });
          document.getElementById("btnCancelEditSponsorModal" + this.props.editID).click();
        } else {
          // Show errors
          if (!validAccess) {
            this.setState({invalid_access: true});
          } else {
            this.setState({invalid_access: false});
          }

          if (missingCompany) {
            this.setState({missing_company: true});
          } else {
            this.setState({missing_company: false});
          }

          if (missingAccess) {
            this.setState({missing_access: true});
          } else {
            this.setState({missing_access: false});
          }
        }

      });
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
                {this.state.missing_access ? MissingFieldErr : ""}
              </div>
              <div className="form-group">
                <label>Sponsor Name</label>
                <input type="text" className="form-control"
                  id="lblSponsorName"
                  value={this.state.company_name.toString()}
                  onChange = {(event) => this.setState({company_name:event.target.value})}/>
                {this.state.missing_company ? MissingFieldErr : ""}
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
