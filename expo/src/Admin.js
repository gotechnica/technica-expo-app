/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';

// TODO Pass sponsor and project IDs to the modals
// TODO Connect actual data to project and sponsor state
import CreateSponsorModal from './admin/CreateSponsorModal';
import CreateChallengeModal from './admin/CreateChallengeModal';
import EditSponsorModal from './admin/EditSponsorModal';
import EditChallengeModal from './admin/EditChallengeModal';
import EditProjectModal from './admin/EditProjectModal';

import './Admin.css';
import { faAllergies } from '@fortawesome/fontawesome-free-solid';

/* Admin page content (see PRD) */

/* Project panel of admin page */
class ProjectModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textSearch:'',
      projects:[
        {project_name: 'cat', table_number: '1',url:'www.hello.com',challenge_name:'challenge1'},
        {project_name: 'cat', table_number: '1',url:'www.hello.com',challenge_name:'challenge2'},
        {project_name: 'cat', table_number: '1',url:'www.hello.com',challenge_name:'challenge3'},
        {project_name: 'dog', table_number: '3',url:'www.hello.com',challenge_name:'challenge1'},
        {project_name: 'dog', table_number: '3',url:'www.hello.com',challenge_name:'challenge4'},
        {project_name: 'apple', table_number: '5',url:'www.hello.com',challenge_name:'challenge1'},
        {project_name: 'peaches', table_number: '7',url:'www.hello.com',challenge_name:'challenge1'},
        {project_name: 'small', table_number: '9',url:'www.hello.com',challenge_name:'challenge1'},
      ]
    }
    // this.createAllChallenges = this.createAllChallenges.bind(this);
  }
  createAllChallenges(obj){
    console.log(obj)
    let allChallenges = [];
    obj.map((item)=>{
      console.log(item.challenges)
      item.challenges.map((challenge)=>{
        if(allChallenges.indexOf(challenge)===-1)
          allChallenges.push(challenge);
      })
    })
    return allChallenges;
  }
  sortData(){
    let data = this.state.projects;
    let finalProjectsData = [];
    let seen = undefined;
    data.map((obj)=>{
      if(obj.table_number !== seen){
        finalProjectsData.push(
          {
            project_name: obj.project_name,
            table_number: obj.table_number,
            url: obj.url,
            challenges: [obj.challenge_name],
            checkVal: true
          }
        )
      }
      else{
        finalProjectsData.map((item)=>{
          if(item.table_number === seen){
            item.challenges.push(obj.challenge_name);
          }
        })
      }
     seen = obj.table_number;
    })
    console.log("aassa",finalProjectsData)
    this.createAllChallenges(finalProjectsData);
    return finalProjectsData;
  }

  render() {
    console.log(this.sortData())
    let filteredProjects = this.sortData();
    let allChallenges = this.createAllChallenges(filteredProjects);
    console.log("ass",allChallenges);
    if(this.state.textSearch != '' && this.state.textSearch != undefined) {
      filteredProjects = filteredProjects.filter(elt =>
        elt.project_name.includes(this.state.textSearch) ||
        elt.table_number.includes(this.state.textSearch)
      );
    }

    return (
      <div className="card">
        <div className="card-header">
          <h5>Projects</h5>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label>Upload CSV to Database</label>
            <input type="file"
              id="fileProjCSV"
              />
          </div>
          <button className="btn btn-primary"
            onClick={(event) => {
              //TODO pass file to DB
              alert("upload file click");
            }}>
            Upload
          </button>
          <br/>
          <br/>
          <div className="custom-control custom-radio">
            <input type="radio" id="table2" className="custom-control-input"/>
            <label className="custom-control-label" >Numeric (1, 2, 3...)</label>
          </div>
          <div className="custom-control custom-radio">
            <input type="radio" id="table1" className="custom-control-input"/>
            <label className="custom-control-label" >Odd (1, 3, 5...)</label>
          </div>
          <div className="custom-control custom-radio">
            <input type="radio" id="table3" className="custom-control-input"/>
            <label className="custom-control-label" >Alternative</label>
          </div>
          <br/>
          <button className="btn btn-primary"
            onClick={(event) => {
              //TODO set table assignment
              alert("assign table click");
            }}>
            Assign Tables
          </button>
          <br/>
          <br/>
          <div className="form-group">
            <input type="text"
              id="txtProjectSearch"
              className="form-control"
              placeholder="Search for a project name..."
              onChange = {(event) => this.setState({textSearch:event.target.value})}
              />
          </div>
          <div className="row">
            <div className="col">
              Project
            </div>
            <div className="col">
              Table
            </div>
            <div className="col">

            </div>
          </div>
          {filteredProjects.map((elt,index) => {
            console.log(elt.checkVal);
            return (
              <div className="row" key={index}>
                <div className="col">
                  {elt.project_name}
                </div>
                <div className="col">
                  {elt.table_number}
                </div>
                <div className="col">
                  <EditProjectModal
                    editID={"modalEditProject"+index.toString()}
                    projectID="0"
                    project_name= {elt.project_name}
                    project_table = {elt.table_number}
                    url = {elt.url}
                    challenges = {elt.challenges}
                    toggle = {elt.checkVal}
                    allChallenges = {allChallenges}
                    />
                  <button className="sponsor-button"
                    type="button"
                    data-toggle="modal"
                    data-target={"#modalEditProject"+index.toString()}
                    >
                    Edit
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

/* Sponsor side of admin page */
class SponsorModule extends Component {

  // TODO Add actual data as sponsor list
  constructor(props) {
    super(props);
    this.state = {
      textSearch:'',
      sponsors:[
        {_id: 1, access_code: 1, company_name: 'Cat', challenge_name: 'challenge1', num_winners: 1},
        {_id: 1, access_code: 2, company_name: 'Dog', challenge_name: 'challenge2', num_winners: 2},
        {_id: 1, access_code: 2, company_name: 'Dog', challenge_name: 'challenge3', num_winners: 3},
        {_id: 1, access_code: 2, company_name: 'Dog', challenge_name: 'challenge4', num_winners: 2},
        {_id: 1, access_code: 3, company_name: 'Apple', challenge_name: 'challenge5', num_winners: 1},
        {_id: 1, access_code: 4, company_name: 'Peaches', challenge_name: 'challenge6', num_winners: 2},
        {_id: 1, access_code: 4, company_name: 'Peaches', challenge_name: 'challenge7', num_winners: 3},
        {_id: 1, access_code: 5, company_name: 'Small', challenge_name: 'challenge8', num_winners: 2},
        {_id: 1, access_code: 5, company_name: 'Small', challenge_name: 'challenge9', num_winners: 1},
        {_id: 1, access_code: 5, company_name: 'Small', challenge_name: 'challenge10', num_winners: 2},
        {_id: 1, access_code: 5, company_name: 'Small', challenge_name: 'challenge11', num_winners: 3},
        {_id: 1, access_code: 5, company_name: 'Small', challenge_name: 'challenge12', num_winners: 2},
        {_id: 1, access_code: 5, company_name: 'Small', challenge_name: 'challenge13', num_winners: 1},
      ]
    }
  }

  render() {

    // Compress list by access_code to suit view
    let compressedSponsors = [];
    this.state.sponsors.forEach(elt => {
      // Check whether code is unique
      let codeSeen = false;
      compressedSponsors.forEach((sponsor)=> {
        if (sponsor.access_code == elt.access_code) {
          codeSeen = true;
        }
      });

      if (codeSeen == false) {
        // Set new item
        compressedSponsors.push(
          {
            access_code: elt.access_code,
            company_name: elt.company_name,
            challenges: []
          }
        );
      }

      // Add challenge to corresponding sponsor
      let current_sponsor = null;
      compressedSponsors.forEach((sponsor) => {
        if(sponsor.access_code == elt.access_code) {
          current_sponsor = sponsor;
        }
      });
      current_sponsor.challenges.push({
        challenge: elt.challenge_name,
        id: elt._id,
        num_winners: elt.num_winners
      });
    });

    // Prepare sponsor list against filter (including sponsor name and challenges)
    let filteredSponsors = compressedSponsors;
    if(this.state.textSearch != '' && this.state.textSearch != undefined) {
      filteredSponsors = filteredSponsors.filter(elt => {

        let casedTextSearch = this.state.textSearch.toUpperCase()

        let chalSearch = false;
        elt.challenges.forEach(chal => {
          if (chal.challenge.toUpperCase().includes(casedTextSearch)) {
            chalSearch = true;
          }
        });
        return elt.company_name.toUpperCase().includes(casedTextSearch)
          || chalSearch;
      });
    }

      return (
        <div className="card">
          <div className="card-header">
            <h5>Sponsors</h5>
          </div>
          <div className="card-body">
            <CreateSponsorModal
              createID="modalCreateSponsor"
              />
            <button className="sponsor-button"
              type="button"
              data-toggle="modal"
              data-target="#modalCreateSponsor"
              >
              Create New Sponsor
            </button>
            <br/>
            <br/>
            <div className="form-group">
              <input type="text"
                id="txtSponsorSearch"
                className="form-control"
                placeholder="Search for a sponsor or challenge name..."
                onChange = {(event) => this.setState({textSearch:event.target.value})}
                />
            </div>
            {filteredSponsors.map((elt,key) => {
              return (
                <div className="sponsor-card" key={key}>
                  <div>
                    <div className="d-flex">
                      <h5>
                        {elt.company_name}
                      </h5>
                      <span className="ml-auto">
                        <EditSponsorModal
                          editID={"modalEditSponsor"+key.toString()}
                          sponsorCode={elt.access_code}
                          sponsorName={elt.company_name}
                          />
                        <button className="sponsor-button"
                          type="button"
                          data-toggle="modal"
                          data-target={"#modalEditSponsor"+key.toString()}
                          >
                          Edit Details
                        </button>
                      </span>
                    </div>

                      <div className="d-flex">
                        <span className="sponsor-subhead">
                          {elt.company_name + "'s challenges"}
                        </span>
                        <span className="ml-auto">
                          <EditSponsorModal
                            editID={"modalEditSponsor"+key.toString()}
                            sponsorCode={elt.access_code}
                            sponsorName={elt.company_name}
                            />

                          <CreateChallengeModal
                            createID={"modalCreateChallenge"+key.toString()}
                            company={elt.company_name}/>
                            <button className="sponsor-button"
                              type="button"
                              data-toggle="modal"
                              data-target={"#modalCreateChallenge"+key.toString()}
                              >
                              Create Challenge
                            </button>

                        </span>
                      </div>

                    {elt.challenges.map((challenge,i) => {
                      return (
                        <div>
                          {(i+1).toString() + ") " + challenge.challenge + " "}

                          <EditChallengeModal
                            createID={"modalEditChallenge"+elt.access_code.toString()+i.toString()}
                            challengeTitle={challenge.challenge}
                            numWinners={challenge.num_winners}
                            />
                          <button className="sponsor-button"
                            type="button"
                            data-toggle="modal"
                            data-target={"#modalEditChallenge"+elt.access_code.toString()+i.toString()}
                            >
                            Edit
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <hr/>
                </div>
              )
            })}
          </div>
        </div>
      );
    }
  }

  /* Final class containing admin page */
  class Admin extends Component {
    render() {
      return (
        SiteWrapper(
          <div className="row">
            <div className="col">
              <SponsorModule/>
            </div>
            <div className="col">
              <ProjectModule/>
            </div>
          </div>
        )
      );
    }
  }

  export default Admin;
