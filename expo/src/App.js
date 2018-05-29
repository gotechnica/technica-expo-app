import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav class="navbar">
          <a class="navbar-brand" href="#">
            <img src={require('./technica-logo-white.svg')}
              alt="Technica Logo" height="50px"/>
          </a>
        </nav>
      </div>
    );
  }
}

export default App;
