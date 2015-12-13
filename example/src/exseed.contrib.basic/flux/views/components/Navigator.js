import React from 'react';
import { Link } from 'react-router';

export default class Navigator extends React.Component {
  render() {
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
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
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
                <li><Link to="/user/register">Register</Link></li>
                <li role="separator" className="divider"></li>
                <li><Link to="/user/profile">Profile</Link></li>
                <li><Link to="/user/login">Login</Link></li>
                <li role="separator" className="divider"></li>
                <li><Link to="/user/logout">Logout</Link></li>
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