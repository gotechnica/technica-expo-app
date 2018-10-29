/* react components */
import React, { Component, Fragment } from 'react';
import './App.css';
import './Sponsor.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';
import SearchandFilter from './SearchandFilter.js';
import Error from './Error.js';
import Table from './Table.js';
import SmallerParentheses from './SmallerParentheses.js';

import TechnicaIcon from './imgs/technica-circle-small.png';

import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faCheckSquare,
         faCheckCircle,
         faTimesCircle,
         faExclamationTriangle} from '../node_modules/@fortawesome/fontawesome-free-solid';
import { faSquare, faCircle } from '../node_modules/@fortawesome/fontawesome-free-regular';
library.add(faCheckSquare);
library.add(faSquare);
library.add(faTimesCircle);
library.add(faCircle);
library.add(faCheckCircle);
library.add(faExclamationTriangle);

const Backend = require('./Backend.js');

export class SubmitModal extends Component {

  render() {
    let vote_limit = (this.props.challenge_info === undefined ? 0 : this.props.challenge_info.vote_limit);
    let votes = [];
    this.props.votes.forEach((project_id) =>{
      votes.push(<li>project_id</li>);
    });
    let modal =
      { error:
        { icon: faTimesCircle,
          iconstyle: "fa-times-circle",
          message:
            <Fragment>
              Error: Too many projects selected, only {vote_limit} project
              {vote_limit > 1 ? 's' : ''}
              &nbsp;may be selected to win this challenge.
            </Fragment>
        },
        warning:
          { icon: faExclamationTriangle,
            iconstyle: "fa-exclamation-triangle",
            message:
              <Fragment>
                Warning: This challenge allows {vote_limit} winning project
                {vote_limit > 1 ? 's' : ''}
                , but
                { votes.length === 0 ? "none" : ("only " + votes.length) }
                { votes.length === 1 ? 'was' : 'were' }
                selected
              </Fragment>
          }
      };
    return (
      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalCenterTitle">Confirm Votes</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

              { votes.length !== vote_limit ?
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
                technica_icon = {TechnicaIcon}
                iconstyle = "technica-icon"
                text="Attention: All submitted votes are final."
              />
              <h5 className="modal-challenge">
                {this.props.value + " Winners"}
              </h5>
              <ul className="selection-list">
                {votes}
              </ul>
            </div>
            <div class="modal-footer">
              <button className="button button-secondary" data-dismiss="modal">Cancel</button>
              { votes.length > vote_limit ?
                <button className="button button-primary" disabled>Submit</button>
                :
                <button className="button button-primary" data-dismiss="modal">Submit</button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Task extends Component {
  render() {
    let winners = []
    if(this.props.winners !== undefined) {
    if (this.props.winners.length > 0) {
      this.props.winners.forEach((project_id) => {
        winners.push(<li>{this.props.project_dict[project_id]}</li>);
      })
    }}
    let circle = this.props.submitted ? faCheckCircle : faCircle;

    return(
      <Fragment>
        <div className="btn-group task" role="group">
          <button className="task-icon">
            <FontAwesomeIcon icon={circle} className="fa-circle" />
          </button>
          <button className="task-title">
            Place votes for {this.props.challenge}
          </button>
        </div>
        { winners.length > 0 ?
        <ul className="selection-list" style={{marginLeft:"50px", marginBottom: "0px"}}>
          {winners}
        </ul>
        :
        <Fragment></Fragment> }
      </Fragment>
    )
  }
}




/* this.props.voting_data =
   { project_id:
    { challenge_name_1 : false,
      challenge_name_2 : false,
      ...
    }
    ...
  }
*/

export class VotingTable extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.handleClearEvent = this.handleClearEvent.bind(this);
    this.handleVoteEvent = this.handleVoteEvent.bind(this);
    //this.setVotingState = this.setVotingState.bind(this);
    this.state = { checked: {},
                   challenges: {},
                   width:  window.innerWidth }
  }

  /* Force VotingTable component to re-render once GET requests were granted */

  componentDidUpdate(prevProps, prevState) {
  // only update chart if the data has changed
  if (prevProps.voting_data !== this.props.voting_data) {
    if (Object.keys(this.state.checked).length == 0) {
      this.setState({ checked:this.props.voting_data },
        function(){}.bind(this)
      );
    }
  }
}

  componentDidMount() {
    Backend.axiosRequest.get('api/v2/companies')
    .then((company_data) => {
      let sponsor_challenges = {};
      company_data.forEach((company) => {
        if (company.company_name === this.props.company) {
          Object.keys(company.challenges).forEach((challenge) => {
            let challenge_obj = company.challenges[challenge];
            sponsor_challenges[challenge_obj.challenge_name] = {
              challenge_id: challenge,
              winners: challenge_obj.winners,
              vote_limit: challenge_obj.num_winners
            }
          })
          this.setState({
            challenges: sponsor_challenges,
          });
        }
      });
    });
  }

  handleSubmitEvent() {
    const checkboxes = document.getElementsByClassName("voting-checkbox");
    let count = 0;
    let winners = [];
    for (let i = 0; i < checkboxes.length; i++) {
      let ckbx = checkboxes[i];
      if (ckbx.checked) {
        count += 1;
        winners.push(ckbx.value);
      }
    }
    //alert(winners);
    //alert(JSON.stringify(this.state.checked));
    /*alert(JSON.stringify(this.props.sponsor_challenges));*/
  }

  handleClearEvent() {
    let cleared = this.state.checked;
    Object.keys(this.state.checked).forEach((key) => {
      cleared[key][this.props.value] = false;
    });
    this.setState({ checked: cleared });
  }

  handleVoteEvent(project_id) {
    let new_checked = this.state.checked;
    new_checked[project_id][this.props.value] = !new_checked[project_id][this.props.value];
    this.setState({ checked: new_checked });
  }


  render() {
    //alert(JSON.stringify(this.state.checked));
    return (
      <div style={{marginTop:"20px"}} id="Sponsor">
        <Table headers={['Select','Table','Project']}
          projects={this.props.projects}
          value={this.props.value}
          checked={this.state.checked}
          sponsor_challenges={this.props.sponsor_challenges}
          handler={this.handleVoteEvent}
          origin={this.props.origin}
          state={false/*this.props.sponsor_challenges[this.props.value] !== undefined ? this.props.sponsor_challenges[this.props.value].submitted : false*/}
          clear={this.handleClearEvent}
          submit={this.handleSubmitEvent}
        />
      </div>
    );
  }
}

export class WelcomeHeader extends Component {

  render() {
    let tasks = [];
    let all_submitted = true;
    Object.keys(this.props.data).forEach((challenge) => {
      tasks.push(
        <Task
          challenge={challenge}
          submitted={this.props.data[challenge].submitted}
          winners={this.props.data[challenge].winners}
          project_dict={this.props.project_dict}
        />
      );
      if (this.props.data[challenge].submitted === false) {
        all_submitted = false;
      }
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
              <h5>Tasks</h5>
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
    this.state = {
      loggedIn: false,
      loggedInAs: ''
    };
    Backend.axiosRequest.get('api/whoami')
      .then((credentials) => {
        if(credentials !== undefined && credentials.user_type === 'sponsor') {
          this.setState({
            loggedIn: true,
            loggedInAs: credentials.name,
          });
        } else {
          this.props.history.push({
            pathname: '/sponsorLogin'
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onLogout() {
    Backend.axiosRequest.post('api/logout')
      .then((data) => {
        this.props.history.push({
          pathname: '/sponsorLogin'
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
                title={
                  <div>
                    Vote For Your Challenge Winner
                    <SmallerParentheses font_size="15px">s</SmallerParentheses>
                  </div>
                }
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
