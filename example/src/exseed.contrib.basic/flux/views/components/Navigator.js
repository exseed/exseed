import React from 'react';

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
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
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
                <li><a href="/user/register">Register</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="/user/profile">Profile</a></li>
                <li><a href="/user/login">Login</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="/user/logout">Logout</a></li>
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