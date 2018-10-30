import React, { Component, Fragment } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Table.css';
import SmallerParentheses from './SmallerParentheses.js';

import { SubmitModal } from './Sponsor.js';

import TechnicaRibbon from './imgs/technica_award_ribbon.png';
import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faCheckSquare } from '../node_modules/@fortawesome/fontawesome-free-solid';
import { faSquare } from '../node_modules/@fortawesome/fontawesome-free-regular';
library.add(faCheckSquare);
library.add(faSquare);

export class CheckBoxColumn extends Component {
  render() {
    let checkbox = ( this.props.checked ? faCheckSquare : faSquare);
    let input = ( this.props.checked ?
      ( this.props.disabled ?
        <input
          type="checkbox"
          className="voting-checkbox"
          value={this.props.project_id}
          checked
          disabled
        />
        :
        <input
          type="checkbox"
          className="voting-checkbox"
          value={this.props.project_id}
          checked
        /> )
      :
      ( this.props.disabled ?
        <input
          type="checkbox"
          className="voting-checkbox"
          value={this.props.project_id}
          disabled
        />
        :
        <input
          type="checkbox"
          className="voting-checkbox"
          value={this.props.project_id}
        /> )
    );
    let checkboxStyle = ( this.props.checked ?
      ( this.props.disabled ? "fa-check-square disabled" : "fa-check-square" )
      :
      ( this.props.disabled ? "fa-square" : "fa-square hoverable" )
    );
    let CustomCheckbox = ( this.props.disabled ?
      <FontAwesomeIcon
        icon={checkbox}
        className={checkboxStyle}
      />
      :
      <FontAwesomeIcon
        icon={checkbox}
        className={checkboxStyle}
        onClick={this.props.handler.bind(this, this.props.project_id)}
      />
    );
    return (
      <td>
        <label>{CustomCheckbox}</label>
        {input}
      </td>
    );
  }
}

class ProjectColumn extends Component {

  render() {
    let attempted_challenges = [];
    let challenges_won = [];
    if (this.props.challenges !== undefined) {
      this.props.challenges.forEach((challenge) => {
          let challenge_card =
          <ChallengeCard
            company={challenge.company}
            challenge_name = {challenge.challenge_name}
            won={challenge.won}
            width={this.props.width}
          />;
          if (challenge.won) {
            challenges_won.push(challenge_card);
          } else {
            attempted_challenges.push(challenge_card);
          }
        }
      );
    }
    let colors = ["#FF7BAC","#B6A1C7","#17E3E3"];
    let index = this.props.counter % 3;
    return (
      <td>
        <div className="Project">
          <a href={this.props.project_url} target="_tab" className="link">
            {this.props.project_name}
          </a>
          { this.props.width < 460 ?
            ( this.props.origin === "home" ?
              ( this.props.table_number === "" ?
              <Fragment></Fragment>
              :
              <div>
                <button className="Table" style={{ backgroundColor: colors[index] }}>
                  <div className="Table">Table</div>
                  <div className="Table-Number">
                    {this.props.table_number}
                  </div>
                </button>
              </div> )
              :
              <div className="Sponsor-Table">Table: {this.props.table_number}</div>
            )
            :
            <Fragment></Fragment>
          }
        </div>
        { this.props.origin === "home" ?
          <Fragment>
            <div className="challenges-won">{challenges_won}</div>
            { attempted_challenges.length > 0 ?
              <Fragment>
                { this.props.width < 460 ? <hr className="attempted-challenges"/> : <Fragment></Fragment> }
                <div className="attempted-challenges">
                  { this.props.show_attempted_challenges ?
                    <b>
                      Attempted Challenge
                      <SmallerParentheses font_size="12px">s</SmallerParentheses>
                      : {attempted_challenges.length}
                    </b>
                    :
                    attempted_challenges }
                </div>
              </Fragment>
              :
              <Fragment></Fragment> }
          </Fragment>
        :
        <Fragment></Fragment>}
      </td>
    );
  }
}

class ChallengeCard extends Component {
  render() {
    let text = (this.props.width >= 460 ?
    (' | ' + this.props.company) :
    <Fragment><br/>{this.props.company}</Fragment>);
    return (
      this.props.won ?
      ( this.props.width >= 460 ?
        <div className="btn-group">
          <button className="btn">
            <img src={TechnicaRibbon} className="Ribbon"/>
          </button>
          <button className="btn btn-block">
            <b>{this.props.challenge_name}</b>
            {text}
          </button>
        </div>
        :
        <div>
          <img src={TechnicaRibbon} className="Ribbon"/>
          <b>{this.props.challenge_name}</b>
          {text}
        </div>
      )
      :
      <div>
        <button className="btn btn-block">
          <b>{this.props.challenge_name}</b>
          {text}
        </button>
      </div>
    );
  }
}

export class Row extends Component {
  render() {
    let table = ( this.props.width >= 460 ?
      <td className="Table-Number">{this.props.table_number === "" ? '-' : this.props.table_number}</td>
      :
      <Fragment></Fragment> );
    return (
     <tr className="voting-row">
        { this.props.origin === "sponsor" ?
          <CheckBoxColumn
            handler={this.props.handler}
            project_id={this.props.project_id}
            checked={this.props.checked}
            disabled={this.props.disabled}
          />
          :
          <Fragment></Fragment>
        }
        {table}
        <ProjectColumn
          project_name={this.props.project_name}
          project_url={this.props.project_url}
          challenges={(this.props.origin === "home" ? this.props.challenges : undefined)}
          table_number={this.props.table_number}
          width={this.props.width}
          origin={this.props.origin}
          counter={this.props.counter}
          show_attempted_challenges={this.props.show_attempted_challenges}
        />
      </tr>
    );
  }
}

export class Table extends Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = { width: window.innerWidth }
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth});
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  render() {
    let rows = [];
    let counter = 0;
    let table = ( this.state.width >= 460 ? <th>Table</th> : <Fragment></Fragment> );
    this.props.projects.forEach((project) => {
      rows.push(
        ( this.props.origin === "sponsor" ?
          <Row
            project_id = {project.project_id}
            table_number = {project.table_number}
            project_name = {project.project_name}
            project_url = {project.project_url}
            handler = {this.props.handler}
            checked = {this.props.checked[project.project_id] === undefined ? false : this.props.checked[project.project_id].checked[this.props.value]}
            disabled = {this.props.sponsor_data[this.props.value].votes_submitted}
            origin={this.props.origin}
            width={this.state.width}
          />
          :
          <Row
            project_id = {project.project_id}
            table_number = {project.table_number}
            project_name = {project.project_name}
            project_url = {project.project_url}
            challenges = {project.challenges}
            origin={this.props.origin}
            width={this.state.width}
            counter={counter}
            show_attempted_challenges={this.props.show_attempted_challenges}
          />
        )
      );
      counter += 1;
    });
    let selections = [];
    if (this.props.origin === "sponsor") {
      Object.keys(this.props.checked).forEach((project_id) => {
        let challenges = this.props.checked[project_id];
        Object.keys(challenges.checked).forEach((challenge) => {
          if (challenge === this.props.value && challenges.checked[challenge] === true) {
            selections.push(challenges.project_name);
          }
        });
      });
    }

    return (
      rows.length > 0 ?
        <Fragment>
          <table>
          { this.props.origin === "home" ?
            <thead>
              <tr>
                {table}
                <th>Project Information</th>
              </tr>
            </thead>
            :
            ( this.state.width >= 460 ?
              <thead>
                <tr>
                  <th>Select</th>
                  {table}
                  <th>Project</th>
                </tr>
              </thead>
              :
              <Fragment></Fragment>
            )
          }
          <tbody>
            {rows}
          </tbody>
        </table>
        {this.props.origin === "sponsor" ? ( this.props.sponsor_data[this.props.value].votes_submitted ?
        <div>
          <button className="button button-secondary clear" disabled>Clear</button>
          <button className="button button-primary submit" disabled>Submit</button>
        </div>
        :
        <div>
          <button className="button button-secondary clear" onClick={this.props.clear}>Clear</button>
          <button className="button button-primary submit" data-toggle="modal" data-target="#submitModal">Submit</button>
          <SubmitModal
            value={this.props.value}
            votes={selections}
            vote_limit={this.props.sponsor_data[this.props.value].vote_limit}
            submit_handler={this.props.submit}
            company_id={this.props.company_id}
            challenge_id={this.props.sponsor_data[this.props.value].challenge_id}
          />
        </div>) : <Fragment></Fragment>}
      </Fragment>
      :
      <div className="card no-submissions">
        <h2>No Submissions</h2>
      </div>
    );
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
