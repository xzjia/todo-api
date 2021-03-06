const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const verifyToken = require("./verifyToken");

module.exports = services => {
  router.get("/", verifyToken, function(req, res, next) {
    res.status(200).send(`Welcome ${req.username}`);
  });

  router.post("/login", (req, res) => {
    return services.db.users
      .login({ username: req.body.username, password: req.body.password })
      .then(([user, jwt]) => {
        const result = user;
        result["auth"] = true;
        result["token"] = jwt;
        res.status(201).json(result);
      })
      .catch(err => {
        // TODO: maybe return the token
        return res.status(400).send(err.message);
      });
  });

  router.post("/register", (req, res) => {
    return services.db.users
      .create({ username: req.body.username, password: req.body.password })
      .then(([user, jwt]) => {
        const result = user;
        result["auth"] = true;
        result["token"] = jwt;
        res.status(201).json(result);
      })
      .catch(err => {
        // TODO: maybe return the token
        return res.status(400).send(err.message);
      });
  });

  router.get("/:id/todos", verifyToken, (req, res) => {
    return services.db.todos
      .list({ userId: req.params.id })
      .then(todos => todos.map(todo => todo.serialize()))
      .then(todos => res.status(200).json(todos))
      .catch(err => res.status(400).send(err.message));
  });

  router.post("/:id/todos", verifyToken, (req, res) => {
    return services.db.todos
      .create({ userId: req.params.id, content: req.body.content })
      .then(todo => todo.serialize())
      .then(todos => res.status(201).json(todos))
      .catch(err => res.status(400).send(err.message));
  });

  router.put("/:id/todos/:todoId", verifyToken, (req, res) => {
    return services.db.todos
      .update({ userId: req.params.id, todoId: req.params.todoId })
      .then(todo => todo.serialize())
      .then(todos => res.status(200).json(todos))
      .catch(err => res.status(400).send(err.message));
  });

  router.delete("/:id/todos/:todoId", verifyToken, (req, res) => {
    return services.db.todos
      .delete({ userId: req.params.id, todoId: req.params.todoId })
      .then(todos => res.status(204).json(todos))
      .catch(err => res.status(400).send(err.message));
  });

  return router;
};
