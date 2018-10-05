/* react components */
import React, { Component } from 'react';
import Error from '../Error.js';
import axios from 'axios';

let Backend = require('../Backend.js');


let InvalidWinnerErr = <Error text="Invalid number of winners!
  This challenge must have one or more winner(s)." />;

const MissingFieldsErr = <Error text="Invalid form!
  Please fill out all form fields."/>;

class EditChallengeModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      winner_error: false,
      missing_fields: false,
      challenge_title: this.props.challengeTitle,
      num_winners: this.props.numWinners,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      winner_error: false,
      missing_fields: false,
      challenge_title: nextProps.challengeTitle,
      num_winners: nextProps.numWinners,
    });
  }

  saveChallenge(e) {

    axios.get(Backend.httpFunctions.url + 'api/companies/id/' + this.props.sponsorID)
      .then(response => {
        let challenges = response['data'];
        let winners = [];
        for(let i = 0; i < challenges.length; i++) {
          if(challenges[i].challenge_id == this.props.challengeID) {
            winners = challenges[i].winners;
          }
        }
        let minWinners = winners == undefined || winners.length == 0 ? 1 : winners.length;

        // Block set fewer winners if winners have been selected
        let winnerLessZero = Number(this.state.num_winners) <= minWinners;

        let missingFields = this.state.challenge_title === ''
          || this.state.challenge_title === undefined
          || this.state.num_winners === ''
          || this.state.num_winners === undefined;

        let valid = !winnerLessZero && !missingFields;

        if(valid) {
          // Send challenge name and num challenges to db if validates
          // Update state against db change
          Backend.httpFunctions.postCallback('api/companies/id/'
            + this.props.sponsorID + '/challenges/' + this.props.challengeID, {
              "challenge_name": this.state.challenge_title,
      	      "num_winners": this.state.num_winners
          }, this.props.onCreate);

          // Reset state and close modal
          this.setState({
            challenge_title: this.props.challengeTitle,
            num_winners: this.props.numWinners,
            winner_error: false,
            missing_fields: false
          });

          document.getElementById("btnHideCreateChallengeModal" + this.props.createID).click();
        }

        // Show errors
        if(missingFields) {
          this.setState({missing_fields: true});
        } else {
          this.setState({missing_fields: false});
        }

        if(winnerLessZero) {
          let invalidText = "Invalid number of winners!" +
            " This challenge must have " + minWinners + " or more winner(s)."
          InvalidWinnerErr = <Error text={invalidText} />;
          this.setState({winner_error: true});
        } else {
          this.setState({winner_error: false});
        }

      });

  }

  render() {
    return (
      <div className="modal fade" id={this.props.createID}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Challenge</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">

                <div className="form-group">
                  <label>Challenge Title</label>
                  <input type="text" className="form-control"
                    value={this.state.challenge_title}
                    onChange = {(event) => this.setState({challenge_title:event.target.value})}/>
                </div>
                <div className="form-group">
                  <label>Number of Winners</label>
                  <input type="number" className="form-control"
                    value={this.state.num_winners}
                    min="1"
                    onChange = {(event) => this.setState({num_winners:event.target.value})}/>
                  <br/>
                  {this.state.winner_error ? InvalidWinnerErr : ""}
                  {this.state.missing_fields ? MissingFieldsErr : ""}
                </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="button button-secondary"
                ID={"btnHideCreateChallengeModal" + this.props.createID}
                data-dismiss="modal">Cancel</button>
              <button type="button" className="button button-primary"
                onClick={(event) => {
                  this.saveChallenge(event);
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

export default EditChallengeModal;
