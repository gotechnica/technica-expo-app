import React from 'react';

import SearchandFilter from './SearchandFilter';
import SiteWrapper from './SiteWrapper.js';

import './App.css';


// const PROJECTS = [
//   { table_number: 23,
//     project_name: 'Mining Malware',
//     project_url: 'https://devpost.com/software/mining-malware',
//     challenges: [
//       { company: 'Mantech',
//         challenge_name: 'Cybersecurity Hack',
//         won: true
//       },
//       { company: 'JP Morgan',
//         challenge_name: 'Best Hack for Social Good',
//         won: false
//       },
//       { company: 'Booz Allen Hamilton',
//         challenge_name: 'Best Hack to Help in a Crisis',
//         won: false
//       },
//       { company: 'Capital One',
//         challenge_name: 'Best Financial Hack',
//         won: false
//       },
//       { company: 'Amazon Web Services',
//         challenge_name: 'Best Use of AWS',
//         won: true
//       },
//       { company: 'GE Digital',
//         challenge_name: 'Best Digital Industrial Hack',
//         won: false
//       }
//     ],
//   },
//   { table_number: 4,
//     project_name: 'Leveraging the First Steps',
//     project_url: 'https://devpost.com/software/leveraging-the-first-steps',
//     challenges: [
//       { company: 'JP Morgan',
//         challenge_name: 'Best Hack for Social Good',
//         won: true
//       },
//       { company: 'Bloomberg',
//         challenge_name: 'Best Education/Diversity and Inclusion Hack',
//         won: false
//       }
//     ],
//   },
// ];
class Home extends React.Component{
//   constructor(props){
//     super(props);
//     this.state = {
//       data: PROJECTS,
//       // [
//       //   {
//       //     project: "login",
//       //     url: "https//",
//       //     table: '1',
//       //     challenges: ["google","facebook"]
//       //   },
//       //   {
//       //     project: "web",
//       //     url: "https//",
//       //     table: '2',
//       //     challenges: ["google","facebook"]
//       //   },
//       //   {
//       //     project: "design",
//       //     url: "https//",
//       //     table: '3',
//       //     challenges: ["google","facebook"]
//       //   },
//       //   {
//       //     project: "backend",
//       //     url: "https//",
//       //     table: '4',
//       //     challenges: ["google"]
//       //   }
//       // ],
//       workingdata:[],
//       value:''
//     }
//     this.handleChange = this.handleChange.bind(this);
//   }
//   handleChange(e){
//     console.log(e.target.name)
//     if(e.target.name === 'input'){
//     let val =(e.target.value)
//     console.log(val);
//     let updatedList = this.state.data;
//     updatedList = updatedList.filter((item)=>{
//       return item.project_name.toLowerCase().indexOf(val.toLowerCase()) !==-1;
//     });

//     this.setState(()=>{
//       return({
//         workingdata: updatedList
//       }
//       )
//     })
//   }
//   else if (e.target.name==="selectProject"){
//     let val = e.target.value
//     let updatedList = this.state.data;
//     updatedList = updatedList.filter((item)=>{
//       if(val==="Project")
//       return true
//       else
//       return item.project_name.includes(val)
//     })

//     this.setState(()=>{
//       return({
//         workingdata: updatedList
//       }
//       )
//     })
//   }
//   else if (e.target.name==="selectChallenges"){
//     let val = e.target.value
//     let updatedList = this.state.data;
//     updatedList = updatedList.filter((item)=>{
//       let challenges_data = [];
//       item.challenges.map((obj)=>{
//         challenges_data.push(obj.challenge_name);
//       })
//       if(val==="Challenges")
//       return true
//       else{
//         console.log(challenges_data.indexOf(val) >-1)
//       return challenges_data.indexOf(val) >-1
//       }
//     })

//     this.setState(()=>{
//       console.log(updatedList);
//       return({
//         workingdata: updatedList
//       }
//       )
//     })
//   }
// }
//   componentWillMount(){
//     this.setState({
//       workingdata: this.state.data
//     })
//   }
  render() {
    return(
      SiteWrapper(
        <div class="Home">
          <div class="row">
            <div class="col">
              <SearchandFilter origin="home" />
            </div>
          </div>
        </div>
      )
    );
  }
}

export default Home;


// data = {this.state.data} handleChange={this.handleChange}

// <div class="row">
//         <div class="col">
//           <Table data={this.state.workingdata} value={this.state.value} />
//         </div>
//       </div>
