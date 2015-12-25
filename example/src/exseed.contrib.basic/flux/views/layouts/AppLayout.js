import React from 'react';
import BaseLayout
from '../../../../exseed.core/flux/views/layouts/BaseLayout';
import Navigator from '../components/Navigator';

// jscs:disable
/**
 * Ref:
 *   - http://stackoverflow.com/questions/30347722/importing-css-files-in-isomorphic-react-components
 *   - https://github.com/gpbl/isomorphic500
 */
// jscs:enable

if (process.env.BROWSER) {
  // require('../../../public/less/test.less');
  // require('../../../../../build/debug/public/css/core/bundle.css');
}

export default class AppLayout extends React.Component {
  render() {
    const scripts = [
      '/basic/js/bundle.js',
      'https://code.jquery.com/jquery-2.1.4.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js',
    ];

    const styles = [
      // '/basic/css/bundle.css',
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