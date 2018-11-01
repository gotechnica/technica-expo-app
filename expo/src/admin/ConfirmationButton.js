import React, { Component } from 'react';

class ConfirmationButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
      <p className="warning-text">Are you sure yuou want to delete the project {this.props.project_name}?</p>
      <button className = "button button-primary yes" onClick = {this.props.deleteProject}>Yes</button>
      <button className = "button button-secondary no" onClick = {this.props.showConfirmation}>No</button>
      </div>
    )
  }
}

export default ConfirmationButton;