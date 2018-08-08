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

import TechnicaIcon from './Copy of technica-circle-small.png';

import '../node_modules/bootstrap/scss/_badge.scss';

import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faCaretRight, faCaretLeft } from '../node_modules/@fortawesome/fontawesome-free-solid';
library.add(faExternalLinkAlt);
library.add(faCaretRight);
library.add(faCaretLeft);

const PROJECTS = [
  { table_number: 23,
    project_name: 'Mining Malware',
    project_url: 'https://devpost.com/software/mining-malware',
    challenges: [
      { company: 'Mantech',
        challenge_name: 'Cybersecurity Hack',
        won: true
      },
      { company: 'JP Morgan',
        challenge_name: 'Best Hack for Social Good',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      },
      { company: 'Capital One',
        challenge_name: 'Best Financial Hack',
        won: false
      },
      { company: 'Amazon Web Services',
        challenge_name: 'Best Use of AWS',
        won: true
      },
      { company: 'GE Digital',
        challenge_name: 'Best Digital Industrial Hack',
        won: false
      }
    ],
  },
  { table_number: 4,
    project_name: 'Leveraging the First Steps',
    project_url: 'https://devpost.com/software/leveraging-the-first-steps',
    challenges: [
      { company: 'JP Morgan',
        challenge_name: 'Best Hack for Social Good',
        won: true
      },
      { company: 'Bloomberg',
        challenge_name: 'Best Education/Diversity and Inclusion Hack',
        won: false
      }
    ],
  },
];
class ProjectRow extends Component {
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
        <Voting />
      </tr>
    );
  }
}
class SubmissionTable extends Component {
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
      <table>
        <thead>
          <tr>
            <th>Table #</th>
            <th>Project Information</th>
            <th>Voting</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

}

/*class FilterableSubmissionTable extends Component {
  render () {
    return (
      <div>
        <SearchBar />
        <ChallangesFilter />
      </div>
    );
  }
}*/

class ChallengeCard extends Component {
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
      paddingRight: "2px",
      textIndent: "4px"
    };
    let displayedIcon = {
      marginLeft: "4px",
      fontSize: "16px",
      display: "inline-block",
    };
    const isExpanded = this.props.expanded;
    let toggledStyle = (this.state.expanded ? displayed : hidden);

    let winnerCard = (
      <button onClick={this.handleToggleClick}>
        <img src={TechnicaIcon} className="Icon" />
        <b>{this.props.company} </b>
        <div> | {this.props.challenge_name}</div>
      </button>
    );
    let challengeCard = (
      <div><button className="company">
        <b>{this.props.company}</b>
        <div style={toggledStyle} className="challenge"> | {this.props.challenge_name}</div>
      </button>
      <button className="indicator" onClick={this.handleToggleClick}>
        {this.state.expanded ? <FontAwesomeIcon icon={faCaretLeft} /> : <FontAwesomeIcon icon={faCaretRight} />}
      </button></div>
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

class Voting extends Component {
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
    let selectedStyle = { backgroundColor: "#ff478c" };
    let nonSelectedStyle = { backgroundColor: "#737373" };
    let startStyle = { backgroundColor: "#ff7bac" };

    return (
      <td className="Vote toggle.toggle">
        <label class="switch">
          <input type="checkbox" />
          <span class="slider round"><p class="off">NO VOTE</p><p class="on">WINNER</p></span>
        </label>
      </td>
    )
  }
}

/*class SubmissionRow extends React.Component {
  render() {
    const table = this.props.table;
    const link = '"' + (this.props.devpost) + '"';
    const name = this.props.name;
    const wins = this.props.wins;
    const challenges = this.props.challenges;

    return (
      <tr>
        <td rowspan="3" class="TableNumber">{table}</td>
        <td class="Project">
          <a href={link}>
					     <i class="fas fa-external-link-alt"></i>
					</a>
          {name}
        </td>
        <td rowspan="3" class="Vote">

        </td>
      </tr>
    );
  }
}*/

/*class Sponsor extends Component {
  render() {
    return (
      <div>
        <SearchFilterSection />
        <SubmissionTable submissions={this.props.submissions} />
      </div>
    );
  }
}*/
/* Sponsor page content (see PRD) <SubmissionTable />*/
const Sponsor = () => (
  SiteWrapper(
    <div id="Sponsor">
      <div class="row">
        <div class="col">
          <Card title="Search and Filter" content="replace this" />
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <SubmissionTable projects={PROJECTS} />
        </div>
      </div>
    </div>
  )
);


export default Sponsor;
