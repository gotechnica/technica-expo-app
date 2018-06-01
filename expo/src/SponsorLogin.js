/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';

/* Sponsor login page content (see PRD) */

const SponsorLogin = () => (
    SiteWrapper(
      <div class="SponsorLogin">
        sponsorlogin
      </div>
    )
);

export default SponsorLogin;
