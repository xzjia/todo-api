const moment = require("moment");

const User = function(dbUser) {
  this.id = dbUser.id;
  this.username = dbUser.username;
  this.createAt = new Date(dbUser.created_at);
};

User.prototype.serialize = function() {
  return {
    id: this.id,
    username: this.username,
    createAt: moment(this.createAt).format("hh:mm:ss")
  };
};

module.exports = knex => {
  return {
    create: require("./create")(knex, User),
    login: require("./login")(knex, User),
    list: require("./list")(knex, User)
  };
};
