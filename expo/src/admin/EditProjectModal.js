/* react components */
import React, { Component } from 'react';

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
      challenges: this.props.challenges
    }
  }
  saveProject(e){
    let valid = true;

    if(valid) {
      // TODO: Send access code and company name to db if valid access code
      // TODO: Update state against db change
      
      // Close modal
      document.getElementById("btnCancelEditProjectModal" + this.props.editID).click();
    } else {
      // Show errors
      this.setState({invalid_access: true});
    }
    console.log(this.state)
  }

  render() {
   let toggle = true;
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
              <input className="form-control" type="text" value={this.state.project_url.toString()} onChange = {(event) => this.setState({table_number:event.target.value})}/>
              </div>
              <div className="form-group">
              <label>Attempted Challenges</label>
              <br/>
              {this.state.challenges.map((challenge,place)=>{
                return(
                  <span class="badge badge-primary"><input type="checkbox" defaultChecked={toggle} onChange = {(e)=>{
                    toggle = !toggle
                  console.log(this.state)
                  if(toggle === false){
                    console.log("sup");
                    let index = this.state.challenges.indexOf(e.target.parentElement.textContent)
                    let chall = this.state.challenges;
                    this.setState({challenges: chall.splice(index,1)})
                  }
                  console.log(this.state)
                console.log(e.target.parentElement.textContent)}
               
              }/>{challenge}</span>
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

export default EditProjectModal;
