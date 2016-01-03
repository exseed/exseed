import React from 'react';

import UserActions from '../../actions/UserActions';

export default class LogoutPage extends React.Component {
  componentWillMount() {
    UserActions.logout();
  }

  render() {
    return false;
  }
};