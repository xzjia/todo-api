exports.up = function(knex, Promise) {
  return knex.schema.createTable("todos", t => {
    t
      .increments()
      .index()
      .primary();

    t
      .integer("user_id")
      .references("id")
      .inTable("users");

    t.text("content");

    t
      .timestamp("created_at")
      .notNullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("todos");
};
