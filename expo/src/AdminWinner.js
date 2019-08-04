import React, { Component } from "react";
import axiosRequest from "./Backend.js";

import "./Admin.css";
import "./App.css";
import WinnerBadge from "./imgs/winner_ribbon.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faSquare } from "../node_modules/@fortawesome/fontawesome-free-regular";
import { faCaretDown, faCaretUp, faCheckSquare, faUpload } from "../node_modules/@fortawesome/fontawesome-free-solid";
library.add(faUpload);
library.add(faCaretDown);
library.add(faCaretUp);
library.add(faCheckSquare);
library.add(faSquare);


class WinnerModule extends Component {

    constructor(props) {
      super(props);
      this.state = {
        showPreview: false,
        data: [],
        expoIsPublished: false,
        winnersRevealed: false,
        missingWinners: [],
      };
    }
  
    componentWillMount() {
      axiosRequest.get("api/is_published_status")
        .then((status) => {
          this.setState({
            expoIsPublished: status == "True",
          });
        });
      axiosRequest.get("api/publish_winners_status")
        .then((status) => {
          this.setState({
            winnersRevealed: status == "True",
          });
        });
    }
  
    loadWinners() {
      // toggle based on state
  
      // Pull data, add to state, and show
      axiosRequest.get("api/companies")
        .then((sponsors) => {
          let projects = this.props.projects.filter(elt => {
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
            for (let i = 0; i < projects.length; i++) {
              if (projects[i].challenges_won.includes(elt.challenge_id)) {
                winners.push(projects[i].project_name);
              }
            }
  
            return {
              sponsor: elt.company_name,
              challenge: elt.challenge_name,
              winners: winners,
            };
          });
  
          // Build list of sponsor - challenges without winners
          let missingWinners = sponsors.filter(elt => {
            return elt.challenge_name != undefined
              && elt.winners.length == 0;
          }).map(elt => {
            return {
              sponsor: elt.company_name,
              challenge: elt.challenge_name,
            };
          });
  
          /*this.setState({
            data: data.sort((s1, s2) => {
              if(s1.sponsor_name == undefined || s1.sponsor_name == undefined) {
                return 0;
              }
  
              return (s1.sponsor_name).localeCompare(s2.sponsor_name); })
          });*/
  
          this.setState({
            data: data.sort((s1, s2) => {
              if (s1.sponsor == undefined || s1.sponsor == undefined) {
                return 0;
              }
              return (s1.sponsor).localeCompare(s2.sponsor);
            }),
            missingWinnerData: missingWinners.sort((s1, s2) => {
              if (s1.sponsor == undefined || s1.sponsor == undefined) {
                return 0;
              }
              return (s1.sponsor).localeCompare(s2.sponsor);
            }),
          });
  
        });
    }
  
    toggleWinnerPreview() {
      if (this.state.showPreview) {
        this.setState({
          showPreview: false,
        });
      } else {
        // Get a data dump
        // sponsor - challenge - winner project names
        this.loadWinners();
        this.setState({
          showPreview: true,
        });
      }
    }
  
    publishExpo() {
      axiosRequest.post("api/is_published_status", {
        "is_published": true,
      }).then((data) => {
        this.setState({
          expoIsPublished: true,
        });
      });
    }
  
    unpublishExpo() {
      axiosRequest.post("api/is_published_status", {
        "is_published": false,
      }).then((data) => {
        this.setState({
          expoIsPublished: false,
        });
      });
    }
  
    showWinners() {
      axiosRequest.post("api/publish_winners_status", {
        "publish_winners": true,
      }).then((data) => {
        this.setState({
          winnersRevealed: true,
        });
      });
    }
  
    hideWinners() {
      axiosRequest.post("api/publish_winners_status", {
        "publish_winners": false,
      }).then((data) => {
        this.setState({
          winnersRevealed: false,
        });
      });
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
                <h4>Administration</h4>
              </div>
              <div className="ml-auto">
                <button
                  type="button"
                  className="link-button"
                  onClick={this.props.logout}
                >
                  Logout
                  </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div>
              {this.state.expoIsPublished ?
                <button type="button" className="button button-secondary m-r-m m-b-m"
                  onClick={() => { this.unpublishExpo(); }}>
                  Unpublish Expo
                </button>
                :
                <button type="button" className="button button-primary m-r-m m-b-m"
                  onClick={() => { this.publishExpo(); }}>
                  Go Live!
                </button>
              }
              {this.state.winnersRevealed ?
                <button type="button" className="button button-secondary"
                  onClick={() => { this.hideWinners(); }}>
                  Hide Public Winners
                 </button>
                :
                <button type="button" className="button button-primary"
                  onClick={() => { this.showWinners(); }}>
                  Reveal Public Winners
                 </button>
              }
            </div>
            <br />
            <div>
              <button type="button" className="link-button" onClick={() => { this.toggleWinnerPreview(); }}>
                {!this.state.showPreview ?
                  "Preview Winners "
                  :
                  "Hide Winners "}
                {caret}
              </button>
            </div>
            <br />
  
            {
              this.state.showPreview ?
                <h5>
                  <img src= {WinnerBadge} className="Ribbon" height="30px" width="30px" />
                  NO WINNERS SUBMITTED
                  <img src= {WinnerBadge} className="Ribbon" height="30px" width="30px" />
                </h5>
                : ""
            }
  
            {
              this.state.showPreview ?
                this.state.data.length == 0 ?
                  "No winners have been selected"
                  :
                  this.state.missingWinnerData.map(elt => {
                    return (
                      <div>
                        {`[${elt.sponsor}] ${elt.challenge}`}
                        <br />
                        <br />
                      </div>
                    );
                  })
                :
                ""
            }
  
            {
              this.state.showPreview ?
                <h5>
                  <img src= {WinnerBadge} className="Ribbon" height="30px" width="30px" />
                  SUBMITTED WINNERS
                  <img src= {WinnerBadge} className="Ribbon" height="30px" width="30px" />
                </h5>
                : ""
            }
  
            {
              this.state.showPreview ?
                this.state.data.length == 0 ?
                  "No winners have been selected"
                  :
                  this.state.data.map(elt => {
                    return (
                      <div>
                        {`[${elt.sponsor}] ${elt.challenge} - ${elt.winners.join(", ")}`}
                        <br />
                        <br />
                      </div>
                    );
                  })
                :
                ""
            }
  
          </div>
        </div>
      );
    }
  
  }

  export default WinnerModule;