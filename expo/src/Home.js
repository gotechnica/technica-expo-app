/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

/* custom components */
import Card from './Card.js';
import Table from './Table.js';
import SiteWrapper from './SiteWrapper.js';


class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data:  [
        {
          project: "login",
          url: "https//",
          table: '1',
          challenges: ["google","facebook"]
        },
        {
          project: "web",
          url: "https//",
          table: '2',
          challenges: ["google","facebook"]
        },
        {
          project: "design",
          url: "https//",
          table: '3',
          challenges: ["google","facebook"]
        },
        {
          project: "backend",
          url: "https//",
          table: '4',
          challenges: ["google"]
        }  
      ],
      workingdata:[],
      value:''
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e){
    console.log(e.target.name)
    if(e.target.name === 'input'){
    let val =(e.target.value)
    let updatedList = this.state.data;
    updatedList = updatedList.filter((item)=>{
      return item.project.toLowerCase().indexOf(val.toLowerCase()) !==-1;
    });
    
    this.setState(()=>{
      return({
        workingdata: updatedList
      }
      )
    })
  }
  else if (e.target.name==="selectProduct"){
    let val = e.target.value
    let updatedList = this.state.data;
    updatedList = updatedList.filter((item)=>{
      if(val==="Project")
      return true
      else
      return item.project.includes(val)
    })

    this.setState(()=>{
      return({
        workingdata: updatedList
      }
      )
    })
  }
  else if (e.target.name==="selectChallenges"){
    let val = e.target.value
    let updatedList = this.state.data;
    updatedList = updatedList.filter((item)=>{
      if(val==="Challenges")
      return true
      else{
      return item.challenges.indexOf(val.toLowerCase()) >-1
      }
    })

    this.setState(()=>{
      return({
        workingdata: updatedList
      }
      )
    })
  }
}
  componentWillMount(){
    this.setState({
      workingdata: this.state.data
    })
  }
  render(){ 
    return(
  SiteWrapper(
    <div class="Home">
      <div class="row">
        <div class="col">
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
        </div>
      </div>
      <div class="row">
        <div class="col">
          <Table data={this.state.workingdata} value={this.state.value} />
        </div>
      </div>
    </div>
  )
);
}
}

export default Home;
