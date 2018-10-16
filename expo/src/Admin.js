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
      textSearch: '',
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
      projectsCSV:'',
      uploadStatus:'',
      tableAssignmentStatus: '',
      tableAssignmentSchema: '',
      tableStartLetter: '',
      tableStartNumber: 0,
      tableEndLetter: '',
      tableEndNumber: 0,
      skipEveryOtherTable: true,
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
		e.preventDefault();

    const data = new FormData();
    data.append('projects_csv', this.projects_csv.files[0]);

    if (this.projects_csv.files[0] == null) {
      this.setState({
        uploadStatus: 'Please select a file before hitting upload!'
      });
    } else {
      axios.post(`${Backend.httpFunctions.url}parse_csv`, data)
        .then((response) => {
          this.projects_csv.value = ''; // Clear input field
          this.setState({ // Flash success message and clear input display
            uploadStatus: response.data,
            projectsCSV: ''
          });
        })
        .catch((error) => {
          this.setState({ // Flash error message
            uploadStatus: 'Oops! Something went wrong...'
          });
          console.error('Error:', error);
        });
    }
	}

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onAutoAssignTableNumbers(e) {
    e.preventDefault();
    if (this.state.tableAssignmentSchema == '') {
      this.setState({
        tableAssignmentStatus: 'Please first select a schema for assigning table numbers.',
      });
      return;
    }
    this.setState({
      tableAssignmentStatus: 'Processing your request to assign table numbers...',
    });
    axios.post(
      `${Backend.httpFunctions.url}api/projects/assign_tables`,
      {
        table_assignment_schema: this.state.tableAssignmentSchema,
        table_start_letter: this.state.tableStartLetter,
        table_start_number: parseInt(this.state.tableStartNumber),
        table_end_letter: this.state.tableEndLetter,
        table_end_number: parseInt(this.state.tableEndNumber),
        skip_every_other_table: this.state.skipEveryOtherTable,
      }
    )
      .then((response) => {
        this.setState({ // Flash success message
          tableAssignmentStatus: response.data,
          tableAssignmentSchema: '',
          tableStartLetter: '',
          tableStartNumber: 0,
          tableEndLetter: '',
          tableEndNumber: 0,
          skipEveryOtherTable: true,
        });
      })
      .catch((error) => {
        this.setState({ // Flash error message
          tableAssignmentStatus: 'Oops! Something went wrong...'
        });
        console.error('Error:', error);
      });
  }

  onRemoveAllTableAssignments(e) {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove ALL table assignments from your database?')) {
      this.setState({
        tableAssignmentStatus: 'Processing your request to remove table assignments...',
      });
      axios.post(`${Backend.httpFunctions.url}api/projects/clear_table_assignments`)
        .then((response) => {
          this.setState({ // Flash success message
            tableAssignmentStatus: response.data,
          });
        })
        .catch((error) => {
          this.setState({ // Flash error message
            tableAssignmentStatus: 'Oops! Something went wrong...'
          });
          console.error('Error:', error);
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
          <h4>Projects</h4>
        </div>

        <div className="card-body">
          <h5>Seed Database</h5>
          <form
            method="post"
            encType="multipart/form-data"
            onSubmit={this.onUploadCSVSubmitForm.bind(this)}
          >
            <div className="form-group">
              <label>Upload Devpost CSV for parsing</label><br/>
              <div className="upload-btn-wrapper">
                <button className="button button-primary font-weight-normal m-r-m"><FontAwesomeIcon icon="upload" className="upload_icon"></FontAwesomeIcon>Choose a file</button>
                <input type="file" id="file" name="projectsCSV" onChange={this.handleInputChange.bind(this)} ref={(ref) => { this.projects_csv = ref; }} />
                {this.state.projectsCSV.replace("C:\\fakepath\\", "")}
              </div>
            </div>
            <button className="button button-primary" type="submit">Upload</button>
            {this.state.uploadStatus != '' &&
              <div className="row col" style={{'padding-top': '1rem'}}>
                <i>{this.state.uploadStatus}</i>
              </div>
            }
          </form>

          <br/>
          <br/>

          <h5>Auto Assign Table Numbers</h5>
          <form
            method="post"
            onSubmit={this.onAutoAssignTableNumbers.bind(this)}
          >
            <div onChange={this.handleInputChange.bind(this)} style={{"margin-bottom": "1rem"}}>
              <div><input type="radio" name="tableAssignmentSchema" value="numeric" checked={this.state.tableAssignmentSchema=="numeric"} /> Numeric (1, 2, 3...)</div>
              <div><input type="radio" name="tableAssignmentSchema" value="odds" checked={this.state.tableAssignmentSchema=="odds"} /> Odds (1, 3, 5...)</div>
              <div><input type="radio" name="tableAssignmentSchema" value="evens" checked={this.state.tableAssignmentSchema=="evens"} /> Evens (2, 4, 6...)</div>
              <div><input type="radio" name="tableAssignmentSchema" value="custom" checked={this.state.tableAssignmentSchema=="custom"} /> Custom</div>
            </div>
            {this.state.tableAssignmentSchema === "custom" &&
            <div style={{"margin-bottom": "1rem"}}>
              <p>Enter the starting and ending/maximum alphanumeric combinations (e.g. A1 to Z15).</p>
              <div className="form-group custom-table-assignment-container">
                <input
                  type="text"
                  name="tableStartLetter"
                  className="form-control custom-table-assignment-child"
                  placeholder="ex: A"
                  onChange={this.handleInputChange.bind(this)}
                />
                <input
                  type="number"
                  name="tableStartNumber"
                  className="form-control custom-table-assignment-child"
                  placeholder="ex: 1"
                  onChange={this.handleInputChange.bind(this)}
                />
                to
                <input
                  type="text"
                  name="tableEndLetter"
                  className="form-control custom-table-assignment-child"
                  placeholder="ex: Z"
                  onChange={this.handleInputChange.bind(this)}
                />
                <input
                  type="number"
                  name="tableEndNumber"
                  className="form-control custom-table-assignment-child"
                  placeholder="ex: 15"
                  onChange={this.handleInputChange.bind(this)}
                />
              </div>
              <input
                name="skipEveryOtherTable"
                type="checkbox"
                checked={this.state.skipEveryOtherTable}
                onChange={this.handleInputChange.bind(this)}
              /> Skip every other table? (Provides more spacious expo)
            </div>}
            <button type="submit" className="button button-primary m-r-m">
              Assign Tables
            </button>
            <button className="button button-secondary" onClick={this.onRemoveAllTableAssignments.bind(this)}>
              Remove All Table Assignments
            </button>
            {this.state.tableAssignmentStatus != '' &&
              <div className="row col" style={{'padding-top': '1rem'}}>
                <i>{this.state.tableAssignmentStatus}</i>
              </div>
            }
          </form>

          <br/>
          <br/>

          <h5>Projects ({filteredProjects.length})</h5>
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
            <h4>Sponsors</h4>
          </div>
          <div className="card-body">
            <CreateSponsorModal
              createID="modalCreateSponsor"
              onCreate={this.loadCompanies.bind(this)}
              />
            <button className="button button-primary"
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
        // Get a data dump
        // sponsor - challenge - winner project names
        this.loadWinners();
        this.setState({
          showPreview: true
        });
      }
    }

    logout() {
      // Direct back to login page and end session
      Backend.httpFunctions.postCallback(Backend.httpFunctions.url + 'api/logout', {},
        this.props.history.push('/adminLogin') );
    }

    render() {

      let caret = this.state.showPreview ?
        <FontAwesomeIcon icon={faCaretUp} className="fa-caret-up"></FontAwesomeIcon>
        :
        <FontAwesomeIcon icon={faCaretDown} className="fa-caret-down"></FontAwesomeIcon>;

      return (
        <div className="card">
          <div className="card-header">
            <div className="d-flex">
              <div>
                <h5>Administration</h5>
              </div>
              <div className="ml-auto">
                <button type="button" className="link-button" onClick={(e)=>{
                    this.logout(e);
                  }}>Logout</button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex">
                <div>
                  <button type="button" className="link-button" onClick={()=>{this.toggleWinnerPreview()}}>
                    {!this.state.showPreview ?
                      "Preview Winners "
                      :
                      "Hide Winners "}
                    {caret}
                  </button>
                </div>
                <div className="ml-auto">
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

    // LF6K3G6RR3Q4VX4S
    componentWillMount() {
      // If not logged in, redirect to login page
      axios.get(Backend.httpFunctions.url + 'api/whoami')
        .then((response)=>{
          console.log("admin page attempt " +JSON.stringify(response));
          let credentials = response['data'];
          if(credentials == undefined || credentials.user_type != 'admin') {
            this.props.history.push({
             pathname: '/adminlogin'
            });
          }
        });
    }

    render() {
      const WinnerRouteModule = withRouter(WinnerModule);
      return (
        SiteWrapper(
          <div className="row">
            <div className="col">
              < WinnerRouteModule/>
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
