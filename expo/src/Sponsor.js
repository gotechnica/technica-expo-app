/* react components */
import React, { Component } from 'react';
import './Sponsor.css';
import './SliderOption.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';
import Card from './Card.js';

import TechnicaIcon from './imgs/technica_award_ribbon.png';

import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faCaretRight, faCaretLeft } from '../node_modules/@fortawesome/fontawesome-free-solid';
import SearchandFilter from './SearchandFilter';
library.add(faExternalLinkAlt);
library.add(faCaretRight);
library.add(faCaretLeft);

export class ProjectRow extends Component {
  render() {
    let winnerCards = [];
    let challengeCards = [];

    this.props.challenges.forEach((challenge) => {
      let card = <ChallengeCard company={challenge.company} challenge_name={challenge.challenge_name} won={challenge.won} />;
      if (challenge.won) {
        winnerCards.push(card);
      } else {
        challengeCards.push(card);
      }
    });

    return (
    <tr>
      <td className="TableNumber">{this.props.table_number}</td>
        <td class="Project">
          <div class="grid-container">
            <div class="name">
              <a href={this.props.project_url} target="_tab">
                <FontAwesomeIcon icon={faExternalLinkAlt} className="LinkIcon"/>
              </a>
              {this.props.project_name}
            </div>
            <div class="Challenge-Wins">
              {winnerCards}
            </div>
            <div class="Challenge-Categories">
              {challengeCards}
            </div>
          </div>
        </td>
      </tr>
    );
  }
}

export class SubmissionTable extends Component {
  render() {
    let rows = [];
    this.props.projects.forEach((project) => {
      rows.push(
        <ProjectRow
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

export class ChallengeCard extends Component {
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
}

export class Voting extends Component {
  constructor() {
    super();
    this.handleWinnerButtonClick = this.handleWinnerButtonClick.bind(this);
    this.handleNoVoteButtonClick = this.handleNoVoteButtonClick.bind(this);
    this.state = {
      winner : null,
      noVote : null
    };
  }

  handleWinnerButtonClick() {
    if (this.state.winner == null) {
      this.state.winner = false;
    }
    this.setState({
      winner: !this.state.winner,
      noVote: this.state.winner
    });
  }

  handleNoVoteButtonClick() {
    if (this.state.noVote == null) {
      this.state.noVote = false;
    }
    this.setState({
      winner: this.state.noVote,
      noVote: !this.state.noVote
    });
  }

  render() {
    return (
      <div className="Vote toggle.toggle no-hover">
        <label class="switch">
          <input type="checkbox" />
          <div class="slider round"></div>
        </label>
      </div>
    )
  }
}

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
