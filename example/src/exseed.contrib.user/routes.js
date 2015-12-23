import React from 'react';
import { Route, IndexRoute } from 'react-router';

import settings from './settings';
import AppLayout from './flux/views/layouts/AppLayout';
import RegisterPage from './flux/views/pages/RegisterPage';
import LoginPage from './flux/views/pages/LoginPage';
import NotFoundPage from '../exseed.core/flux/views/pages/NotFoundPage';

export default (
  <Route path="/user" component={AppLayout} EXSEED_APP_NAME={settings.name}>
    <Route path="register" component={RegisterPage} />
    <Route path="login" component={LoginPage} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);