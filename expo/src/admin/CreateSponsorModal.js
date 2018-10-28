/* react components */
import React, { Component } from 'react';
import SmallerParentheses from '../SmallerParentheses.js';
import Error from '../Error.js';
import axios from 'axios';

let Backend = require('../Backend.js');

const InvalidAccessErr = <Error text="Invalid access code!
  This access code is already in use. Please enter a different code."/>;

const MissingFieldErr = <Error text="Please fill out this field!"/>;

class CreateSponsorModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      access_code: '',
      invalid_access: false,
      company_name: '',
      missing_company: false,
      challenge_name: '',
      missing_challenge: false,
      num_winners: 1,
      missing_num_winners: false
    };
  }

  saveSponsor(e) {
    axios.get(Backend.httpFunctions.url + 'api/companies')
      .then(response => {
        let sponsors = response['data'];

        let validAccess = true;
        for(let i = 0; i < sponsors.length; i++) {
          if(sponsors[i].access_code == this.state.access_code) {
            validAccess = false;
          }
        }

        let missingCompany = this.state.company_name == ''
          || this.state.company_name == undefined;

        let valid = validAccess && !missingCompany;

        if(valid) {
          Backend.httpFunctions.postCallback('api/companies/add', {
            "company_name": this.state.company_name,
          	"access_code": this.state.access_code,
          	"challenge_name": "NEED TO ADD THIS FIELD",
          	"num_winners": "1"
          }, this.props.onCreate);

          // Reset state and close modal
          this.setState({
            access_code: '',
            invalid_access: false,
            company_name: '',
          });
          document.getElementById("btnHideCreateSponsorModal" + this.props.createID).click();
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
        }

      });
  }

  render() {
    return (
      <div className="modal fade" id={this.props.createID}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Sponsor</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">

                <div className="form-group">
                  <label>Sponsor Name</label>
                  <input type="text" className="form-control"
                    id="lblSponsorName"
                    placeholder="Enter the sponsor or company name"
                    onChange = {(event) => this.setState({company_name:event.target.value})}/>
                  {this.state.missing_company ? MissingFieldErr : ""}
                </div>
                <div className="form-group">
                  <label>Access Code <SmallerParentheses font_size="15px">leave blank to auto generate</SmallerParentheses></label>
                  <input type="text" className="form-control"
                    id="lblAccessCode"
                    placeholder="Enter an access code"
                    onChange = {(event) => this.setState({access_code:event.target.value})}/>
                  {this.state.invalid_access ? InvalidAccessErr : ""}
                </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="button button-primary"
                onClick={(event) => {
                  this.saveSponsor(event);
                }}>
                Save
              </button>
              <button type="button" className="button button-secondary"
                id={"btnHideCreateSponsorModal" + this.props.createID}
                data-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default CreateSponsorModal;
