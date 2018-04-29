module.exports = (knex, Todo) => {
  return params => {
    return Promise.resolve(
      knex("todos")
        .where({
          id: params.todoId
        })
        .del()
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
          .where("todos.user_id", params.userId);
      })
      .then(todos => {
        return todos.map(todo => new Todo(todo));
      });
  };
};
