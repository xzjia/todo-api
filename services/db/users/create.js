const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salfRounds = 10;
const Promise = require("bluebird");

const validateUsername = (username, password) => {
  //TODO: add validation logic for password
  return typeof username === "string" && username.replace(" ", "").length > 3;
};

module.exports = (knex, User) => {
  return params => {
    const username = params.username.toLowerCase();
    // FIXME: default password should not exist
    const password = params.password ? params.password : "default";

    return Promise.try(() => {
      if (!validateUsername(username, password)) {
        throw new Error("Invalid username/password.");
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
        return Promise.all([
          knex("users")
            .where({ username })
            .select(),
          jwt.sign({ id: username }, "supersecret", {
            expiresIn: 86400
          })
        ]);
      })
      .then(([users, jwt]) => {
        const user = new User(users.pop());
        console.log("***** 42 and returning", user, jwt);
        return [user, jwt];
      })
      .catch(err => {
        if (err.message.match("duplicate key value")) {
          throw new Error("Username already exists.");
        }
        console.log(err);
        // throw err;
      });
  };
};
