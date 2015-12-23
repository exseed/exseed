import React from 'react';
import { Link } from 'react-router';

export function createLinkOf(appName) {
  return class ExseedLink extends React.Component {
    render() {
      if (this.props.app === appName) {
        return <Link to={this.props.to}>{this.props.children}</Link>;
      } else {
        return <a href={this.props.to}>{this.props.children}</a>;
      }
    }
  };
};