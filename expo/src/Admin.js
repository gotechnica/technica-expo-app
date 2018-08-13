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
import EditSponsorModal from './admin/EditSponsorModal';
import EditProjectModal from './admin/EditProjectModal';

import './Admin.css';

/* Admin page content (see PRD) */

/* Project panel of admin page */
class ProjectModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textSearch:'',
      projects:[
        {project_name: 'cat', table_number: '1'},
        {project_name: 'dog', table_number: '3'},
        {project_name: 'apple', table_number: '5'},
        {project_name: 'peaches', table_number: '7'},
        {project_name: 'small', table_number: '9'},
      ]
    }
  }

  render() {

    let filteredProjects = this.state.projects;
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
                    editID="modalEditProject"
                    projectID="0"
                    />
                  <button className="btn btn-primary"
                    type="button"
                    data-toggle="modal"
                    data-target="#modalEditProject"
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
        {_id: 1, access_code: 1, company_name: 'cat', challenge_name: 'challenge1'},
        {_id: 1, access_code: 2, company_name: 'dog', challenge_name: 'challenge2'},
        {_id: 1, access_code: 2, company_name: 'dog', challenge_name: 'challenge3'},
        {_id: 1, access_code: 2, company_name: 'dog', challenge_name: 'challenge4'},
        {_id: 1, access_code: 3, company_name: 'apple', challenge_name: 'challenge5'},
        {_id: 1, access_code: 4, company_name: 'peaches', challenge_name: 'challenge6'},
        {_id: 1, access_code: 4, company_name: 'peaches', challenge_name: 'challenge7'},
        {_id: 1, access_code: 5, company_name: 'small', challenge_name: 'challenge8'},
        {_id: 1, access_code: 5, company_name: 'small', challenge_name: 'challenge9'},
        {_id: 1, access_code: 5, company_name: 'small', challenge_name: 'challenge10'},
        {_id: 1, access_code: 5, company_name: 'small', challenge_name: 'challenge11'},
        {_id: 1, access_code: 5, company_name: 'small', challenge_name: 'challenge12'},
        {_id: 1, access_code: 5, company_name: 'small', challenge_name: 'challenge13'},
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
        id: elt._id
      });
    });

    // Prepare sponsor list against filter (including sponsor name and challenges)
    let filteredSponsors = compressedSponsors;
    if(this.state.textSearch != '' && this.state.textSearch != undefined) {
      filteredSponsors = filteredSponsors.filter(elt => {

        let chalSearch = false;
        elt.challenges.forEach(chal => {
          if (chal.challenge.includes(this.state.textSearch)) {
            chalSearch = true;
          }
        });
        return elt.company_name.includes(this.state.textSearch)
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
            <button className="btn btn-primary"
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
                <div className="d-flex" key={key}>
                  <div className="">
                    <b>{elt.company_name}</b>
                    <br/>
                    {elt.challenges.map(challenge => {
                      return (
                        <div className="sponsor-challenge">
                          {challenge.challenge}
                        </div>
                      )
                    })}
                  </div>
                  <div className="ml-auto">
                    <EditSponsorModal
                      editID={"modalEditSponsor"+key.toString()}
                      sponsorCode={elt.access_code}
                      sponsorName={elt.company_name}
                      />
                    <button className="btn btn-primary"
                      type="button"
                      data-toggle="modal"
                      data-target={"#modalEditSponsor"+key.toString()}
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
