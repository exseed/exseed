import React from 'react';
import BaseLayout from './BaseLayout';
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
    ];

    const styles = [
      // '/basic/css/bundle.css',
    ];

    return (
      <BaseLayout
        title="Exseed"
        scripts={scripts}
        styles={styles} >
        <Navigator />
        {this.props.children}
      </BaseLayout>
    );
  }
};