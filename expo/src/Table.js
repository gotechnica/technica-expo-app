import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Table.css';
import Sponsor from './Sponsor.js';

class Table extends Component {
  render() {
    const s = Sponsor();
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
              <tr>
                <td>proj name</td>
                <td>url</td>
                <td>table number</td>
                <td>challenges sub</td>

              </tr>
              <tr>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Table;
