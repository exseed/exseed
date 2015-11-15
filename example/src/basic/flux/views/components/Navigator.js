import React from 'react';

export default class Navigator extends React.Component {
  render() {
    return <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>;
  }
}