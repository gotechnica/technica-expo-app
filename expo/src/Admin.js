/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';

/* Admin page content (see PRD) */

const Admin = () => (
  SiteWrapper(
    <div class="Admin">
      admin
    </div>
  )
);

export default Admin;
