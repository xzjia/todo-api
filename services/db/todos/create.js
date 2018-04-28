module.exports = (knex, Todo) => {
  return params => {
    const userId = params.userId;
    const content = params.content;

    return Promise.resolve(
      knex("todos").insert({
        user_id: userId,
        content
      })
    )
      .then(() => {
        return knex("todos")
          .column(
            "todos.id AS id",
            "users.username AS name",
            "content",
            "todos.created_at"
          )
          .innerJoin("users", "users.id", "=", "todos.user_id")
          .where("todos.user_id", userId);
      })
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