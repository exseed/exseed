import React from 'react';
import { createLinkOf }
from '../../../../exseed.core/flux/views/components/AppLink';

export default class Navigator extends React.Component {
  render() {
    const EXSEED_APP_NAME = (
      this.props.route? this.props.route.EXSEED_APP_NAME: '');
    const Link = createLinkOf(EXSEED_APP_NAME);

    return <nav className="navbar navbar-default navbar-static-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">
            {this.props.title}
          </a>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <li><Link app="basic" to="/">Home</Link></li>
            <li><Link app="basic" to="/about">About</Link></li>
            <li><Link app="basic" to="/doesNotExist">Not Exist</Link></li>
          </ul>

          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
              <a
                href="#"
                className="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false">
                User <span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link app="user" to="/user/register">Register</Link>
                </li>
                <li role="separator" className="divider"></li>
                <li><Link app="user" to="/user/profile">Profile</Link></li>
                <li><Link app="user" to="/user/login">Login</Link></li>
                <li role="separator" className="divider"></li>
                <li><Link app="user" to="/user/logout">Logout</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>;
  }
}

Navigator.defaultProps = {
  title: 'no-title',
};