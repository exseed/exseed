import React from 'react';
import BaseLayout
from '../../../../exseed.core/flux/views/layouts/BaseLayout';

const ENTER_KEY = 13;

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      todos: [],
    };
  }

  componentDidMount() {
    fetch('/api/todolist')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState({
          todos: data,
        });
      }).catch(() => {
        console.log('Error');
      });
  }

  handleKeyDown(event) {
    if (event.keyCode === ENTER_KEY) {
      event.preventDefault();
      var val = this.state.content.trim();
      if (val) {
        $.ajax({
          url: '/api/todolist',
          dataType: 'json',
          contentType: 'application/json',
          type: 'POST',
          data: JSON.stringify({
            todo: {
              content: val.toString(),
            },
          }),
          success: function(data) {
            this.setState({
              content: '',
              todos: this.state.todos.concat([data]),
            });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(status, err.toString());
          }.bind(this),
        });
      }
    }

  }

  handleChange(event) {
    this.setState({
      content: event.target.value,
    });
  }

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