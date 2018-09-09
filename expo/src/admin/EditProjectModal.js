/* react components */
import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes, faCheck} from '../../node_modules/@fortawesome/fontawesome-free-solid'
library.add(faTimes);
library.add(faCheck);
let challengeStore = [];
class EditProjectModal extends Component {

  // Expect the project ID from this.props as projectID
  constructor(props) {
    super(props);
    this.state = {
      project_name : this.props.project_name,
      table_number : this.props.project_table,
      projectId : this.props.projectID,
      project_url: this.props.url,
      invalid_access: false,
      challenges: this.props.challenges,
      allChallenges: this.props.allChallenges
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleState = this.handleState.bind(this)
  }
  componentWillMount(){
    this.state.challenges.map((challenge)=>{
      challengeStore.push(challenge);
    })
    console.log(challengeStore)
  }
  saveProject(e){
    let valid = true;
    let checks = document.querySelector('.black');
    console.log(checks);     
    if(checks){
      let icon = document.querySelector('.fa-times')
      console.log(icon)   
      this.setState(()=>({challenges: challengeStore})) 
      //checks.className ="pink";
      //this.Checkbox.changeState(challengeStore);
    }                             
    console.log(this.state.challenges)
    if(valid) {
      // TODO: Send access code and company name to db if valid access code
      // TODO: Update state against db change
      
      // Close modal
      document.getElementById("btnCancelEditProjectModal" + this.props.editID).click();
      console.log(this.state)
    } else {
      // Show errors
      this.setState({invalid_access: true});
    }
    console.log(this.state)
  }

  handleState(word){
    let challenge_new;
    console.log(this.state.challenges)
    challenge_new = this.state.challenges
    challenge_new.push(word);
    console.log(challenge_new)
    this.setState(({
      challenges:challenge_new
    }))
    console.log(this.state.challenges)
  }
  handleChange(color,e){
console.log(e.target)
let allChallenges = this.state.allChallenges;
challengeStore = this.state.challenges;
console.log(color);
if(color === true){
  console.log("sup");
  console.log(e.target.textContent)
  let word = e.target.textContent;
  word = word.trim();
  console.log(word)
  let index = this.state.challenges.indexOf(word)
  let index_all = this.state.allChallenges.indexOf(word);
  console.log(index)
  challengeStore.splice(index,1)
}
else if(color === false){
  let word = e.target.textContent;
  word = word.trim();
  console.log(word.length)
  if(!challengeStore.includes(word) && word.length>0)
    challengeStore.push(word);
  console.log('hello')
}
console.log(challengeStore)
return challengeStore;
  }

  render() {
   //let toggle = true;
    console.log(this.props)
    console.log(this.state)
    return (
      <div className="modal fade" id={this.props.editID}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Project</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
              <div className="form-group">
              <label>Project Name</label>
              <input className="form-control" type="text" value={this.state.project_name.toString()} onChange = {(event) => this.setState({project_name:event.target.value})}/>
              </div>
              <div className="form-group">
              <label>Table Number</label>
              <input className="form-control" type="text" value={this.state.table_number.toString()} onChange = {(event) => this.setState({table_number:event.target.value})}/>
              </div>
              <div className="form-group">
              <label>Project URL</label>
              <input className="form-control" type="text" value={this.state.project_url.toString()} onChange = {(event) => this.setState({project_url:event.target.value})}/>
              </div>
              <div className="form-group">
              <label>All Challenges</label>
              <br/>
                {
                  this.state.allChallenges.map((challenge)=>{
                    // if(this.state.challenges.indexOf(challenge)===-1){
                    //   return(
                    //     <Checkbox handleChange={this.handleChange} value={challenge} check={false}></Checkbox>
                    //   )
                    // }
                    // else{
                    //   return(
                    //     <Checkbox handleChange={this.handleChange} value={challenge} check={true}></Checkbox>
                    //   )
                    // }
                    return(
                      <AllCheck value={challenge} state={this.state.challenges} handleState={this.handleState}/>
                    )
                  })
                }
              </div>
              <div className="form-group">
              <label>Attempted Challenges</label>
              <br/>
              {console.log(this.state.challenges)}
              {this.state.challenges.map((challenge)=>{
                console.log(challenge)
                return(
                  <Checkbox handleChange={this.handleChange} value={challenge} ref={instance => { this.Checkbox = instance; }} check={true}></Checkbox>
                )
              })}
              </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" id={"btnCancelEditProjectModal"+this.props.editID} data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary"  onClick={(event) => {
                this.saveProject(event);
              }}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Checkbox extends Component{
  constructor(props){
    super(props);
    this.state = {color:this.props.check}
    this.handleClick = this.handleClick.bind(this)
    this.changeState = this.changeState.bind(this);
  }

  handleClick(e){
    this.setState({color: !this.state.color});
    this.props.handleChange(this.state.color,e);
  }

  changeState(arr){
  }

  render(){
   let color = this.state.color ? "pink" : "black";
   let icon = this.state.color ? "check" : "times";
   console.log(this.state.color);
   console.log(color)
    return(
       <span class="badge badge-primary check" className={color} onClick={(e)=>this.handleClick(e)}><FontAwesomeIcon icon={icon}></FontAwesomeIcon> {this.props.value}</span>
    )
  }
}

class AllCheck extends Component{
  constructor(props){
    super(props);
  }
  handleClick(e){
    let word = e.target.textContent;
    word = word.trim();
    console.log(word)
    if(this.props.state.indexOf(word)===-1){
      this.props.handleState(word);
    }
    console.log(this.props.state)
  }
  render(){
    return(
      <span class="badge badge-primary all" onClick={(e)=>this.handleClick(e)}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon> {this.props.value}</span>
    )
  }
}

export default EditProjectModal;

// <span class="badge badge-primary"><input type="checkbox" defaultChecked={this.state.toggle} onChange = {(e)=>{
//   this.state.toggle = !this.state.toggle
// console.log(this.state.toggle)

// if(this.state.toggle === false){
//   console.log("sup");
//   let index = this.state.challenges.indexOf(e.target.parentElement.textContent)
//   let chall = this.state.challenges;
//   this.setState({challenges: chall.splice(index,1)})
// }
// console.log(this.state)
// console.log(e.target.parentElement.textContent)}

// }/>{challenge}</span>