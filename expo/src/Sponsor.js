import React, { Component, Fragment } from 'react';
import axiosRequest from './Backend.js';

import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import Error from './Error.js';
import TechnicaIcon from './imgs/technica-circle-small.png';
import SearchandFilter from './SearchandFilter.js';
import SiteWrapper from './SiteWrapper.js';
import Table from './Table.js';

import './App.css';
import './Sponsor.css';
import './CircleCheck.css';

import { faCircle } from '../node_modules/@fortawesome/fontawesome-free-regular';
import { faCircle as faCircleSolid } from '../node_modules/@fortawesome/fontawesome-free-solid';
import { faCheckCircle, faCheck, faExclamationTriangle, faTimesCircle, faClipboardList } from '../node_modules/@fortawesome/fontawesome-free-solid';
import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
library.add(faTimesCircle);
library.add(faCircle);
library.add(faCheck);
library.add(faExclamationTriangle);
library.add(faClipboardList);
library.add(faCircle, faCircleSolid);

class WinnersSubmmitedModal extends Component {

  render() {
    return (
      <div class="modal fade bd-example-modal-sm" id="winnersSubmmitedModal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
          <div class="modal-content" style={{ border: "0px solid" }}>
            <div class="modal-header" style={{ border: "0px solid" }}>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" style={{ color: "white", textAlign: "center", marginTop: "-40px" }}>
              <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
              <div style={{ fontSize: "20px", padding: "0px 10px" }}>
                Thanks for submitting your winners!
              </div>
            </div>
            <div class="modal-footer" style={{ border: "0px solid", paddingTop: "0px" }}>
              <button className="button button-primary" data-dismiss="modal">OK</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class SubmitModal extends Component {
  constructor(props) {
    super(props);
    this.handleModalEvent = this.handleModalEvent.bind(this);
    this.state = {
      toggle: false
    }
  }
  handleModalEvent() {
    if (!this.state.toggle) {
      this.setState({ toggle: true });
    }
  }
  render() {
    let vote_limit = this.props.vote_limit;
    let votes = [];
    this.props.votes.forEach((project) => {
      votes.push(<li>{project}</li>);
    });
    let modal = {
      error: {
        icon: faTimesCircle,
        iconstyle: "fa-times-circle",
        message:
          <Fragment>
            Oops! Too many projects are selected to win this challenge.&nbsp;
            Our records show that you only intended to provide prizes for {vote_limit} project{vote_limit > 1 ? 's' : ''}.&nbsp;
            Come chat with someone on the Technica team if you want to select more!
          </Fragment>
      },
      warning: {
        icon: faExclamationTriangle,
        iconstyle: "fa-exclamation-triangle",
        message:
          <Fragment>
            Just a heads up! Our records show that you originally intended to provide prizes to {vote_limit} project{vote_limit > 1 ? 's' : ''} for this challenge, but
            {votes.length === 0 ? ' none ' : ` only ${votes.length} `}
            {votes.length === 1 ? ' was ' : ' were '} selected.
          </Fragment>
      }
    };

    return (
      <Fragment>
        <div class="modal fade" id="submitModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">Confirm Winner Selection</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {votes.length != vote_limit ?
                  (votes.length > vote_limit ?
                    <Error icon={modal.error.icon} iconstyle={modal.error.iconstyle}>
                      {modal.error.message}
                    </Error>
                    :
                    <Error icon={modal.warning.icon} iconstyle={modal.warning.iconstyle}>
                      {modal.warning.message}
                    </Error>
                  )
                  :
                  <Fragment></Fragment>
                }
                <Error
                  icon={modal.warning.icon}
                  iconstyle={modal.warning.iconstyle}
                  text="All submitted selections are final."
                />
                <h5 className="modal-challenge">
                  {this.props.value + " Winner" + (votes.length > 1 ? "s" : "")}
                </h5>
                <ul className="selection-list">
                  {votes.length > 0 ? votes : <li>No Projects Selected</li>}
                </ul>
              </div>
              <div class="modal-footer">
                <button className="button button-secondary" data-dismiss="modal">Cancel</button>
                {votes.length > vote_limit ?
                  <button className="button button-primary" disabled>Submit</button>
                  :
                  <button
                    className="button button-primary"
                    data-toggle="modal"
                    data-target="#winnersSubmmitedModal"
                    data-dismiss="modal"
                    onClick={this.props.submit_handler.bind(
                      this, this.props.company_id,
                      this.props.challenge_id,
                      this.props.value,
                      this.props.after_submission_handler)}>
                    Submit
                </button>
                }
              </div>
            </div>
          </div>
        </div>
        <WinnersSubmmitedModal />
      </Fragment>
    );
  }
}

class Task extends Component {
  render() {
    let winners = []
    if (this.props.winners.length > 0) {
      this.props.winners.forEach((project_id) => {
        winners.push(<li>{this.props.project_hash[project_id]}</li>);
      })
    }
    let circle = this.props.submitted ? faCheck : faClipboardList;

    return (
      <Fragment>
        <div className="btn-group task" role="group">
          <button className="task-icon">
            <FontAwesomeIcon icon={circle} className="fa-circle" />
          </button>
          {this.props.submitted ? (
            <button className="task-title">{this.props.challenge}</button>
          ) : (
              <button className="task-title">Select your winner{this.props.winners > 1 ? "s" : ""} for {this.props.challenge}</button>
            )}
        </div>
        {winners.length > 0 ?
          <ul className="selection-list" style={{ marginLeft: "50px", marginBottom: "0px" }}>
            {winners}
          </ul>
          :
          <Fragment></Fragment>}
      </Fragment>
    )
  }
}

/* this.props.voting_data =
   { PROJECT_ID:
    checked: {
      CHALLENGE_NAME_1 : false,
      CHALLENGE_NAME_2 : false,
      ...
    },
    project_name: PROJECT_NAME
    ...
  }
*/

export class VotingTable extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.handleClearEvent = this.handleClearEvent.bind(this);
    this.handleVoteEvent = this.handleVoteEvent.bind(this);
    this.state = {
      checked: {},
      challenges: {},
      width: window.innerWidth,
    }
  }

  /* Force VotingTable component to re-render once GET requests were granted */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.voting_data !== this.props.voting_data) {
      if (Object.keys(this.state.checked).length === 0) {
        /* Updates voting data for challenges where votes have been submitted */
        let challenge_data = this.state.challenges;
        let updated_voting_data = this.props.voting_data;
        if (Object.keys(updated_voting_data).length > 0) {
          Object.keys(challenge_data).forEach((challenge) => {
            let winners = challenge_data[challenge].winners;
            if (winners.length > 0) {
              winners.forEach((project_id) => {
                updated_voting_data[project_id].checked[challenge] = true;
              });
            }
          });
        }
        /* Force state to update once GET calls and login goes through */
        this.setState({
          checked: updated_voting_data,
          challenges: this.props.sponsor_data
        },
          function () { }.bind(this)
        );
      }
    }
  }

  handleSubmitEvent(company_id, challenge_id, challenge_name, update) {
    const checkboxes = document.getElementsByClassName("voting-checkbox");
    let winners = [];
    for (let i = 0; i < checkboxes.length; i++) {
      let ckbx = checkboxes[i];
      if (ckbx.checked) {
        winners.push(ckbx.value);
        let params = {
          company_id: company_id,
          challenge_id: challenge_id
        };
        let route = 'api/projects/id/' + ckbx.value + '/makeWinner';
        axiosRequest.post(route, params)
          .then((response) => {
            update(challenge_name, winners);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  }

  handleClearEvent() {
    let cleared = this.state.checked;
    Object.keys(this.state.checked).forEach((key) => {
      cleared[key].checked[this.props.value] = false;
    });
    this.setState({ checked: cleared });
  }

  handleVoteEvent(project_id) {
    let new_checked = this.state.checked;
    new_checked[project_id].checked[this.props.value] = !new_checked[project_id].checked[this.props.value];
    this.setState({ checked: new_checked });
  }

  render() {
    return (
      <div style={{ marginTop: "20px" }} id="Sponsor">
        <Table
          headers={['Select', 'Table', 'Challenges Won', 'Project']}
          company_id={this.props.company_id}
          isLoadingData={this.props.isLoadingData}
          projects={this.props.projects}
          value={this.props.value}
          checked={this.state.checked}
          sponsor_data={this.state.challenges}
          vote_handler={this.handleVoteEvent}
          origin={this.props.origin}
          clear={this.handleClearEvent}
          submit={this.handleSubmitEvent}
          after_submission_handler={this.props.after_submission_handler}
        />
      </div>
    );
  }
}

export class WelcomeHeader extends Component {
  render() {
    let tasks = [];
    let openTasksStillWaiting = false;
    Object.keys(this.props.sponsor_data).forEach((challenge) => {
      openTasksStillWaiting = openTasksStillWaiting || !this.props.sponsor_data[challenge].votes_submitted;
      tasks.push(
        <Task
          challenge={challenge}
          submitted={this.props.sponsor_data[challenge].votes_submitted}
          winners={this.props.sponsor_data[challenge].winners}
          project_hash={this.props.project_hash}
        />
      );
    });

    return (
      <div className="card">
        <div className="card-header">
          <div className="d-flex">
            <div>
              <h5>Welcome {this.props.company}!</h5>
            </div>
            <div class="ml-auto">
              <button
                type="button"
                className="link-button"
                onClick={this.props.logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <Fragment>
            <div className="task-header">
              {openTasksStillWaiting ? (
                <p>
                  You still have {tasks.length == 1 ? 'a challenge to select your winner' : 'challenges to select winners'} for!
                  Use the challenge selection menu to filter by projects that submitted to your specific challenge.
                  <br />
                  If you want to select a project which did not submit to your specific challenge,
                  come chat with someone on the Technica team and we'll get that updated for you!
                </p>
              ) : (
                  <p>
                    You've finalized the winners for your {tasks.length == 1 ? 'challenge' : 'challenges'}. Thanks!
                </p>
                )}
            </div>
            {tasks}
          </Fragment>
        </div>
      </div>
    );
  }
}


export default class Sponsor extends Component {
  constructor(props) {
    super(props);
    this.handleAfterSubmission = this.handleAfterSubmission.bind(this);
    this.state = {
      loggedIn: false,
      loggedInAs: null,
      company_id: null,
      sponsor_data: null,
    };
    axiosRequest.get('api/whoami')
      .then((credentials) => {
        if (credentials !== undefined && credentials.user_type === 'sponsor') {
          this.setState({
            loggedIn: true,
            loggedInAs: credentials.name,
            company_id: credentials.id,
            sponsor_data: {},
          });
          axiosRequest.get('api/v2/companies/current_sponsor')
            .then((company) => {
              let sponsor_challenges = {};
              if (company.company_name === this.state.loggedInAs) {
                Object.keys(company.challenges).forEach((challenge) => {
                  let challenge_obj = company.challenges[challenge];
                  sponsor_challenges[challenge_obj.challenge_name] = {
                    challenge_id: challenge,
                    vote_limit: challenge_obj.num_winners,
                    votes_submitted: (challenge_obj.winners.length > 0 ? true : false),
                    winners: challenge_obj.winners
                  }
                });
                this.setState({
                  sponsor_data: sponsor_challenges
                });
              }
            });
        } else {
          this.props.history.push({
            pathname: '/sponsorlogin'
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleAfterSubmission(challenge, winners) {
    if (this.state.sponsor_data != undefined && Object.keys(this.state.sponsor_data).length > 0) {
      let updated_sponsor_data = this.state.sponsor_data;
      updated_sponsor_data[challenge].votes_submitted = true;
      updated_sponsor_data[challenge].winners = winners;
      this.setState({
        sponsor_data: updated_sponsor_data
      });
    }
  }

  onLogout() {
    axiosRequest.post('api/logout')
      .then((data) => {
        this.props.history.push({
          pathname: '/sponsorlogin'
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.loggedIn) {
      return SiteWrapper(
        <div id="Sponsor">
          <div class="row">
            <div class="col">
              <SearchandFilter
                origin="sponsor"
                loggedIn={this.state.loggedInAs}
                company_id={this.state.company_id}
                after_submission_handler={this.handleAfterSubmission}
                sponsor_data={this.state.sponsor_data}
                logout={this.onLogout.bind(this)}
              />
            </div>
          </div>
        </div>
      )
    } else {
      return SiteWrapper()
    }
  }
}
