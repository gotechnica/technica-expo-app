/* react components */
import React, { Component, Fragment } from 'react';
import './Sponsor.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';
import Card from './Card.js';
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

export class SubmitModal extends Component {
  render() {
    let parentheses = <SmallerParentheses font_size="12px">s</SmallerParentheses>;
    let modal =
      { error:
        { icon: faTimesCircle,
          iconstyle: "fa-times-circle",
          message:
            <Fragment>
              Error: Too many projects selected, only X project
              {parentheses}
              &nbsp;may be selected to win this challenge.
            </Fragment>
        },
        warning:
          { icon: faExclamationTriangle,
            iconstyle: "fa-exclamation-triangle",
            message:
              <Fragment>
                Warning: This challenge allows X winning project
                {parentheses}
                , but only Y was/were selected
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

              <Error icon={modal.error.icon} iconstyle={modal.error.iconstyle}>
                {modal.error.message}
              </Error>
              <Error
                technica_icon = {TechnicaIcon}
                iconstyle = "technica-icon"
                text="Attention: All submitted votes are final."
              />
              <h5 className="modal-challenge">
                Best Hack to Help in a Crisis Winners
              </h5>
              <ul className="selection-list">
                <li>Safety Net</li>
                <li>Faze One</li>
                <li>Mining Malware</li>
              </ul>
            </div>
            <div class="modal-footer">
              <button className="button button-secondary" data-dismiss="modal">Cancel</button>
              <button className="button button-primary" data-dismiss="modal">Submit</button>
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
        { this.props.challenge === "Best ML/AI Hack" ?
        <ul className="selection-list" style={{marginLeft:"50px", marginBottom: "0px"}}>
          <li>Smart Home Security</li>
          <li>Faze One</li>
          <li>Connect in Crisis</li>
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
    this.state = { checked: this.props.voting_data,
                   width:  window.innerWidth }
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
    /*alert(winners);*/
    /*alert(JSON.stringify(this.props.voting_data));
    alert(JSON.stringify(this.props.sponsor_challenges));*/
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
    let state = this.props.sponsor_challenges[this.props.value].submitted;
    return (
      <div style={{marginTop:"20px"}} id="Sponsor">
        <Table headers={['Select','Table','Project']}
          projects={this.props.projects}
          value={this.props.value}
          checked={this.state.checked}
          sponsor_challenges={this.props.sponsor_challenges}
          handler={this.handleVoteEvent}
          origin={this.props.origin}
        />
        { state ?
        <div>
          <button className="button button-secondary clear" disabled>Clear</button>
          <button className="button button-primary submit" disabled>Submit</button>
        </div>
        :
        <div>
          <button className="button button-secondary clear" onClick={this.handleClearEvent}>Clear</button>
          <button className="button button-primary submit" data-toggle="modal" data-target="#exampleModalCenter">Submit</button>
        </div> }
        <SubmitModal />
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
        />
      );
      if (this.props.data[challenge].submitted === false) {
        all_submitted = false;
      }
    });

    return (
      <Card
        title={"Welcome " + this.props.company + "!"}
        content={
          <Fragment>
            <div className="task-header">
              <h5>Tasks</h5>
            </div>
            {tasks}
          </Fragment>
        }
      />
    );
  }
}

/* Sponsor page content (see PRD) <VotingTable />*/
const Sponsor = () => (
SiteWrapper(
    <div id="Sponsor">
      <div class="row">
        <div class="col">
          <SearchandFilter
            origin = "sponsor"
            loggedIn = "Booz Allen Hamilton"
            title = {
              <div>
                Vote For Your Challenge Winner
                <SmallerParentheses font_size="15px">s</SmallerParentheses>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
);

export default Sponsor;
