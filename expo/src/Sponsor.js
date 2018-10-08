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

import TechnicaIcon from './imgs/technica-circle-small.png';
import DevpostIcon from './imgs/devpost-icon.png';
import TechnicaRibbon from './imgs/technica_award_ribbon.png';

import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faExternalLinkAlt,
         faCheckSquare,
         faCheckCircle,
         faUserCheck,
         faPlus,
         faMinus,
         faTimes,
         faTimesCircle,
         faExclamationTriangle,
         faTasks } from '../node_modules/@fortawesome/fontawesome-free-solid';
import { faSquare, faCircle } from '../node_modules/@fortawesome/fontawesome-free-regular';
library.add(faExternalLinkAlt);
library.add(faCheckSquare);
library.add(faSquare);
library.add(faPlus);
library.add(faMinus);
library.add(faTimes);
library.add(faTimesCircle);
library.add(faCircle);
library.add(faCheckCircle);
library.add(faExclamationTriangle);
library.add(faUserCheck);
library.add(faTasks);

export class SmallerParentheses extends Component {
  render() {
    let reducedFontSize = { fontSize: this.props.font_size };
    return (
      <Fragment>
        <span style={reducedFontSize}>(</span>
        {this.props.children}
        <span style={reducedFontSize}>)</span>
      </Fragment>
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
        {this.props.challenge == "Best ML/AI Hack" ?
        <ul className="selection-list" style={{marginLeft:"50px", marginBottom: "0px"}}>
          <li>Smart Home Security</li>
          <li>Faze One</li>
          <li>Connect in Crisis</li>
        </ul> : <Fragment></Fragment>}
        </Fragment>
    )
  }
}

export class WelcomeHeader extends Component {

  render() {
    let tasks = [];
    let all_submitted = true;
    Object.keys(this.props.data).map((challenge) => {
      tasks.push(<Task challenge={challenge} submitted={this.props.data[challenge].submitted} winners={this.props.data[challenge].winners} />);
      if (this.props.data[challenge].submitted == false) {
        all_submitted = false;
      }
    });

    return(
      <Card title={"Welcome " + this.props.company + "!"} content={
            <Fragment><div className="task-header">
              <h5>Tasks</h5>
            </div>
            {tasks}
            </Fragment>
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

// <div class="card">
// <div class="card-body">
//   <SubmissionTable projects={PROJECTS} />
// </div>
// </div>
