/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { withRouter } from 'react-router';

import SiteWrapper from './SiteWrapper.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload,
  faCaretDown,
  faCaretUp,
  faCheckSquare,
  faAllergies} from '../node_modules/@fortawesome/fontawesome-free-solid';
import { faSquare } from '../node_modules/@fortawesome/fontawesome-free-regular';
import CreateSponsorModal from './admin/CreateSponsorModal';
import CreateChallengeModal from './admin/CreateChallengeModal';
import EditSponsorModal from './admin/EditSponsorModal';
import EditChallengeModal from './admin/EditChallengeModal';
import EditProjectModal from './admin/EditProjectModal';
import axios from 'axios';
import './Admin.css';

library.add(faUpload);
library.add(faCaretDown);
library.add(faCaretUp);
library.add(faCheckSquare);
library.add(faSquare);

let Backend = require('./Backend.js');

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
      ],
      uploadStatus:'',
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
  onUploadCSVSubmitForm(e) {
		e.preventDefault()

    const data = new FormData();
    data.append('projects_csv', this.projects_csv.files[0]);

    if (this.projects_csv.files[0] == null) {
      this.setState({
        uploadStatus: 'Please select a file before hitting upload!'
      });
    } else {
      fetch(`${Backend.URL}parse_csv`, {
        method: 'POST',
        body: data,
      })
        .catch((error) => {
          this.state.uploadStatus = 'Oops! Something went wrong...'; // Flash success message
          console.error('Error:', error);
        })
        .then((response) => {
          return response.text();
        })
        .then((data) => {  // data = parsed version of the JSON from above endpoint.
          this.projects_csv.value = ''; // Clear input field
          this.setState({ // Flash success message
            uploadStatus: data
          });
        });
    }
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
          <form
            method="post"
            enctype="multipart/form-data"
            onSubmit={this.onUploadCSVSubmitForm.bind(this)}>
            <div className="form-group">
              <label>Upload CSV to Database</label>
              <input type="file" id="file" className="inputfile" name="projects_csv" ref={(ref) => { this.projects_csv = ref; }} />
              <label for="file"><FontAwesomeIcon icon="upload" className="upload_icon"></FontAwesomeIcon>Choose a file</label>
            </div>
            <button className="button button-primary" type="submit">Upload</button>
            {this.state.uploadStatus != '' &&
              <div className="row col" style={{'padding-top': '1rem'}}>
                {this.state.uploadStatus}
              </div>
            }
          </form>
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
          <button className="button button-primary"
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
                  <button className="link-button"
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

  constructor(props) {
    super(props);
    this.state = {
      textSearch:'',
      sponsors:[]
    }
  }

  loadCompanies() {
    Backend.httpFunctions.getAsync('api/companies', (sponsors) => {
      this.setState({
        sponsors: JSON.parse(sponsors)
      })
    });
  }

  // Pull data for sponsor list
  componentWillMount() {
    this.loadCompanies();
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
            challenges: [],
            id: elt.company_id
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
      if(elt.challenge_name != undefined) {
        current_sponsor.challenges.push({
          challenge: elt.challenge_name,
          id: elt.challenge_id,
          num_winners: elt.num_winners
        });
      }

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

    // Sort Sponsors
    filteredSponsors.sort((s1, s2) => {
      return (s1.company_name).localeCompare(s2.company_name); });

      return (
        <div className="card">
          <div className="card-header">
            <h5>Sponsors</h5>
          </div>
          <div className="card-body">
            <CreateSponsorModal
              createID="modalCreateSponsor"
              onCreate={this.loadCompanies.bind(this)}
              />
            <button className="link-button"
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
                          sponsorID={elt.id}
                          onEdit={this.loadCompanies.bind(this)}
                          />
                        <button className="link-button"
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

                          <CreateChallengeModal
                            createID={"modalCreateChallenge"+key.toString()}
                            company={elt.company_name}
                            sponsorID={elt.id}
                            onCreate={this.loadCompanies.bind(this)}
                            />
                          <button className="link-button"
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
                          {
                            console.log(challenge)
                          }
                          <EditChallengeModal
                            createID={"modalEditChallenge"+elt.access_code.toString()+i.toString()}
                            challengeTitle={challenge.challenge}
                            numWinners={challenge.num_winners}
                            challengeID={challenge.id}
                            sponsorID={elt.id}
                            onCreate={this.loadCompanies.bind(this)}
                            />
                          <button className="link-button"
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

  class WinnerModule extends Component {

    constructor(props) {
      super(props);
      this.state = {
        showPreview: false,
        data: [],
        winnersRevealed: false
      }
    }

    loadWinners() {
      // toggle based on state

      // Pull data, add to state, and show
      axios.get(Backend.httpFunctions.url + 'api/companies')
        .then(response1 => {

          let sponsors = response1['data'];

          axios.get(Backend.httpFunctions.url + 'api/projects')
            .then(response2 => {

              console.log(response2['data']);

              let projects = response2['data']['projects'].filter(elt => {
                return elt.challenges_won != undefined
                  && elt.challenges_won.length > 0;
              });

              //Build sponsor - challenge - winners struct
              let data = sponsors.filter(elt => {
                return elt.challenge_name != undefined
                  && elt.winners != undefined && elt.winners.length > 0;
              }).map(elt => {

                // elt.winners => winner IDs
                // for each project, if proj.challenges_won contains elt.challenge_id
                // add proj.project_name to winners
                let winners = [];
                for(let i = 0; i < projects.length; i++) {
                  if(projects[i].challenges_won.includes(elt.challenge_id)) {
                    winners.push(projects[i].project_name);
                  }
                }

                return {
                  sponsor: elt.company_name,
                  challenge: elt.challenge_name,
                  winners: winners
                }
              });

              this.setState({
                data: data.sort((s1, s2) => {
                  return (s1.sponsor_name).localeCompare(s2.sponsor_name); })
              });

            });

        });
    }

    toggleWinnerPreview() {
      if(this.state.showPreview) {
        this.setState({
          showPreview: false
        });
      } else {
        this.loadWinners();
        this.setState({
          showPreview: true
        });
      }
    }

    componentWillMount() {
      // Get a data dump
      // sponsor - challenge - winner project names
      // Get sponsors, then projects
      this.loadWinners();
    }

    // TODO correct context of function call for login here :^(
    moveToLogin() {
      this.props.history.push('/adminLogin');
    }

    logout() {
      // Direct back to login page
      Backend.httpFunctions.postCallback(Backend.httpFunctions.url + 'api/logout', {},
        this.moveToLogin());
    }

    render() {

      let caret = this.state.showPreview ?
        <FontAwesomeIcon icon={faCaretUp} className="fa-caret-up"></FontAwesomeIcon>
        :
        <FontAwesomeIcon icon={faCaretDown} className="fa-caret-down"></FontAwesomeIcon>;

      return (
        <div className="card">
          <div className="card-header">
            <div class="d-flex">
              <div>
                <h5>Administration</h5>
              </div>
              <div class="ml-auto">
                <button type="button" className="link-button" onClick={(e)=>{
                    this.logout(e);
                  }}>Logout</button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div class="d-flex">
                <div>
                  <button type="button" className="link-button" onClick={()=>{this.toggleWinnerPreview()}}>
                    {!this.state.showPreview ?
                      "Preview Winners "
                      :
                      "Hide Winners "}
                    {caret}
                  </button>
                </div>
                <div class="ml-auto">
                  {this.state.winnersRevealed ?
                    <button type="button" className="button button-secondary">
                      Hide Public Winners
                    </button>
                    :
                    <button type="button" className="button button-primary">
                      Reveal Public Winners
                    </button>
                  }
                </div>
           </div>

           {
             this.state.showPreview ?
               this.state.data.length == 0 ?
                 "No winners have been selected"
                 :
                 this.state.data.map(elt => {
                   return (<div>
                     {elt.sponsor + " - " + elt.challenge + " - " + elt.winners.join(", ")}
                   </div>);
                 })
               :
               ""
           }

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
              <WinnerModule/>
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
