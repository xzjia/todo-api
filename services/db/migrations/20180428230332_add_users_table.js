exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", t => {
    t
      .increments()
      .index()
      .primary();

    t
      .string("username", 15)
      .unique()
      .notNullable()
      .index();

    t.string("password", 63);

    t
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
