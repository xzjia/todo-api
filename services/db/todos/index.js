const moment = require("moment");

const Todo = function(dbTodo) {
  this.id = dbTodo.id;
  this.username = dbTodo.username;
  this.content = dbTodo.content;
  this.createAt = new Date(dbTodo.created_at);
};

Todo.prototype.serialize = function() {
  return {
    id: this.id,
    username: this.username,
    content: this.content,
    createAt: moment(this.createAt).format("hh:mm:ss")
  };
};

module.exports = knex => {
  return {
    create: require("./create")(knex, Todo),
    list: require("./list")(knex, Todo)
  };
};
