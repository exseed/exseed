import React from 'react';

export default class NotFoundPage extends React.Component {
  render() {
    return <div className="container">
      <h1>404 Not Found</h1>
      <p>This is a customizable 404 page.</p>
    </div>;
  }
};

NotFoundPage.isNotFound = true;