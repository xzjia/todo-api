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

  return router;
};
