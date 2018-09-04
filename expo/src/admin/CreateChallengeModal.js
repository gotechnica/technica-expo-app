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

class CreateChallengeModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      winner_error: false,
      missing_fields: false,
      challenge_title: '',
      num_challenges: 1,
    };
  }

  saveChallenge(e) {

    let winnerLessZero = Number(this.state.num_challenges) <= 0;
    let missingFields = this.challenge_title === ''
      || this.challenge_title === undefined
      || this.num_challenges === ''
      || this.num_challenges === undefined;

    let valid = !winnerLessZero && !missingFields;

    if(valid) {
      // TODO: Send challenge name and num challenges to db if validates
      // TODO: Update state against db change
      // Reset state and close modal
      this.setState({
        challenge_title: '',
        num_challenges: 1,
        winner_error: false,
        missing_fields: false
      });

      document.getElementById("btnHideCreateChallengeModal" + this.props.createID).click();

    } else {
      // Show errors
      if(missingFields) {
        this.setState({missing_fields: true});
      } else if(winnerLessZero) {
        this.setState({winner_error: true});
      }

    }
  }

  render() {
    return (
      <div className="modal fade" id={this.props.createID}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Challenge for {this.props.company}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">

                <div className="form-group">
                  <label>Challenge Title</label>
                  <input type="text" className="form-control"
                    placeholder="Enter a challenge title"
                    onChange = {(event) => this.setState({challenge_title:event.target.value})}/>
                </div>
                <div className="form-group">
                  <label>Number of Winners</label>
                  <input type="number" className="form-control"
                    placeholder="1"
                    min="1"
                    onChange = {(event) => this.setState({num_challenges:event.target.value})}/>
                  <br/>
                  {this.state.winner_error ? InvalidWinnerErr : ""}
                  {this.state.missing_fields ? MissingFieldsErr : ""}
                </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary"
                ID={"btnHideCreateChallengeModal" + this.props.createID}
                data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary"
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

export default CreateChallengeModal;
