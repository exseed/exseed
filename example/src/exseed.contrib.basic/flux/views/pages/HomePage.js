import React from 'react';
import AppLayout from '../layouts/AppLayout';

export default class HomePage extends React.Component {
  handleClick() {
    alert('It works');
  }

  render() {
    return <AppLayout>
      <div className="container">
        <h1>Home</h1>
        <button onClick={this.handleClick}>Click me</button>
      </div>
    </AppLayout>;
  }
};