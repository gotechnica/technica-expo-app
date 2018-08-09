import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Table.css';
import Sponsor from './Sponsor.js';

class Table extends Component {
  constructor(props){
    super(props)
  }
  render() {
    const s = Sponsor();
    return (
      <div class="card">
        <div class="card-body">
          <table class="table">
              <tr>
                <th scope="col">Project</th>
                <th scope="col">URL</th>
                <th scope="col">Table</th>
                <th scope="col">Challenge(s)</th>
              </tr>
            <tbody>
            {
            this.props.data.map((object)=>{
              console.log(object);
              return(
                <tr>
                <td>{object.project_name}</td>
                <td><a href="#">{object.project_url}</a></td>
                <td>{object.table_number}</td>
                <td>{object.challenges.map((item,index)=>{
                  if(index !== object.challenges.length-1){
                    //console.log(index);
                    console.log(object.challenges.length)
                    return(
                      item.challenge_name +', '
                    )
                  }
                  else{
                    console.log(index);
                    return(
                      item.challenge_name
                    )
                  }
                })}</td>
              </tr>
              )
            })

          }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Table;