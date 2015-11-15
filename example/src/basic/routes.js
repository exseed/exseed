import React from 'react';
import { Location, Locations } from 'react-router-component';
import CaptureClicks from 'react-router-component/lib/CaptureClicks';

import HomePage from './flux/views/pages/HomePage';
import AboutPage from './flux/views/pages/AboutPage';

export default class App extends React.Component {
  render() {
    return <CaptureClicks>
      <Locations path={this.props.path}>
        <Location
          path="/"
          handler={HomePage} />
        <Location
          path="/about"
          handler={AboutPage} />
      </Locations>
    </CaptureClicks>;
  }
};