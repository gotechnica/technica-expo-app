import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Card.css';

class Card extends Component {
  render() {
    return (
      <div class="card">
        <div class="card-header">
          <h5>{this.props.title}</h5>
        </div>
        <div class="card-body">
          <p class="card-text">{this.props.content}</p>
        </div>
      </div>
    );
  }
}

export default Card;
