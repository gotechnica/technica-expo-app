/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

/* custom components */
import Card from './Card.js';
import Table from './Table.js';
import Sponsor from './Sponsor.js';
import SiteWrapper from './SiteWrapper.js';

const Home = () => (
  SiteWrapper(
    <div class="Home">
      <div class="row">
        <div class="col">
          <Card title="Search and Filter" content="replace this" />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <Table />
        </div>
      </div>
    </div>
  )
);

export default Home;
