const Promise = require("bluebird");

module.exports = (knex, Todo) => {
  return params => {
    const userId = params.userId;
    const content = params.content;

    return Promise.try(() =>
      knex("todos").insert({
        user_id: userId,
        content,
        status: "pending"
      })
    )
      .then(() => {
        return knex("todos")
          .column(
            "todos.id AS id",
            "users.username AS name",
            "content",
            "status",
            "todos.created_at",
            "finished_at"
          )
          .innerJoin("users", "users.id", "=", "todos.user_id")
          .where("todos.user_id", userId)
          .orderBy("id");
      })
      .then(todos => {
        return new Todo(todos.pop());
      })
      .catch(err => {
        throw err;
      });
  };
};
