/* react components */
import React, { Component } from 'react';
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
      toggle: this.props.toggle
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount(){
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
      this.setState(()=>({challenges: challengeStore}))
      checks.style.backgroundColor="#b6a1c4";
    }
    //checks.checked = true;
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

  handleChange(color,e){
    // let change = this.state.toggle;
//   this.setState(({toggle : !change}))
console.log(e.target)
challengeStore = this.state.challenges;
console.log(color);
console.log(challengeStore)
if(color === true){
  console.log("sup");
  console.log(e.target.checked)
  let index = this.state.challenges.indexOf(e.target.textContent)
  console.log(index)
  challengeStore.splice(index,1)
}
else if(color === false){
  challengeStore.push(e.target.textContent);
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
              <label>Attempted Challenges</label>
              <br/>
              {this.state.challenges.map((challenge)=>{
                return(
                  <Checkbox toggle={this.state.toggle} handleChange={this.handleChange} value={challenge}></Checkbox>
                )
              })}
              </div>
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
    this.state = {color:true}
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e){
    this.setState((prevState)=>{
      console.log(prevState.color)
      return {color: !prevState.color}
    });
    this.props.handleChange(this.state.color,e);

  }

  render(){
   let color = this.state.color ? "pink" : "black";
   console.log(this.state);
   console.log(color)
    return(
       <span class="badge badge-primary check" className={color} onClick={(e)=>this.handleClick(e)}>{this.props.value}</span>
      //  <input type="checkbox" defaultChecked={true} onChange = {this.handleClick}/>
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
