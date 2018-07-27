import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Table.css';

class Table extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div class="card">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">URL</th>
                <th scope="col">Table</th>
                <th scope="col">Challenge(s)</th>
              </tr>
            </thead>
            <tbody>
            {
            this.props.data.map((object)=>{
              return(
                <tr>
                <td>{object.project}</td>
                <td><a href="#">{object.url}</a></td>
                <td>{object.table}</td>
                <td>{object.challenges.join()}</td>
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
