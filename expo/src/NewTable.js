import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './NewTable.css';

import { library } from '../node_modules/@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '../node_modules/@fortawesome/react-fontawesome';
import { faCheckSquare } from '../node_modules/@fortawesome/fontawesome-free-solid';
import { faSquare } from '../node_modules/@fortawesome/fontawesome-free-regular';
library.add(faCheckSquare)
library.add(faSquare)

export class ProjectRow extends Component {
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
      this.props.width < 500 ?
        <VoteButtonGroup
          table_number = {this.props.table_number}
          project_name = {this.props.project_name}
          project_url = {this.props.project_url}
          custom_checkbox = {CustomCheckbox}
          input = {input}
        />
        :
        <VoteTableRow
          table_number = {this.props.table_number}
          project_name = {this.props.project_name}
          project_url = {this.props.project_url}
          custom_checkbox = {CustomCheckbox}
          input = {input}
        />
    );
  }
}

class VoteButtonGroup extends Component {
  render() {
    return (
      <div className="btn-group btn-block voting-row" role="group" aria-label="Project Row">
        <button className="btn vote">
          <label>{this.props.custom_checkbox}</label>
          {this.props.input}
        </button>
        <button className="btn btn-block">
          <a href={this.props.project_url} target="_tab" className="link">
            {this.props.project_name}
          </a>
          <div className="table">
            Table:&nbsp;{this.props.table_number}
          </div>
        </button>
      </div>
    );
  }
}

class VoteTableRow extends Component {
  render() {
    return (
      <tr className="voting-row">
        <td>
          <label>{this.props.custom_checkbox}</label>
          {this.props.input}
        </td>
        <td>
          {this.props.table_number}
        </td>
        <td>
          <a href={this.props.project_url} target="_tab" className="link">
            {this.props.project_name}
          </a>
        </td>
      </tr>
    );
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

export class NewTable extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.handleClearEvent = this.handleClearEvent.bind(this);
    this.handleVoteEvent = this.handleVoteEvent.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this)
    this.state = { checked: this.props.voting_data,
                   width:  window.innerWidth }
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth});
    //alert(this.state.width);
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
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
    alert(winners);
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
    let rows = [];
    let state = this.props.sponsor_challenges[this.props.value].submitted;

    this.props.projects.forEach((project) => {
      let checked = this.state.checked[project.project_id][this.props.value];
      let row =
        <ProjectRow
          table_number = {project.table_number}
          project_name = {project.project_name}
          project_url = {project.project_url}
          project_id = {project.project_id}
          challenges = {project.challenges}
          handler = {this.handleVoteEvent}
          checked = {checked}
          disabled = {state}
          width = {this.state.width}
        />;
      rows.push(
        row
      );
    });
    return (
      <div style={{marginTop:"20px"}} id="Sponsor">
        { rows.length == 0 ?
          <div class="card no-submissions">
            <h2>No Submissions</h2>
          </div>
          :
          ( this.state.width < 500 ?
            <div>{rows}</div>
            :
            <table>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Table</th>
                  <th>Project</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table> )
          }
        { state ?
        <div>
          <button className="button button-secondary clear" disabled>Clear</button>
          <button className="button button-primary submit" disabled>Submit</button>
        </div>
        :
        <div>
          <button className="button button-secondary clear" onClick={this.handleClearEvent}>Clear</button>
          <button className="button button-primary submit" onClick={this.handleSubmitEvent}>Submit</button>
        </div> }
      </div>
    );
  }

}
export default NewTable;
