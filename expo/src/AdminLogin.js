/* react components */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import SiteWrapper from './SiteWrapper.js';

/* Admin login page content (see PRD) */

const AdminLogin = () => (
  SiteWrapper(
    <div class="AdminLogin">
      adminlogin
    </div>
  )
);

export default AdminLogin;
