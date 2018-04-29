const Promise = require("bluebird");

module.exports = (knex, Todo) => {
  return params => {
    return Promise.try(() =>
      knex("todos")
        .column(
          "todos.id AS id",
          "users.username AS name",
          "content",
          "status",
          "todos.created_at",
          "finished_at"
        )
        .innerJoin("users", "users.id", "=", "todos.user_id")
        .where("users.id", params.userId)
        .orderBy("id")
    )
      .then(todos => {
        return todos.map(todo => {
          return new Todo(todo);
        });
      })
      .catch(err => {
        throw err;
      });
  };
};
