import React from 'react';

export default class BaseLayout extends React.Component {
  render() {
    const defaultScripts = [
      '/js/common.js',
    ];

    const defaultStyles = [
    ];

    let scripts = defaultScripts.concat(this.props.scripts).map((src, idx) => {
      return <script key={idx} src={src}/>;
    });

    let styles = defaultStyles.concat(this.props.styles).map((src, idx) => {
      return <link key={idx} rel="stylesheet" href={src}/>;
    });

    return <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{this.props.title}</title>
      </head>
      <body>
        {styles}
        {this.props.children}
        {scripts}
      </body>
    </html>;
  }
};

BaseLayout.defaultProps = {
  title: '',
  scripts: [],
  styles: [],
};