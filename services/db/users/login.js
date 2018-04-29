const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salfRounds = 10;
const Promise = require("bluebird");
const list = require("./list");

module.exports = (knex, User) => {
  return params => {
    const username = params.username.toLowerCase();
    // FIXME: default password should not exist
    const password = params.password ? params.password : "default";

    return Promise.try(() => {
      return list({ username });
    })
      .then(foundUser => {
        if (foundUser.length === 0) {
          throw new Error("No user found");
        }
        const passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) throw new Error("Wrong password");
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
        return [user, jwt];
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };
};
