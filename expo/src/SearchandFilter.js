
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import Card from './Card.js';
import Table from './Table.js';
import SiteWrapper from './SiteWrapper.js';
import {Voting, ProjectRow, SubmissionTable} from './Sponsor';
const PROJECTS = [
  { table_number: 23,
    project_name: 'Mining Malware',
    project_url: 'https://devpost.com/software/mining-malware',
    challenges: [
      { company: 'Mantech',
        challenge_name: 'Cybersecurity Hack',
        won: true
      },
      { company: 'JP Morgan',
        challenge_name: 'Best Hack for Social Good',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      },
      { company: 'Capital One',
        challenge_name: 'Best Financial Hack',
        won: false
      },
      { company: 'Amazon Web Services',
        challenge_name: 'Best Use of AWS',
        won: true
      },
      { company: 'GE Digital',
        challenge_name: 'Best Digital Industrial Hack',
        won: false
      }
    ],
  },
  { table_number: 4,
    project_name: 'Leveraging the First Steps',
    project_url: 'https://devpost.com/software/leveraging-the-first-steps',
    challenges: [
      { company: 'JP Morgan',
        challenge_name: 'Best Hack for Social Good',
        won: true
      },
      { company: 'Bloomberg',
        challenge_name: 'Best Education/Diversity and Inclusion Hack',
        won: false
      }
    ],
  },
  { table_number: 12,
    project_name: 'Safety Net',
    project_url: 'https://devpost.com/software/safety-net-cjr0nv',
    challenges: [
      { company: 'ViaSat',
        challenge_name: 'Best Device Connectivity',
        won: true
      },
      { company: 'Booz Allen Hamilton',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      }
    ],
  },
  { table_number: 3,
    project_name: 'Smart Home Security',
    project_url: 'https://devpost.com/software/technica2017-alexa-securitycam',
    challenges: [
      { company: 'ViaSat',
        challenge_name: 'Best Device Connectivity',
        won: false
      },
      { company: 'Liberty Mutual',
        challenge_name: 'Rise and Shine Challenge',
        won: true
      },
      { company: 'Altamira',
        challenge_name: 'Best Hardware Hack',
        won: false
      },
      { company: 'Qualcomm',
        challenge_name: 'Qualcomm DragonBoard™ 410c Hack',
        won: false
      },
    ],
  },
  { table_number: 49,
    project_name: 'HelpHub',
    project_url: 'https://devpost.com/software/helphub-wme2q3',
    challenges: [
      { company: 'ViaSat',
        challenge_name: 'Best Device Connectivity',
        won: false
      },
      { company: 'Booz Allen Hamilton',
        challenge_name: 'Best Hack to Help in a Crisis',
        won: false
      },
      { company: 'Liberty Mutual',
        challenge_name: 'Rise and Shine Challenge',
        won: false
      },
      { company: 'Facebook/Oculus',
        challenge_name: 'Best VR Hack ',
        won: true
      },
      { company: 'Microsoft',
        challenge_name: 'Best Use of Microsoft Cognitive Services API',
        won: false
      },
      { company: 'Altamira',
        challenge_name: 'Best Hardware Hack',
        won: false
      },
      { company: 'Bloomberg',
        challenge_name: 'Best Education/Diversity and Inclusion Hack',
        won: false
      }
    ]
  }
];
class SearchandFilter extends Component {

    constructor(props){
        super(props);
        this.state = {
          data: PROJECTS,
          // [
          //   {
          //     project: "login",
          //     url: "https//",
          //     table: '1',
          //     challenges: ["google","facebook"]
          //   },
          //   {
          //     project: "web",
          //     url: "https//",
          //     table: '2',
          //     challenges: ["google","facebook"]
          //   },
          //   {
          //     project: "design",
          //     url: "https//",
          //     table: '3',
          //     challenges: ["google","facebook"]
          //   },
          //   {
          //     project: "backend",
          //     url: "https//",
          //     table: '4',
          //     challenges: ["google"]
          //   }
          // ],
          workingdata:[],
          value:''
        }
        this.handleChange = this.handleChange.bind(this);
      }
      handleChange(e){
        console.log(e.target.name)
        if(e.target.name === 'input'){
        let val =(e.target.value)
        console.log(val);
        let updatedList = this.state.data;
        updatedList = updatedList.filter((item)=>{
          return item.project_name.toLowerCase().indexOf(val.toLowerCase()) !==-1;
        });

        this.setState(()=>{
          return({
            workingdata: updatedList
          }
          )
        })
      }
      else if (e.target.name==="selectProject"){
        let val = e.target.value
        let updatedList = this.state.data;
        updatedList = updatedList.filter((item)=>{
          if(val==="Project")
          return true
          else
          return item.project_name.includes(val)
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
          let challenges_data = [];
          item.challenges.map((obj)=>{
            challenges_data.push(obj.challenge_name);
          })
          if(val==="Challenges")
          return true
          else{
            console.log(challenges_data.indexOf(val) >-1)
          return challenges_data.indexOf(val) >-1
          }
        })

        this.setState(()=>{
          console.log(updatedList);
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

    // constructor(props){
    //     super(props);
    //     this.handleChange = this.handleChange.bind(this);
    // }

    createChallengeArray(){
        let options = [];
        this.state.data.map((obj)=>{
           {obj.challenges.map((item)=>{
                options.push(item.challenge_name);
            })
          }
    })
    console.log(options);
    return options;
    }
    createChallengeSponsorArray(){
      let options = [];
      console.log(this.props.loggedIn)
      this.state.data.map((obj)=>{
        obj.challenges.map((item)=>{
          if(item.company === this.props.loggedIn)
            options.push(item.challenge_name);
        })
      })
      console.log(options)
      return options;
    }

    // handleChange(e){
    //     this.props.handleChange(e);
    // }
    render(){
        return (
            <div>
            <Card title="Search and Filter" content={
                <form>
                <div className="form-group">
                <input type="text" placeholder="Search for projects here" className="form-control" onChange={this.handleChange} name="input" />
                </div>
                <div className="form-row">
                <div className="col-6">
                <select className="form-control" id="project" onChange={this.handleChange} name="selectProject">
                <option selected>Project</option>
                    {this.state.data.map((obj)=>{
                        return (
                            <option key={obj.table_number}>{obj.project_name}</option>
                        )
                    })}
                </select>
                </div>
                {this.props.origin === "home" ? <div className="col-6">
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
                </div> :  <div className="col-6">
                <select className="form-control" id="challenges" onChange={this.handleChange} name="selectChallenges">
                <option selected>Challenges</option>
                    {
                        this.createChallengeSponsorArray().map((obj,index)=>{

                            return(
                                <option key={index}>{obj}</option>
                            )
                        })
                    }
                </select>
                </div>
              }
                </div>
                </form>
            }/>
            {this.props.origin === "home" ?
            <div class="row">
        <div class="col">
        <Table data={this.state.workingdata} value={this.state.value} />
        </div>
      </div> :

        <div class="card">
        <div class="card-body">
        <SubmissionTable projects={this.state.workingdata} value={this.state.value}/>
        </div>
        </div>
        }

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
