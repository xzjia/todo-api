module.exports = (knex, User) => {
  return params => {
    return Promise.resolve(
      knex("users")
        .where("username", params.username)
        .select()
    ).then(users => {
      return users.map(user => new User(user));
    });
  };
};
