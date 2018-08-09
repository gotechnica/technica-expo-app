
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
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    
    createChallengeArray(){
        let options = [];
        this.props.data.map((obj)=>{
            {obj.challenges.map((item)=>{
                options.push(item.challenge_name); 
            })}
    })
    console.log(options);
    return options;
    }
    
    handleChange(e){
        this.props.handleChange(e);
    }
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
                <select className="form-control" id="project" onChange={this.handleChange} name="selectProject">
                <option selected>Project</option>
                    {this.props.data.map((obj)=>{
                        return (
                            <option key={obj.table_number}>{obj.project_name}</option>
                        )
                    })}
                </select>
                </div>
                <div className="col-4">
                <select className="form-control" id="challenges" onChange={this.handleChange} name="selectChallenges">
                <option selected>Challenges</option>
                    {
                        this.createChallengeArray().map((obj,index)=>{
                            return(
                                <option key={index}>{obj}</option>
                            )
                        })
                    }
                </select>
                </div>
                </div>
                </form>
            }/>
        )
    }
}

export default SearchandFilter;

// <option selected>Project</option>
//                 <option>login</option>
//                 <option>web</option>
//                 <option>design</option>
//                 <option>backend</option>