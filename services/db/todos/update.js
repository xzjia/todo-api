module.exports = (knex, Todo) => {
  return params => {
    return Promise.resolve(
      knex("todos")
        .where("id", params.todoId)
        .update({
          status: "finished",
          finished_at: knex.fn.now()
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
          .where("todos.id", params.todoId);
      })
      .then(todos => {
        console.log("****** In update", todos);
        return new Todo(todos.pop());
      });
  };
};
