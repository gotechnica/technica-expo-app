/* react components */
import React, { Component } from 'react';
import Error from '../Error';
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
      challenges: this.props.challenges,
      allChallenges: this.props.allChallenges,
      erorr: false,
      challenge_error: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleState = this.handleState.bind(this)
  }
  componentWillMount(){
    this.state.challenges.map((challenge)=>{
      challengeStore.push(challenge);
    })
    console.log(challengeStore);
  }
  saveProject(e){
    let valid = true;
    let checks = document.querySelector('.black');
    console.log(checks);
    
    //checks.checked = true;
    let input = document.querySelector('.input');
    console.log(input);
    console.log(this.state.challenges);
    let missing  = this.state.project_name === '' || 
    this.state.table_number === '' || 
    this.state.project_url === ''
    let check=0;    
    for(let i=0;i<this.state.challenges.length;i++){
      if(this.state.challenges[i])
        check++;
    }
    let challenge = check > 0 ? false : true;
    if(missing || challenge)
      valid = false;
    else{
      this.setState({erorr:false})
      this.setState({challenge_error:false})
    }
    console.log(valid);
    if(valid) {
      // TODO: Send access code and company name to db if valid access code
      // TODO: Update state against db change
      // Close modal
      if(checks){
        this.setState({challenges: challengeStore})
      }
      console.log(this.state.erorr)
      document.getElementById("btnCancelEditProjectModal" + this.props.editID).click();
    } else {
      // Show errors
        if(missing)
        this.setState({erorr:true});
        else
        this.setState({challenge_error:true})
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
  handleChange(color,index,e){
console.log(e.target)
console.log(index);
let allChallenges = this.state.allChallenges;
challengeStore = this.state.challenges;
console.log(color);
if(color === true){
  // console.log("sup");
  // console.log(e.target.textContent)
  // let word = e.target.textContent;
  // word = word.trim();
  // console.log(word)
  // let index = this.state.challenges.indexOf(word)
  // let index_all = this.state.allChallenges.indexOf(word);
  // console.log(index)
  // challengeStore.splice(index,1);
  // console.log(challengeStore)
  challengeStore[index] = undefined;
}
else if(color === false){
  let word = e.target.textContent;
  word = word.trim();
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
              <input className="form-control input" type="text" value={this.state.project_name.toString()} onChange = {(event) => this.setState({project_name:event.target.value})}/>
              </div>
              <div className="form-group">
              <label>Table Number</label>
              <input className="form-control" type="text" value={this.state.table_number.toString()} onChange = {(event) => this.setState({table_number:event.target.value})}/>
              </div>
              <div className="form-group">
              <label>Project URL</label>
              <input className="form-control" type="text" value={this.state.project_url.toString()} onChange = {(event) => this.setState({project_url:event.target.value})}/>
              </div>
              {this.state.erorr ? <Error text = "One or more fields are empty!"></Error>: ''}
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
              {this.state.challenges.map((challenge,index)=>{
                if(challenge!==undefined){
                console.log(challenge)
                return(
                  <Checkbox handleChange={this.handleChange} value={challenge} ref={instance => { this.Checkbox = instance; }} check={true} id={index}></Checkbox>
                )
              }
              })}
              </div>
              <br/>
              {this.state.challenge_error ? <Error text = "Select atleast one challenge"></Error>: ''}
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="button button-secondary" id={"btnCancelEditProjectModal"+this.props.editID} data-dismiss="modal">Cancel</button>
              <button type="button" className="button button-primary"  onClick={(event) => {
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
    console.log(this)
    this.props.handleChange(this.state.color,this.props.id,e);
  }

  changeState(checkbox){
    console.log(this)
    this.setState({color:true});
    console.log(this)
  }

  render(){
    console.log(this)
   let color = this.state.color ? "pink" : "black";
   let icon = this.state.color ? "check" : "times";
   console.log(this);
   console.log(color)
    return(
       <span class="badge badge-primary check" id ={this.props.id} className={color} onClick={(e)=>this.handleClick(e)}><FontAwesomeIcon icon={icon}></FontAwesomeIcon> {this.props.value}</span>
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
      <span class="badge badge-primary all" onClick={(e)=>this.handleClick(e)}>{this.props.value}</span>
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
// onChange = {(event) => this.setState({project_name:event.target.value})}