/* react components */
import React, { Component } from 'react';
import './Sponsor.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';
import Card from './Card.js';
import SearchandFilter from './SearchandFilter.js';

import TechnicaIcon from './imgs/technica-circle-small.png';
import faTimesSquare from './imgs/faTimesSquare.png';

import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faArrowRight,
         faCheckSquare,
         faCheckCircle,
         faUserCheck,
         faPlus,
         faMinus,
         faTimes,
         faExclamationTriangle,
         faTasks } from '../node_modules/@fortawesome/fontawesome-free-solid';
import { faSquare, faCircle } from '../node_modules/@fortawesome/fontawesome-free-regular';
library.add(faArrowRight);
library.add(faCheckSquare);
library.add(faSquare);
library.add(faPlus);
library.add(faMinus);
library.add(faTimes);
library.add(faCircle);
library.add(faCheckCircle);
library.add(faExclamationTriangle);
library.add(faUserCheck);
library.add(faTasks);

export class VotingRow extends Component {

  render() {
    let win_count = 0;
    let badges = [];
    this.props.challenges.forEach((challenge) => {
      if (challenge.won) {
        win_count += 1;
      }
    });

    let fa_square_style = !this.props.disabled ? "fa-square hoverable" :"fa-square";
    let fa_check_square_style = !this.props.disabled ? "fa-square" :"fa-square faded";
    let checkbox = this.props.checked ?
      <FontAwesomeIcon icon={faCheckSquare} className={fa_check_square_style} />
      :
      <FontAwesomeIcon icon={faSquare} className={fa_square_style} />;

    let label = (win_count >= 2 && !this.props.checked) ?
        <label
          data-toggle="modal"
          data-target="#voting"
          onClick={this.props.handler.bind(this, this.props.project_id)}
        >
          {checkbox}
        </label>
        :
        <label onClick={this.props.handler.bind(this, this.props.project_id)}>{checkbox}</label>;

    let input = this.props.checked ?
      <input type="checkbox" className="voting-checkbox" value={this.props.project_id} checked />
      :
      <input type="checkbox" className="voting-checkbox" value={this.props.project_id} />;

    return (
      <tr>
        <td className="Voting">
          <div>
            {input}{!this.props.disabled ? label : <label>{checkbox}</label>}
          </div>
        </td>
        <td className="TableNumber">{this.props.table_number}</td>
        <td className="Project wrapper">
          {this.props.disabled && this.props.checked ? <div class="ribbon-wrapper-green"><div class="ribbon-green">
          WINNER</div></div> : <div></div>}
          <div className="name">
            {this.props.project_name}
            &nbsp;
            <a href={this.props.project_url} target="_tab">
              <FontAwesomeIcon icon={faArrowRight} className="LinkIcon" />
            </a>
          </div>
        </td>
      </tr>
    );
  }
}

export class VotingTable extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.handleClearEvent = this.handleClearEvent.bind(this);
    this.handleVoteEvent = this.handleVoteEvent.bind(this);
    this.state = { checked: this.props.voting_data }
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
    alert(JSON.stringify(this.props.voting_data));
    alert(JSON.stringify(this.props.sponsor_challenges));
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
    let rows = [];
    let state =this.props.sponsor_challenges[this.props.value].submitted;
    this.props.projects.forEach((project) => {
      rows.push(
        <VotingRow
          project_id = {project.project_id}
          table_number = {project.table_number}
          project_name = {project.project_name}
          project_url = {project.project_url}
          challenges = {project.challenges}
          handler = {this.handleVoteEvent}
          checked = {this.state.checked[project.project_id][this.props.value]}
          disabled = {state}
        />);
      });

    return (
      <div style={{marginTop: '30px'}}>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Table #</th>
                <th>Project Information</th>
              </tr>
            </thead>
            <tbody>
              {rows}
              {state == false ?
              <tr className="button-row">
                <td className="clear"><button onClick={this.handleClearEvent}>Clear</button></td>
                <td></td>
                <td className="submit"><button onClick={this.handleSubmitEvent}>Submit</button></td>
              </tr>
              :
              <tr className="button-row">
              <td className="clear"><button disabled>Clear</button></td>
              <td></td>
              <td className="submit"><button disabled>Submit</button></td></tr>}
            </tbody>
          </table>
      </div>
    );
  }
}

class Announcement extends Component {
  render() {
    let dict = {
      in_progress:
      { icon: faTasks,
        icon_style: "fa-tasks",
        message: "You have challenges left to place votes for! Start by choosing a challenge in Search and Filter."
      },
      completion:
      { icon: faUserCheck,
        icon_style: "fa-user-check",
        message: "You're all finished! Please see a member of the Technica staff if you need to change a submitted vote."
      },
      successful:
      { icon: faCheckCircle,
        icon_style: "fa-check-circle",
        message: "Votes for Best Hack to Help in a Crisis successfully submitted!"
      },
      ERROR_1:
      { icon: faExclamationTriangle,
        icon_style: "fa-exclamation-triangle",
        message: "ERROR : The number of votes for Best Hack to Help in a Crisis exceeds the limit of 2 votes."
      },
      ERROR_2:
      { icon: faExclamationTriangle,
        icon_style: "fa-exclamation-triangle",
        message: "ERROR : The number of votes for Best Hack to Help in a Crisis is less than the required 2 votes."
      }
    };
    let type = dict[this.props.type];
    return(
      <td className="card announcement">
        <div class="btn-group" role="group">
          <button className="announcement-icon">
            <FontAwesomeIcon icon={type.icon} className={type.icon_style}/>
          </button>
          <button className="task-title">
            {type.message}
          </button>
        </div>
      </td>
    )
  }
}

class Task extends Component {
  render() {
    let circle = this.props.submitted ? faCheckCircle : faCircle;
    return(
      <td className="card task">
        <div class="btn-group" role="group">
          <button className="task-icon">
            <FontAwesomeIcon icon={circle} className="fa-circle" />
          </button>
        <button className="task-title">
          Place votes for {this.props.challenge}
        </button>
        </div>
      </td>
    )
  }
}

export class WelcomeHeader extends Component {

  render() {
    let tasks = [];
    let all_submitted = true;
    Object.keys(this.props.data).map((challenge) => {
      tasks.push(<Task challenge={challenge} submitted={this.props.data[challenge].submitted} />);
      if (this.props.data[challenge].submitted == false) {
        all_submitted = false;
      }
    });

    let announcement = all_submitted ? <Announcement type="completion" /> : <Announcement type="in_progress" />;
    return(
      <Card title={"Welcome " + this.props.company + "!"} content={
        <table>
          <tr>
            {announcement}
            <td className="card task-header">
            <h5>Tasks</h5>
            </td>
            <div>
              {tasks}
            </div>
          </tr>
        </table>
      }/>
    );
  }
}

/* Sponsor page content (see PRD) <VotingTable />*/
const Sponsor = () => (

SiteWrapper(
    <div id="Sponsor">
      <div class="row">
        <div class="col">
          <SearchandFilter origin = "sponsor" loggedIn = "Booz Allen Hamilton" title = {<div>Vote For Your Challenge Winner<div style={{display:"inline",fontSize:"15px"}}>(</div>s<div style={{display:"inline",fontSize:"15px"}}>)</div></div>}/>
        </div>
      </div>
    </div>
  )
);


export default Sponsor;

// <div class="card">
// <div class="card-body">
//   <SubmissionTable projects={PROJECTS} />
// </div>
// </div>
