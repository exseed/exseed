import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import history from '../../exseed.core/history';
import routes from '../routes';
import NotFoundPage from '../../exseed.core/flux/views/components/NotFoundPage';

render(
  <Router history={history}>
    {routes}
    <Route path="*" component={NotFoundPage} />
  </Router>
, document.getElementById('exseed_root'));