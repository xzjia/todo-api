const express = require("express");

const router = express.Router();

module.exports = services => {
  router.get("/", (req, res) => res.status(200).send("hello"));

  router.post("/register", (req, res) => {
    return services.db.users
      .create({ username: req.body.username, password: req.body.password })
      .then(user => res.status(201).json(user.serialize()))
      .catch(err => {
        // TODO: maybe return the token
        return res.status(400).send(err.message);
      });
  });

  router.get("/:id/todos", (req, res) => {
    return services.db.todos
      .list({ userId: req.params.id })
      .then(todos => todos.map(todo => todo.serialize()))
      .then(todos => res.status(200).json(todos))
      .catch(err => res.status(400).send(err.message));
  });

  router.post("/:id/todos", (req, res) => {
    return services.db.todos
      .create({ userId: req.params.id, content: req.body.content })
      .then(todos => todos.map(todo => todo.serialize()))
      .then(todos => res.status(201).json(todos))
      .catch(err => res.status(400).send(err.message));
  });

  router.put("/:id/todos/:todoId", (req, res) => {
    return services.db.todos
      .update({ userId: req.params.id, todoId: req.params.todoId })
      .then(todos => todos.map(todo => todo.serialize()))
      .then(todos => res.status(200).json(todos))
      .catch(err => res.status(400).send(err.message));
  });

  router.delete("/:id/todos/:todoId", (req, res) => {
    return services.db.todos
      .delete({ userId: req.params.id, todoId: req.params.todoId })
      .then(todos => todos.map(todo => todo.serialize()))
      .then(todos => res.status(204).json(todos))
      .catch(err => res.status(400).send(err.message));
  });

  return router;
};
