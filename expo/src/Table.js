import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Table.css';
import Sponsor from './Sponsor.js';

import TechnicaRibbon from './imgs/technica_award_ribbon.png';

import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faArrowRight, faCaretRight, faCaretLeft } from '../node_modules/@fortawesome/fontawesome-free-solid';
import SearchandFilter from './SearchandFilter';
library.add(faArrowRight);
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

    let attempted_challenges = (this.props.show_attempted_challenges ? challengeCards : <div style={{fontSize:"15px", margin: "5px 0px"}}>Attempted Challenges :&nbsp;&nbsp;{challengeCards.length}</div>);

    return (
    <tr>
      <td className="TableNumber">{this.props.table_number}</td>
      <td className="Project">
        <div className="grid-container">
          <div className="name">
            {this.props.project_name+" "}
            <a href={this.props.project_url} target="_tab">
              <FontAwesomeIcon icon={faArrowRight} className="LinkIcon"/>
            </a>
          </div>
          <div className="Challenge-Wins">
            {winnerCards}
          </div>
          <div className="Challenge-Categories">
            {attempted_challenges}
          </div>
        </div>
      </td>
    </tr>
    );
  }
}

export class Table extends Component {
  render() {
    let rows = [];
    this.props.projects.forEach((project) => {
      rows.push(
        <ProjectRow
          table_number = {project.table_number}
          project_name = {project.project_name}
          project_url = {project.project_url}
          challenges = {project.challenges}
          show_attempted_challenges = {this.props.show_attempted_challenges}
        />
      );
    });
    return (
      <div class="row">
      <div class="col">
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
      </div>
      </div>
    );
  }

}

export class ChallengeCard extends Component {
  constructor() {
    super();
    this.handleToggleClick = this.handleToggleClick.bind(this);
    this.state = { expanded : true };
  }

  handleToggleClick() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {

    let hidden = { display: "none" };
    let displayed = { display: "inline-block" };

    let winnerCard = (
      <button>
        <img src={TechnicaRibbon} className="Icon" />
          <b>{this.props.challenge_name +" "}</b>
          <div> | {this.props.company}</div>
      </button>
    );

    const isExpanded = this.state.expanded;
    let toggledStyle = displayed;//(isExpanded ? displayed : hidden);
    let indicator = isExpanded ? faCaretLeft : faCaretRight;
    let challengeCard = (
      <div className="Challenge-Card" onClick={this.handleToggleClick}>
        <table className="Challenge-Card">
          <tr>
            <td className="info">
              <b>{this.props.challenge_name} </b>
              <div style={toggledStyle} >|&nbsp;&nbsp;{this.props.company}</div>
            </td>
            {/*<td className="indicator"><FontAwesomeIcon icon={indicator} /></td>*/}
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

// Japneet's old Table code
/*class Table extends Component {
  constructor(props){
    super(props)
  }
  render() {
    const s = Sponsor();
    return (
      <div class="card">
        <div class="card-body">
          <table class="table">
              <tr>
                <th scope="col">Project</th>
                <th scope="col">URL</th>
                <th scope="col">Table</th>
                <th scope="col">Challenge(s)</th>
              </tr>
            <tbody>
            {
            this.props.data.map((object)=>{
              console.log(object);
              return(
                <tr>
                <td>{object.project_name}</td>
                <td><a href="#">{object.project_url}</a></td>
                <td>{object.table_number}</td>
                <td>{object.challenges.map((item,index)=>{
                  if(index !== object.challenges.length-1){
                    //console.log(index);
                    console.log(object.challenges.length)
                    return(
                      item.challenge_name +', '
                    )
                  }
                  else{
                    console.log(index);
                    return(
                      item.challenge_name
                    )
                  }
                })}</td>
              </tr>
              )
            })

          }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
*/

export default Table;
