const bcrypt = require("bcrypt");
const salfRounds = 10;
const Promise = require("bluebird");

const validateUsername = username =>
  typeof username === "string" && username.replace(" ", "").length > 3;

module.exports = (knex, User) => {
  return params => {
    const username = params.username.toLowerCase();
    const password = params.password ? params.password : "default";

    return Promise.try(() => {
      if (!validateUsername(username)) {
        throw new Error("Invalid username/password");
      }
    })
      .then(() => bcrypt.hash(password, salfRounds))
      .then(hashedPassword => {
        return knex("users").insert({
          username,
          password: hashedPassword
        });
      })
      .then(() => {
        return knex("users")
          .where({ username })
          .select();
      })
      .then(users => {
        return new User(users.pop());
      })
      .catch(err => {
        if (err.message.match("duplicate key value")) {
          throw new Error("Username already exists.");
        }

        throw err;
      });
  };
};
