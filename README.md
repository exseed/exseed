# Exseed

[![Build Status](https://travis-ci.org/exseed/exseed.svg?branch=master)](https://travis-ci.org/exseed/exseed)
[![npm version](https://badge.fury.io/js/exseed.svg)](https://badge.fury.io/js/exseed)
[![Code Climate](https://codeclimate.com/github/exseed/exseed/badges/gpa.svg)](https://codeclimate.com/github/exseed/exseed)
[![Dependency Status](https://david-dm.org/exseed/exseed.svg)](https://david-dm.org/exseed/exseed)

A highly extensible nodejs framework

## Features

- Highly Extensible
- Easy to Use
- Full Stack
- ORM Integrated
- ES6/ES7 Syntax
- Isomorphic

## Workflow & Implementation Details

| Item       | Choice |
|------------|--------|
| Build Tool | [Webpack](https://github.com/webpack/webpack) |
| Automation | [Gulp](https://github.com/gulpjs/gulp) |
| Backend    | [Node](https://nodejs.org/en/), [Express(>=4.0.0)](http://expressjs.com/) |
| ORM        | [Waterline](https://github.com/balderdashy/waterline) |
| Frontend   | [React](https://facebook.github.io/react/), [Redux](https://github.com/rackt/redux)/[Alt](http://alt.js.org/), [React-Router](https://github.com/rackt/react-router) |
| Testing    | [Mocha](https://mochajs.org/) |
| CI         | [Travis CI](https://travis-ci.org/) |

## Compare to Other Frameworks

|               | Exseed   | Express | Koa    | Sails  | Hapi   |
| ------------- | ------ | ------- | ------ | ------ | ------ |
| Extensibility | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★★☆ | ★★★★☆ |
| Threshold     | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ | ★★★★☆ | ★★☆☆☆ |
| Build Speed   | ★★★★★ | ★☆☆☆☆ | ★☆☆☆☆ | ★★★★☆ | ★☆☆☆☆ |
| Full Stack    | ✔      |         |        | ✔      |        |
| ORM           | ✔      |         |        | ✔      |        |
| Modern Syntax | ✔      |         | ✔      |        |        |
| Isomorphic    | ✔      |         |        |        |        |

## Usage

1. Install CLI

  ```
  $ npm install -g exseed-cli
  ```

2. Clone the [boilerplate project](https://github.com/exseed/exseed-boilerplate)

3. Install dependencies

  ```
  $ cd exseed-boilerplate
  $ npm install
  ```

4. Run it

  ```
  $ sd build --watch
  $ sd init
  $ sd serve
  ```

## Example - Todo List

1. File Structure

  ```
  - <project root>
  ----- settings.js
  ----- exseed.core/
  ----- todoapp/
  --------- settings.js
  --------- models.js
  --------- routes.js
  --------- flux/
  ------------- boot.js
  ------------- routes.js
  ------------- views/pages/MainPage.js
  ----- <other_app_1>/
  ----- <other_app_2>/
  ----- <other_app_n>/
  ```

2. Update installed apps

  Tell exseed what apps you want to use

  ```js
  // settings.js

  export default {
    installedApps: [
      './exseed.core',
      // other apps
      './todoapp',
    ],
    // other settings
  };
  ```

3. The server side

  ```js
  // todoapp/settings.js

  export default {
    name: 'todo',
  };
  ```

  ```js
  // todoapp/models.js

  export const todolist = {
    identity: 'todolist',
    attributes: {
      content: {
        type: 'string',
        required: true,
      },
    },
  };
  ```

  ```js
  // todoapp/routes.js
  
  import { models } from 'exseed';

  export default function routes({ app }) {
    app.get('/api/todolist', (req, res) => {
      models.todolist
        .find()
        .then((todolist) => {
          res.json(todolist);
        });
    });

    app.post('/api/todolist', (req, res) => {
      models.todolist
        .create(req.body.todo)
        .then((todo) => {
          res.json(todo);
        });
    });
  }
  ```

4. The client side

  All react related files are inside `todoapp/flux` folder

  ```js
  // todoapp/flux/boot.js

  import React from 'react';
  import { render } from 'react-dom';
  import { Router, browserHistory } from 'react-router';
  import routes from './routes';

  render(
    <Router history={browserHistory}>
      {routes}
    </Router>
  , document.getElementById('exseed_root'));
  ```

  ```js
  // todoapp/flux/routes.js

  import React from 'react';
  import { Route, IndexRoute } from 'react-router';

  import settings from '../settings';
  import MainPage from './views/pages/MainPage';

  export default (
    <Route path="/todo" component={MainPage} EXSEED_APP_NAME={settings.name} />
  );
  ```

  ```js
  // todoapp/flux/views/pages/MainPage.js

  import React from 'react';
  import BaseLayout
  from '../../../../exseed.core/flux/views/layouts/BaseLayout';

  export default class MainPage extends React.Component {
    ...

    render() {
      const scripts = [
        'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js',
        '/todo/js/bundle.js',
      ];

      return (
        <BaseLayout
          title="Exseed - Todo"
          scripts={scripts}>
          <h1>Todo</h1>
          <input
            type="text"
            onKeyDown={this.handleKeyDown.bind(this)}
            onChange={this.handleChange.bind(this)}
            value={this.state.content} />
          <ul>
            {this.state.todos.map(todo => (
              <li key={todo.id}>
                {todo.content}
              </li>
            ))}
          </ul>
        </BaseLayout>
      );
    }
  };
  ```

See the complete [todo app](https://github.com/exseed/exseed-boilerplate/tree/master/src/todoapp)

## Docs

- [API Docs](http://exseed.github.io/docs/exseed/0.1.15)
- [Developer Guide](https://github.com/exseed/exseed/blob/master/docs%2Fdeveloper%20guide.md)