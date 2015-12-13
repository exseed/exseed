import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AppLayout from './flux/views/layouts/AppLayout';
import HomePage from './flux/views/pages/HomePage';
import AboutPage from './flux/views/pages/AboutPage';

export default (
  <Route path="/" component={AppLayout}>
    <IndexRoute component={HomePage} />
    <Route path="about" component={AboutPage} />
  </Route>
);