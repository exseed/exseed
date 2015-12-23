import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import history from '../../exseed.core/history';
import routes from '../routes';

render(
  <Router history={history}>
    {routes}
  </Router>
, document.getElementById('exseed_root'));