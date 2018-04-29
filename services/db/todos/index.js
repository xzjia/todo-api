const moment = require("moment");

const Todo = function(dbTodo) {
  this.id = dbTodo.id;
  this.username = dbTodo.name;
  this.content = dbTodo.content;
  this.status = dbTodo.status;
  this.createAt = new Date(dbTodo.created_at);
  if (dbTodo.finished_at) {
    this.finishedAt = new Date(dbTodo.finished_at);
  }
};

Todo.prototype.serialize = function() {
  return {
    id: this.id,
    username: this.username,
    content: this.content,
    status: this.status,
    createAt: moment(this.createAt).format("hh:mm:ss"),
    finishedAt: this.finishedAt
      ? moment(this.finishedAt).format("hh:mm:ss")
      : "Not finished yet."
  };
};

module.exports = knex => {
  return {
    create: require("./create")(knex, Todo),
    list: require("./list")(knex, Todo),
    update: require("./update")(knex, Todo),
    delete: require("./delete")(knex, Todo)
  };
};
