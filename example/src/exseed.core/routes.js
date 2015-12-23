import React from 'react';
import { Route, IndexRoute } from 'react-router';

import settings from './settings';
import AppLayout from './flux/views/layouts/AppLayout';
import NotFoundPage from './flux/views/pages/NotFoundPage';

export default (
  <Route component={AppLayout} EXSEED_APP_NAME={settings.name}>
    <Route path="*" component={NotFoundPage} />
  </Route>
);