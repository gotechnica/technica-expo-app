import React, { Component, Fragment } from 'react';
import axiosRequest from '../Backend.js';

import Error from '../Error';
import Checkbox from './Checkbox';
import ConfirmationButton from './ConfirmationButton';

import '../App.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimes } from '../../node_modules/@fortawesome/fontawesome-free-solid';
library.add(faTimes);
library.add(faCheck);


let challengeStore = [];
let company = [];

class EditProjectModal extends Component {

  // Expect the project ID from this.props as projectID
  constructor(props) {
    super(props);
    this.state = {
      project_id : this.props.projectID,
      project_name: this.props.project_name,
      table_number: this.props.project_table,
      project_url: this.props.url,
      challenges: this.props.challenges,
      allChallenges: this.props.allChallenges,
      error: false,
      company_map:this.props.company_map,
      editable: true,
      showConfirmation: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.toggleConfirmation = this.toggleConfirmation.bind(this);
  }
  componentWillMount() {
    this.state.challenges.map((challenge) => {
      if(challengeStore.indexOf(challenge) === -1)
      challengeStore.push(challenge);
    })
  }
  
  toggleConfirmation() {
    this.setState({showConfirmation: !this.state.showConfirmation});
  }
  cancelProject(e) {
    let checkboxes = document.getElementById(this.state.project_id).children;
    let count = document.getElementById(this.state.project_id).childElementCount;
    for(let i=2;i<count;i++){
      if(checkboxes[i].children[0].checked == true && checkboxes[i].children[0].disabled == false)
        checkboxes[i].children[0].checked = false;
    }

  }
  saveProject(e) {
    //create challenges to POST

    let challenges = [];
    this.state.challenges.map((item)=>{
      let object = {}
      if(this.state.company_map.has(item))
        object = {
          challenge_name: item,
          company: this.state.company_map.get(item),
          won: false
        }
      challenges.push(object);
    })
    let valid = true;
    let checks = document.querySelector('.black');
    let input = document.querySelector('.input');
    let missing = this.state.project_name === '' ||
      this.state.table_number === '' ||
      this.state.project_url === ''
    let check = 0;
    // Note: removed requirement to have at least one checked challenge
    // for (let i = 0; i < this.state.challenges.length; i++) {
    //   if (this.state.challenges[i])
    //     check++;
    // }
    // let challenge = check > 0 ? false : true;
    this.setState({
      error: missing
    });
    if (!missing) {
      // TODO: Send access code and company name to db if valid access code
      // TODO: Update state against db change
      // Close modal
      let checkboxes = document.getElementById(this.state.project_id).children;
      let count = document.getElementById(this.state.project_id).childElementCount;
      for(let i=2;i<count;i++){
        if(checkboxes[i].children[0].checked)
          checkboxes[i].children[0].disabled = true;
      }
      axiosRequest.post(
        `api/projects/id/${this.state.project_id}`,
        {
          "project_name": this.state.project_name,
          "project_url": this.state.project_url,
          "table_number": this.state.table_number,
          "challenges": challenges
        }
      )
        .then(this.props.onEdit);
      if (checks) {
        this.setState({
          challenges: challengeStore
        })
      }
      document.getElementById("btnCancelEditProjectModal" + this.props.editID).click();
    }
  }

  handleChange(color, index, e) {
    let lol = index;
    let allChallenges = this.state.allChallenges;
    challengeStore = this.state.challenges;
    company = this.state.company_challenge;
    if (color) {
      let label = (document.getElementById(`${lol}label`))
      let word = label.innerHTML;
      word = word.trim();
      let ind = this.state.challenges.indexOf(word)
      let index_all = this.state.allChallenges.indexOf(word);
      challengeStore.splice(ind, 1);
    } else if (!color) {
      let label = (document.getElementById(`${lol}label`))
      let word = label.innerHTML
      word = word.trim();
      if (!challengeStore.includes(word) && word.length > 0)
        challengeStore.push(word);
    }
    return challengeStore;
  }

  deleteProject = () => {
    axiosRequest.delete(`api/projects/id/${this.state.project_id}`)
      .then((data) => {
        this.props.onEdit();
        // Reset state and close modal
        document.getElementById("btnCloseEditProjectModal" + this.props.editID).click();
      });
  }

  render() {
    //let toggle = true;
    return (
      <div className="modal fade" id={this.props.editID}>
        <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"> Edit Project </h5>
            <button type="button"
              className="close"
              id={`btnCloseEditProjectModal${this.props.editID}`}
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true"> &times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group" >
                <label> Project Name </label>
                <input className="form-control input"
                  type="text"
                  value={
                    this.state.project_name.toString()
                  }
                  onChange={
                    (event) => this.setState({
                      project_name: event.target.value
                    })
                  }
                />
              </div>
              <div className="form-group" >
                <label> Table Number </label>
                <input className="form-control"
                  type="text"
                  value={
                    this.state.table_number.toString()
                  }
                  onChange={
                    (event) => this.setState({
                      table_number: event.target.value
                    })
                  }
                />
              </div>
              <div className="form-group" >
                <label> Project URL </label>
                <input className="form-control"
                  type="text"
                  value={
                    this.state.project_url.toString()
                  }
                  onChange={
                    (event) => this.setState({
                      project_url: event.target.value
                    })
                  }
                />
              </div>
              {this.state.error ? <Error text="One or more fields are empty!"></Error> : null}
              <div className="form-group" id={this.state.project_id}>
                <label> Attempted Challenges </label>
                <br />
                {this.state.allChallenges.map((challenge, index) => {
                  if (challenge !== undefined) {
                    return (
                      <Checkbox handleChange={this.handleChange}
                        value={challenge}
                        ref={instance => {this.Checkbox = instance}}
                        check={this.state.challenges.indexOf(challenge) >= 0}
                        id={index}
                        project_id={this.state.project_id}
                        edit={this.state.editable}
                      />
                    );
                  }
                })}
              </div>
              <br />
            </form>
          </div>
          {this.state.showConfirmation ?
            <ConfirmationButton
              elementToDelete={this.state.project_name} 
              deleteElement={this.deleteProject}
              toggleConfirmation={this.toggleConfirmation}
            />
            : (
              <div className="modal-footer flex justify-space-between">
                <div>
                  <button
                    type="button"
                    className="button button-warning float-left"
                    onClick={this.toggleConfirmation}
                  >
                    Delete
                    </button>
                </div>
                <div>
                  <button type="button"
                    className="button button-primary m-r-s"
                    onClick={
                      (event) => {
                        this.saveProject(event);
                      }
                    }>
                    Save
                  </button>
                  <button type="button"
                    className="button button-secondary"
                    onClick = {(e) => {this.cancelProject(e)}}
                    id={"btnCancelEditProjectModal" + this.props.editID}
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
    );
  }
}

export default EditProjectModal;
