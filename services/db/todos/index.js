const moment = require("moment");

const todo = function(dbTodo) {
  this.id = dbTodo.id;
  this.userId = dbTodo.user_id;
  this.content = dbTodo.content;
  this.createAt = new Date(dbTodo.created_at);
};

todo.prototype.serialize = function() {
  return {
    id: this.id,
    userId: this.userId,
    content: this.content,
    createAt: moment(this.createAt).format("hh:mm:ss")
  };
};

module.exports = knex => {
  return {};
};
