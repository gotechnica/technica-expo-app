
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Card from './Card.js';
import Table from './Table.js';
import SiteWrapper from './SiteWrapper.js';

class SearchandFilter extends Component {
    render(){
        return (
            <Card title="Search and Filter" content={
                <form>
                <div className="form-group">
                <input type="text" placeholder="Search for projects here" className="form-control" onChange={this.handleChange} name="input" />
                </div>
                <div className="form-row">
                <div className="col-4">
                <select className="form-control" id="sponsor" onChange={this.handleChange} name="selectSponsor">
                <option selected>Sponsor</option>
                <option>google</option>
                <option>facebook</option>
                </select>
                </div>
                <div className="col-4">
                <select className="form-control" id="project" onChange={this.handleChange} name="selectProduct">
                <option selected>Project</option>
                <option>login</option>
                <option>web</option>
                <option>design</option>
                <option>backend</option>
                </select>
                </div>
                <div className="col-4">
                <select className="form-control" id="challenges" onChange={this.handleChange} name="selectChallenges">
                <option selected>Challenges</option>
                <option>Google</option>
                <option>Facebook</option>
                </select>
                </div>
                </div>
                </form>
            }/>
        )
    }
}

export default SearchandFilter;