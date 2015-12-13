import React from 'react';
import AppLayout
from '../../../../exseed.contrib.basic/flux/views/layouts/AppLayout';

export default class NotFoundPage extends React.Component {
  componentWillMount() {
    window.location.pathname = window.location.pathname;
  }

  render() {
    return <AppLayout>
      <div>
        not found
      </div>
    </AppLayout>;
  }
};

NotFoundPage.isNotFound = true;