
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import axios from 'axios'

import Card from './Card.js';
import Table from './Table.js';
import NewTable from './NewTable.js';

import SiteWrapper from './SiteWrapper.js';
import './SliderOption.css';
import { VotingTable, WelcomeHeader } from './Sponsor';

const CHALLENGES = [
  { company_id: 'C0',
    access_code: '00000',
    company_name: 'Booz Allen Hamilton',
    challenge_name: 'Best ML/AI Hack',
    num_winners: 3,
    winners: ['P4','P7', 'P8']
  },
  { company_id: 'C1',
    access_code: '11111',
    company_name: 'Booz Allen Hamilton',
    challenge_name: 'Best Hack to Help in a Crisis',
    num_winners: 2,
    winners: []
  },
  { company_id: 'C2',
    access_code: '11111',
    company_name: 'Booz Allen Hamilton',
    challenge_name: 'Best Data Science Hack',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C3',
    access_code: '33333',
    company_name: 'Mantech',
    challenge_name: 'Cybersecurity Hack',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C4',
    access_code: '44444',
    company_name: 'JP Morgan',
    challenge_name: 'Best Hack for Social Good',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C5',
    access_code: '55555',
    company_name: 'Capital One',
    challenge_name: 'Best Financial Hack',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C6',
    access_code: '66666',
    company_name: 'Amazon Web Services',
    challenge_name: 'Best Use of AWS',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C7',
    access_code: '77777',
    company_name: 'GE Digital',
    challenge_name: 'Best Digital Industrial Hack',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C8',
    access_code: '88888',
    company_name: 'Bloomberg',
    challenge_name: 'Best Education/Diversity and Inclusion Hack',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C9',
    access_code: '99999',
    company_name: 'ViaSat',
    challenge_name: 'Best Device Connectivity',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C10',
    access_code: '101010',
    company_name: 'Liberty Mutual',
    challenge_name: 'Rise and Shine Challenge',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C11',
    access_code: '111111',
    company_name: 'Altamira',
    challenge_name: 'Best Hardware Hack',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C12',
    access_code: '121212',
    company_name: 'Qualcomm',
    challenge_name: 'Qualcomm DragonBoard™ 410c Hack',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C13',
    access_code: '131313',
    company_name: 'Facebook/Oculus',
    challenge_name: 'Best VR Hack',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C14',
    access_code: '141414',
    company_name: 'Microsoft',
    challenge_name: 'Best Use of Microsoft Cognitive Services API',
    num_winners: 1,
    winners: []
  },
  { company_id: 'C15',
    access_code: '151515',
    company_name: 'Booz Allen Hamilton',
    challenge_name: 'Best Future Hack',
    num_winners: 3,
    winners: []
  }
];

const PROJECTS = [
  { project_id: 'P1',
    table_number: 23,
    project_name: 'Mining Malware',
    project_url: 'https://devpost.com/software/mining-malware',
    challenges: [
      { company: 'Mantech',
        challenge_id: 'C3',
        challenge_name: 'Cybersecurity Hack',
        won: true
      },
      { company: 'JP Morgan',
        challenge_id: 'C4',
        challenge_name: 'Best Hack for Social Good',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C0',
        challenge_name: 'Best ML/AI Hack',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C1',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C2',
        challenge_name: 'Best Data Science Hack',
        won: false
      },
      { company: 'Capital One',
        challenge_id: 'C5',
        challenge_name: 'Best Financial Hack',
        won: false
      },
      { company: 'Amazon Web Services',
        challenge_id: 'C6',
        challenge_name: 'Best Use of AWS',
        won: true
      },
      { company: 'GE Digital',
        challenge_id: 'C7',
        challenge_name: 'Best Digital Industrial Hack',
        won: false
      }
    ],
  },
  { project_id: 'P2',
    table_number: 4,
    project_name: 'Leveraging the First Steps',
    project_url: 'https://devpost.com/software/leveraging-the-first-steps',
    challenges: [
      { company: 'JP Morgan',
        challenge_id: 'C4',
        challenge_name: 'Best Hack for Social Good',
        won: true
      },
      { company: 'Bloomberg',
        challenge_id: 'C8',
        challenge_name: 'Best Education/Diversity and Inclusion Hack',
        won: false
      }
    ],
  },
  { project_id: 'P3',
    table_number: 12,
    project_name: 'Safety Net',
    project_url: 'https://devpost.com/software/safety-net-cjr0nv',
    challenges: [
      { company: 'ViaSat',
        challenge_id: 'C9',
        challenge_name: 'Best Device Connectivity',
        won: true
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C1',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C2',
        challenge_name: 'Best Data Science Hack',
        won: false
      }
    ],
  },
  { project_id: 'P4',
    table_number: 3,
    project_name: 'Smart Home Security',
    project_url: 'https://devpost.com/software/technica2017-alexa-securitycam',
    challenges: [
      { company: 'ViaSat',
        challenge_id: 'C9',
        challenge_name: 'Best Device Connectivity',
        won: false
      },
      { company: 'Liberty Mutual',
        challenge_id: 'C10',
        challenge_name: 'Rise and Shine Challenge',
        won: true
      },
      { company: 'Altamira',
        challenge_id: 'C11',
        challenge_name: 'Best Hardware Hack',
        won: false
      },
      { company: 'Qualcomm',
        challenge_id: 'C12',
        challenge_name: 'Qualcomm DragonBoard™ 410c Hack',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C0',
        challenge_name: 'Best ML/AI Hack',
        won: false
      }
    ],
  },
  { project_id: 'P5',
    table_number: 49,
    project_name: 'HelpHub',
    project_url: 'https://devpost.com/software/helphub-wme2q3',
    challenges: [
      { company: 'ViaSat',
        challenge_id: 'C9',
        challenge_name: 'Best Device Connectivity',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C0',
        challenge_name: 'Best ML/AI Hack',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C1',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      },
      { company: 'Liberty Mutual',
        challenge_id: 'C10',
        challenge_name: 'Rise and Shine Challenge',
        won: false
      },
      { company: 'Facebook/Oculus',
        challenge_id: 'C13',
        challenge_name: 'Best VR Hack',
        won: true
      },
      { company: 'Microsoft',
        challenge_id: 'C14',
        challenge_name: 'Best Use of Microsoft Cognitive Services API',
        won: false
      },
      { company: 'Altamira',
        challenge_id: 'C11',
        challenge_name: 'Best Hardware Hack',
        won: false
      },
      { company: 'Bloomberg',
        challenge_id: 'C8',
        challenge_name: 'Best Education/Diversity and Inclusion Hack',
        won: false
      }
    ]
  },
  { project_id: 'P6',
    table_number: 7,
    project_name: 'Survival Aid',
    project_url: 'https://devpost.com/software/survival-aid',
    challenges: [
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C1',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C2',
        challenge_name: 'Best Data Science Hack',
        won: false
      }
    ]
  },
  { project_id: 'P7',
    table_number: 2,
    project_name: 'Faze One',
    project_url: 'https://devpost.com/software/faze-one',
    challenges: [
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C1',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C0',
        challenge_name: 'Best ML/AI Hack',
        won: false
      }
    ]
  },
  { project_id: 'P8',
    table_number: 55,
    project_name: 'Connect in Crisis',
    project_url: 'https://devpost.com/software/connect-in-crisis',
    challenges: [
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C1',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_id: 'C0',
        challenge_name: 'Best ML/AI Hack',
        won: false
      }
    ]
  }
];

class SearchandFilter extends Component {

    constructor(props) {
      super(props);
      let challenges = this.createChallengeSponsorArray(CHALLENGES);
      this.state = {
        data: PROJECTS,
        value: challenges[0],
        toggle_off: true,
        challenges: CHALLENGES,
        workingdata: this.setSponsorWorkingData(challenges)
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleToggle = this.handleToggle.bind(this);
      this.getSponsorChallenges = this.getSponsorChallenges.bind(this);
      this.getSponsorData = this.getSponsorData.bind(this);
      this.setSponsorWorkingData = this.setSponsorWorkingData.bind(this);
    }

    componentDidMount() {
      // TODO(timothychen01): Replace this URL with final URL
      // TODO(timothychen01): Explore replacing URL string with environment vars
      /*axios.get('http://ec2-34-201-45-125.compute-1.amazonaws.com/api/projects')
      .then(response => {
        console.log(JSON.stringify(response['data']));  // TODO: Remove logging
        this.setState({
          data: response['data'],
          workingdata: response['data']
        });
      })*/
    }

    handleChange(e){
      console.log(e.target.name)
      if (e.target.name === 'input') {
        let val =(e.target.value);
        console.log(val);
        let updatedList = this.state.data;
        updatedList = updatedList.filter((item) => {
          return item.project_name.toLowerCase().indexOf(val.toLowerCase()) !==-1;
        });

        this.setState(() => {
          return ({ workingdata: updatedList })
        })
      } else if (e.target.name === "selectProject") {
        let val = (e.target.value);
        this.setState({ value: val });
        let updatedList = this.state.data;
        updatedList = updatedList.filter((item) => {
          if (val === "Project")
            return true
          else
            return item.project_name.includes(val)
        })

        this.setState(() => {
          return({ workingdata: updatedList })
        })
      } else if (e.target.name === "selectChallenges") {
        let val = (e.target.value);
        this.setState({ value: val });
        let updatedList = this.state.data;
        updatedList = updatedList.filter((item) => {
          let challenges_data = [];
          item.challenges.map((obj) => {
            challenges_data.push(obj.challenge_name);
          })
          if (val === "All Challenges") {
            return true
          } else {
            console.log(challenges_data.indexOf(val) > -1)
            return challenges_data.indexOf(val) > -1
          }
        })

        this.setState(() => {
          console.log(updatedList);
          return({ workingdata: updatedList })
        })
      }
    }

    componentWillMount(){
      if (this.props.origin === 'sponsor') {
        this.setState({ workingdata: this.state.workingdata });
      } else {
        this.setState({ workingdata: this.state.data });
      }
    }

    // constructor(props){
    //     super(props);
    //     this.handleChange = this.handleChange.bind(this);
    // }

    createChallengeArray(){
      /*let options = [];
      this.state.data.map((obj) => {
        {obj.challenges.map((item) => {
          options.push(item.challenge_name);
        })}
      })
      console.log(options);
      return options;*/
      let challenges = [];
      this.state.challenges.map((obj) => {
        if (challenges.indexOf(obj.company_name) === -1) {
          challenges.push(obj.challenge_name);
        }
      })
      challenges = challenges.sort(function (a, b) {
        if (a < b) return -1;
        else if (a > b) return 1;
        return 0;
      });
      return challenges;
    }

    createChallengeSponsorArray(challenges_data){
      /*let options = [];
      console.log(this.props.loggedIn)
      this.state.data.map((obj) => {
        obj.challenges.map((item) => {
          if (item.company === this.props.loggedIn && options.indexOf(item.challenge_name) == -1)
            options.push(item.challenge_name);
        })
      })
      console.log(options)
      return options;*/
      let challenges = [];
      challenges_data.map((obj) => {
        if (obj.company_name == this.props.loggedIn) {
          challenges.push(obj.challenge_name);
        }
      })
      challenges = challenges.sort(function (a, b) {
        if (a < b) return -1;
        else if (a > b) return 1;
        return 0;
      });
      return challenges;
    }

    getSponsorData() {
      let challenges = {};
      this.state.challenges.map((challenge) => {
        if (challenge.company_name == this.props.loggedIn) {
          let obj = {
            challenge_id: challenge.company_id,
            vote_limit: challenge.num_winners,
            winners: challenge.winners,
            submitted: false
          };
          if (challenge.winners.length > 0) {
            obj.submitted = true;
          }
          challenges[challenge.challenge_name] = obj;
        }
      })
      return challenges;
    }

    getSponsorChallenges(challenges) {
      let s = {};
      this.state.data.map((obj) => {
        let j = {};
        obj.challenges.map((item) => {
          if (Object.keys(challenges).indexOf(item.challenge_name) !== -1) {
          let data = challenges[item.challenge_name]['winners'];
            if (data.length > 0 && data.indexOf(obj.project_id) !== -1) {
              j[item.challenge_name] = true;
            } else {
              j[item.challenge_name] = false;
            }
          }
        });
        if (Object.keys(j).length > 0) {
          s[obj.project_id] = j;
        }
      });
      return s;
    }

    setSponsorWorkingData(sponsor_challenges) {
      let firstChallenge = sponsor_challenges[0];
      let initialData = [];
      PROJECTS.map((obj) => {
        obj.challenges.map((item) => {
          if (item.company === this.props.loggedIn && item.challenge_name == firstChallenge)
            initialData.push(obj);
        })
      })
      return initialData;
    }

    handleToggle() {
      this.setState({
        toggle_off: !this.state.toggle_off
      });
    }

    // handleChange(e){
    //     this.props.handleChange(e);
    // }

    render() {
      let challenge_array = (this.createChallengeArray().map((obj,index) => {
          return (<option key={index}>{obj}</option>)
        })
      );
      let challenge_sponsor_array = (
        this.createChallengeSponsorArray(this.state.challenges).map((obj,index) => {
          return (<option key={index}>{obj}</option>)
        })
      );

      let select = (
        <select className="form-control" id="challenges" onChange={this.handleChange} name="selectChallenges">
          { this.props.origin === "home" ? <option>All Challenges</option> : <div></div>}
          { this.props.origin === "home" ? challenge_array : challenge_sponsor_array }
        </select>
      );

      let sponsor_challenges = this.getSponsorData();
      let voting_data = this.getSponsorChallenges(sponsor_challenges);
      let table = (
        this.props.origin === "home" ?
          <Table
            projects={this.state.workingdata}
            value={this.state.value}
            show_attempted_challenges={this.state.toggle_off}
          />
          :
          /*<VotingTable
            company={this.props.loggedIn}
            projects={this.state.workingdata}
            value={this.state.value}
            voting_data={voting_data}
            sponsor_challenges={sponsor_challenges}
          />*/
          <NewTable
          company={this.props.loggedIn}
          projects={this.state.workingdata}
          value={this.state.value}
          voting_data={voting_data}
          sponsor_challenges={sponsor_challenges}
          />
      );

      let toggle_style = ( this.props.origin === "home" ? { display: "inline-block" } : { display: "none" } );

      return (
        <div>
          { this.props.origin === "sponsor" ? <WelcomeHeader company={this.props.loggedIn} data={sponsor_challenges}/>: <div></div>}
          <div class="card">
          {this.props.origin === 'sponsor' ?
          <div class="card-header">
            <h5>{this.props.title}</h5>
          </div>
          :
          <div style={{marginTop:"15px"}}></div>}
          <div class="card-body"><form>
              <div className="form-group">
                <input type="text" placeholder="Filter projects by name" className="form-control" onChange={this.handleChange} name="input" />
              </div>
              <div className="form-row">
                <div style={{margin:"0px 5px", width:"100%"}}>
                  { this.props.origin === "home" ? <div></div> : <div style={{marginBottom: "5px"}}>Select a Challenge to Vote For</div> }
                  {select}
                </div>
              </div>
              <div style={toggle_style}>
                <div className="toggle" onChange={this.handleToggle}>
                  <label className="switch">
                    { this.state.toggle_off ? <input type="checkbox" /> : <input type="checkbox" checked /> }
                    <div className="slider round"></div>
                  </label>
                </div>
                <div className="toggle-label">Show Attempted Challenges</div>
              </div>
            </form>{this.props.origin === 'sponsor' ? table : <div></div>}</div>
          </div>
          {this.props.origin === 'home' ? table : <div></div>}
      </div>
    )
  }
}

export default SearchandFilter;

// <option selected>Project</option>
//                 <option>login</option>
//                 <option>web</option>
//                 <option>design</option>
//                 <option>backend</option>

// <div className="col-6">
                // <select className="form-control" id="project" onChange={this.handleChange} name="selectProject">
                // <option selected>Project</option>
                //     {this.state.data.map((obj)=>{
                //         return (
                //             <option key={obj.table_number}>{obj.project_name}</option>
                //         )
                //     })}
                // </select>
                // </div>
