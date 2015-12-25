import {
  App,
  registerModel
} from 'exseed';

class TodoApp extends App {
  constructor(app, name, dir) {
    super(app, name, dir);
    registerModel(require('./models/todolist').default);
  }

  routing(app, models) {
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
};

export default TodoApp;