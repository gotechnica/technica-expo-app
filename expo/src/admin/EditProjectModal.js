/* react components */
import React, {
  Component
} from 'react';
import Error from '../Error';
import {
  library
} from '@fortawesome/fontawesome-svg-core';
import {
  FontAwesomeIcon
} from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCheck
} from '../../node_modules/@fortawesome/fontawesome-free-solid'
import axios from 'axios';
library.add(faTimes);
library.add(faCheck);
let Backend = require('../Backend.js');
let challengeStore = [];
let save = false;
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
      erorr: false,
      challenge_error: false,
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
    for (let i = 0; i < this.state.challenges.length; i++) {
      if (this.state.challenges[i])
        check++;
    }
    let challenge = check > 0 ? false : true;
    if (missing || challenge)
      valid = false;
    else {
      this.setState({
        erorr: false
      })
      this.setState({
        challenge_error: false
      })
    }
    console.log(valid);
    if (valid) {
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
      Backend.httpFunctions.postCallback('api/projects/id/' + this.state.project_id, {
        "project_name": this.state.project_name,
        "project_url": this.state.project_url,
        "table_number": this.state.table_number,
        "challenges": challenges
      },this.props.onEdit);
      if (checks) {
        this.setState({
          challenges: challengeStore
        })
      }
      console.log(this.state.erorr)
      document.getElementById("btnCancelEditProjectModal" + this.props.editID).click();
    } else {
      // Show errors
      if (missing)
        this.setState({
          erorr: true
        });
      else
        this.setState({
          challenge_error: true
        })
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
    Backend.axiosRequest.delete(`api/projects/id/${this.state.project_id}`)
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
        <div className = "modal fade"
        id = {
          this.props.editID
        }>
        <div className = "modal-dialog"
        role = "document">
        <div className = "modal-content">
        <div className = "modal-header">
        <h5 className = "modal-title"> Edit Project </h5> 
        <button type = "button"
        className = "close"
        data-dismiss = "modal"
        aria-label = "Close">
        <span aria-hidden = "true"> &times;</span> 
        </button> 
        </div> 
        <div className = "modal-body">
        <form>
        <div className = "form-group" >
        <label> Project Name </label> 
        <input className = "form-control input"
        type = "text"
        value = {
          this.state.project_name.toString()
        }
        onChange = {
          (event) => this.setState({
            project_name: event.target.value
          })
        }
        /> 
        </div> 
        <div className = "form-group" >
        <label> Table Number </label> 
        <input className = "form-control"
        type = "text"
        value = {
          this.state.table_number.toString()
        }
        onChange = {
          (event) => this.setState({
            table_number: event.target.value
          })
        }
        /> 
        </div> 
        <div className = "form-group" >
        <label> Project URL </label> 
        <input className = "form-control"
        type = "text"
        value = {
          this.state.project_url.toString()
        }
        onChange = {
          (event) => this.setState({
            project_url: event.target.value
          })
        }
        /> 
        </div> 
        {
          this.state.erorr ? <Error text= "One or more fields are empty!"></Error> : ''} 
          <div className = "form-group" id={this.state.project_id}>
            <label> Attempted Challenges </label> 
            <br/> {
              //console.log(this.state.challenges)
            } {
              this.state.allChallenges.map((challenge, index) => {
                if (challenge !== undefined) {
                 // console.log(challenge)
                  if (this.state.challenges.indexOf(challenge) < 0) {
                    return ( <Checkbox handleChange = {this.handleChange}
                      value = {
                        challenge
                      }
                      ref = {
                        instance => {
                          this.Checkbox = instance;
                        }
                      }
                      check = {
                        false
                      }
                      id = {
                        index
                      } 
                      project_id = {
                        this.state.project_id
                      }
                      edit = {
                        this.state.editable
                      }
                      > 
                      </Checkbox>
                    )
                  } else {
                    return ( 
                      <Checkbox handleChange = {
                        this.handleChange
                      }
                      value = {
                        challenge
                      }
                      ref = {
                        instance => {
                          this.Checkbox = instance;
                        }
                      }
                      check = {
                        true
                      }
                      id = {
                        index
                      } 
                      project_id = {
                        this.state.project_id
                      }
                      edit = {
                        this.state.editable
                      }
                      >
                      </Checkbox>
                    )
                  }
                }
              })
            } 
            </div> 
            <br/> 
            {
              this.state.challenge_error ? <Error text="Select atleast one challenge"></Error>: ''} 
              </form> 
              </div> 
              <div className = "modal-footer">
                <div>
                  <button
                    type="button"
                    className="button button-warning float-left"
                    onClick={() => { if (window.confirm(`Are you sure you want to delete ${this.state.project_name} from the database?`)) this.deleteProject() }}
                  >
                    Delete
                </button>
                </div>
                <button type = "button"
                  className = "button button-secondary"
                  id = {"btnCancelEditProjectModal" + this.props.editID}
                  data-dismiss = "modal"
                >
                  Cancel
                </button> 
                <button type = "button"
                  className = "button button-primary"
                  onClick = {
                    (event) => {
                      this.saveProject(event);
                    }
                }>
                  Save
                </button> 
              </div> 
              </div> 
              </div> 
              </div>
            );
        }
      }

      class Checkbox extends Component {
        constructor(props) {
          super(props);
          this.state = {
            color: this.props.check
          }
          this.handleClick = this.handleClick.bind(this)
        }

        handleClick(e,id) {
          console.log(this.state.color)
          console.log(save);
          console.log(this.props.edit);
          if(this.state.color !== false){
          this.setState({
            color: !this.state.color
          });
        }
          console.log(this.state.color)
          this.props.handleChange(this.state.color, id, e);
        }

        render() {
          console.log(this.props.project_id)
          let id = `defaultChecked${this.props.id}${this.props.project_id}`;
          let label = `defaultChecked${this.props.id}${this.props.project_id}label`;
          // console.log(this);
          console.log(this.state.color)
          return ( 
            <div class="custom-control custom-checkbox" onChange={(e)=>{this.handleClick(e,id)}}>
              {this.state.color ? 
                <input type="checkbox" class="custom-control-input" id = {id}  checked disabled/>
                :
                <input type="checkbox" class="custom-control-input"  id = {id} />
              }
              <label class="custom-control-label" for={id} id={label}>{this.props.value}</label>
            </div>
          )
        }
      }

      export default EditProjectModal;