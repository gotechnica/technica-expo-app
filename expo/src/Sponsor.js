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

import TechnicaIcon from './imgs/technica_award_ribbon.png';

import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faCheckSquare } from '../node_modules/@fortawesome/fontawesome-free-solid';
import { faSquare } from '../node_modules/@fortawesome/fontawesome-free-regular';
library.add(faExternalLinkAlt);
library.add(faCheckSquare);
library.add(faSquare);

export class VotingRow extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = { checked: false };
  }

  handleClick() {
    this.setState({
      checked: !this.state.checked
    });
  }

  render() {
    let win_count = 0;

    this.props.challenges.forEach((challenge) => {
      if (challenge.won) {
        win_count += 1;
      }
    });
    let checkbox = this.state.checked ? <FontAwesomeIcon icon={faCheckSquare} className="fa-check-square" /> : <FontAwesomeIcon icon={faSquare} className="fa-square" />;
    let label = (win_count >= 2 && !this.state.checked) ?
        <label data-toggle="modal" data-target="#voting">{checkbox}</label>
        :
        <label>{checkbox}</label>;
    let input = this.state.checked ? <input type="checkbox" checked /> : <input type="checkbox" />;

    return (
    <tr>
      <td onClick={this.handleClick} className="Voting">
        <div>{input}
        {label}</div>
      </td>
      <td className="TableNumber">{this.props.table_number}</td>
      <td className="Project">
        <div className="name">
          <a href={this.props.project_url} target="_tab">
            <FontAwesomeIcon icon={faExternalLinkAlt} className="LinkIcon"/>
          </a>
        {this.props.project_name}
        </div>
      </td>
    </tr>
    );
  }
}

export class VotingTable extends Component {
  render() {
    let rows = [];
    this.props.projects.forEach((project) => {
      rows.push(
        <VotingRow
          project_id = {project.id}
          table_number = {project.table_number}
          project_name = {project.project_name}
          project_url = {project.project_url}
          challenges = {project.challenges}
        />
      );
    });

    return (
      <div class="card">
      <div class="card-body">
      <table>
        <thead>
          <tr>
            <th>Voting</th>
            <th>Table #</th>
            <th>Project Information</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      </div>
      </div>
    );
  }

}

/*export class ChallengeCard extends Component {
  constructor() {
    super();
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.state = { expanded : false };
  }

  handleToggleClick() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {

    let hidden = {
      display: "none",
    };
    let displayed = {
      display: "inline-block",
    };

    let winnerCard = (
      <button>
        <img src={TechnicaIcon} className="Icon" />
        <b>{this.props.company} </b>
        <div> | {this.props.challenge_name}</div>
      </button>
    );

    const isExpanded = this.state.expanded;
    let toggledStyle = (isExpanded ? displayed : hidden);
    let indicator = isExpanded ? faCaretLeft : faCaretRight;
    let challengeCard = (
      <div className="Challenge-Card" onClick={this.handleToggleClick}>
        <table className="Challenge-Card">
          <tr>
            <td className="info">
              <b>{this.props.challenge_name} </b>
              <div style={toggledStyle}>|&nbsp;&nbsp;{this.props.company}</div>
            </td>
            <td className="indicator"><FontAwesomeIcon icon={indicator} /></td>
          </tr>
        </table>
      </div>
    );

    const isWinner = this.props.won;
    let card = (isWinner ? winnerCard : challengeCard);

    return (
      <div>
        {card}
      </div>
    )
  }
}*/

/* Sponsor page content (see PRD) <SubmissionTable />*/
const Sponsor = () => (

SiteWrapper(
    <div id="Sponsor">
      <div class="row">
        <div class="col">
          <SearchandFilter origin = "sponsor" loggedIn = "Mantech"/>
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
