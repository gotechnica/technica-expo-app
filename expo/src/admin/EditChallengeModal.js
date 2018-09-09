/* react components */
import React, { Component } from 'react';

const InvalidWinnerErr = (
  <div className="alert alert-danger">
    <strong>Invalid number of winners! </strong>
      A challenge must have one or more winner(s).
  </div>
);

const MissingFieldsErr = (
  <div className="alert alert-danger">
    <strong>Invalid form! </strong>
      Please fill out all form fields.
  </div>
);

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

  saveChallenge(e) {

    // TODO: Can not set fewer winners if winners have been selected
    let winnerLessZero = Number(this.state.num_winners) <= 0;

    let missingFields = this.state.challenge_title === ''
      || this.state.challenge_title === undefined
      || this.state.num_winners === ''
      || this.state.num_winners === undefined;

    let valid = !winnerLessZero && !missingFields;

    if(valid) {
      // TODO: Send challenge name and num challenges to db if validates
      // TODO: Update state against db change
      // Reset state and close modal
      this.setState({
        challenge_title: this.props.challengeTitle,
        num_winners: this.props.numWinners,
        winner_error: false,
        missing_fields: false
      });

      document.getElementById("btnHideCreateChallengeModal" + this.props.createID).click();

    } else {
      // Show errors
      if(missingFields) {
        this.setState({missing_fields: true});
      } else {
        this.setState({missing_fields: false});
      }

      if(winnerLessZero) {
        this.setState({winner_error: true});
      } else {
        this.setState({winner_error: false});
      }

    }
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
