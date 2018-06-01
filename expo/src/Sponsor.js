/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';

/* Sponsor page content (see PRD) */

const Sponsor = () => (
  SiteWrapper(
    <div class="Sponsor">
      sponsor
    </div>
  )
);

export default Sponsor;
