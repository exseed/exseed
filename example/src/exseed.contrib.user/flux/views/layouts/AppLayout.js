import React from 'react';
import BaseLayout
from '../../../../exseed.contrib.basic/flux/views/layouts/BaseLayout';
import Navigator
from '../../../../exseed.contrib.basic/flux/views/components/Navigator';

export default class AppLayout extends React.Component {
  render() {
    const scripts = [
      '/user/js/bundle.js',
      'https://code.jquery.com/jquery-2.1.4.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js',
    ];

    const styles = [
      // '/user/css/bundle.css',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
    ];

    return (
      <BaseLayout
        title="Exseed"
        scripts={scripts}
        styles={styles} >
        <Navigator
          title="Exseed"
          {...this.props} />
        {this.props.children}
      </BaseLayout>
    );
  }
};