import { library } from '@fortawesome/fontawesome-svg-core';
import React, { Component } from 'react';
import { faCheck, faTimes } from '../../node_modules/@fortawesome/fontawesome-free-solid';
import axiosRequest from '../Backend.js';
import Error from '../Error';
import Checkbox from './Checkbox';

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
      editable: true
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentWillMount() {
    this.state.challenges.map((challenge) => {
      if(challengeStore.indexOf(challenge) === -1)
      challengeStore.push(challenge);
    })
    console.log(challengeStore);
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
    console.log(challenges);
    let valid = true;
    let checks = document.querySelector('.black');
    console.log(checks);
    let input = document.querySelector('.input');
    console.log(input);
    console.log(this.state.challenges);
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
      console.log(document.getElementById(this.state.project_id).children)
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
      console.log(this.state.error)
      document.getElementById("btnCancelEditProjectModal" + this.props.editID).click();
    }
    console.log(this.state)
  }

  handleChange(color, index, e) {
    console.log(e)
    let lol = index;
    let allChallenges = this.state.allChallenges;
    challengeStore = this.state.challenges;
    company = this.state.company_challenge;
    console.log(color);
    if (color) {
      console.log("sup");
      console.log(lol)
      let label = (document.getElementById(`${lol}label`))
      let word = label.innerHTML;
      word = word.trim();
      console.log(word)
      let ind = this.state.challenges.indexOf(word)
      let index_all = this.state.allChallenges.indexOf(word);
      console.log(ind)
      challengeStore.splice(ind, 1);
      console.log(challengeStore)
    } else if (!color) {
      let label = (document.getElementById(`${lol}label`))
      let word = label.innerHTML
      word = word.trim();
      if (!challengeStore.includes(word) && word.length > 0)
        challengeStore.push(word);
      console.log('hello')
    }
    console.log(challengeStore)
    return challengeStore;
  }

  deleteProject = () => {
    axiosRequest.delete(`api/projects/id/${this.state.project_id}`)
      .then((data) => {
        this.props.onEdit();
        // Reset state and close modal
        document.getElementById("btnCancelEditProjectModal" + this.props.editID).click();
      });
  }

  render() {
    console.log(this.state.project_id)
    //let toggle = true;
    // console.log(this.props)
    // console.log(this.state)
    return (
      <div className="modal fade" id={this.props.editID}>
        <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"> Edit Project </h5>
            <button type="button"
              className="close"
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
          <div className="modal-footer">
            <div>
              <button
                type="button"
                className="button button-warning float-left"
                onClick={() => { if (window.confirm(`Are you sure you want to delete ${this.state.project_name} from the database?`)) this.deleteProject() }}
              >
                Delete
                </button>
            </div>
            <button type="button"
              className="button button-primary"
              onClick={
                (event) => {
                  this.saveProject(event);
                }
              }>
              Save
            </button>
            <button type="button"
              className="button button-secondary"
              id={"btnCancelEditProjectModal" + this.props.editID}
              data-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default EditProjectModal;