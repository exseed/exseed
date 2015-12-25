import React from 'react';
import Helmet from 'react-helmet';

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

    return <div>
      <Helmet
        title={this.props.title}
        meta={[
          {charSet: 'utf-8'},
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
        ]} />
      {styles}
      {scripts}
      {this.props.children}
    </div>;
  }
};

BaseLayout.defaultProps = {
  title: '',
  scripts: [],
  styles: [],
};