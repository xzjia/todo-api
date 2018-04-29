exports.up = function(knex, Promise) {
  return knex.schema.alterTable("todos", t => {
    t.string("status", 31);

    t.timestamp("finished_at");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable("todos", t => {
    t.dropColumn("status");
    t.dropColumn("finished_at");
  });
};
