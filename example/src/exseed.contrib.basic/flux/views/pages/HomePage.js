import React from 'react';

export default class HomePage extends React.Component {
  handleClick() {
    alert('It works');
  }

  render() {
    return <div className="container">
      <h1>Home</h1>
      <button onClick={this.handleClick}>Click me</button>
    </div>;
  }
};