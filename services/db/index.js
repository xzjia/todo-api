const Knex = require("knex");

module.exports = function(config) {
  // initialize a connection to the database, and pass this
  // to the various submodules within
  const knex = Knex({
    client: config.client,
    port: config.connection.port,
    connection: `postres://postgres:postgres@${config.connection.host}/${
      config.connection.database
    }`
  });

  return {
    users: require("./users")(knex),
    todos: require("./todos")(knex)
  };
};
