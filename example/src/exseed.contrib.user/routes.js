import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AppLayout from './flux/views/layouts/AppLayout';
import RegisterPage from './flux/views/pages/RegisterPage';
import LoginPage from './flux/views/pages/LoginPage';

export default (
  <Route path="/user" component={AppLayout}>
    <Route path="register" component={RegisterPage} />
    <Route path="login" component={LoginPage} />
  </Route>
);