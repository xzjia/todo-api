/* eslint-disable no-console */
const { expect } = require("chai");
const Promise = require("bluebird");
const config = require("../config");
const knex = require("knex")(config.db);
const db = require("../services/db")(config.db);

const forcePromiseReject = () => {
  throw new Error("This promise should have failed, but did not.");
};

describe("users", () => {
  describe("setup", () => {
    it("has run the initial migrations", () =>
      knex("users")
        .select()
        .catch(e => console.log(e)));
  });

  describe("#create", () => {
    let params = { username: "" };

    context("when bad params are given", () => {
      before(() => {
        params = { username: " " };
      });

      it("politely refuses", () =>
        db.users
          .create(params)
          .then(forcePromiseReject)
          .catch(err =>
            expect(err.message).to.equal("Invalid username/password.")
          ));
    });

    context("when good params are given", () => {
      before(() => {
        params.username = "rp-3";
      });

      afterEach(() => knex("users").del()); // delete all users after each spec

      it("creates a user", () =>
        db.users.create(params).then(user => {
          expect(user).to.include({ username: params.username });
          expect(user.id).to.be.a("number");
        }));

      context("when a duplicate username is provided", () => {
        beforeEach(() => db.users.create(params));

        it("generates a sanitized error message", () =>
          db.users
            .create(params)
            .then(forcePromiseReject)
            .catch(err =>
              expect(err.message).to.equal("Username already exists.")
            ));
      });
    });
  });
});

describe("user_todos", () => {
  let userId;
  let anotherUserId;
  const content = "Finish API project";

  before(() =>
    db.users
      .create({ username: "apple" })
      .then(user => {
        userId = user.id;
        return db.users.create({ username: "banana" });
      })
      .then(user => {
        anotherUserId = user.id;
        knex("todos").del();
      })
  );

  after(() =>
    knex("todos")
      .del()
      .then(() => knex("users").del())
  );

  describe("#create", () => {
    after(() => knex("todos").del());

    it("creates a todo", () =>
      db.todos.create({ userId, content }).then(todos => {
        expect(todos[0]).to.include({ username: "apple", content });
        expect(todos[0].id).to.be.a("number");
        expect(todos[0].createdAt).to.be.a("Date");
      }));
  });

  describe("#list", () => {
    before(() =>
      knex("todos")
        .insert([
          {
            user_id: userId,
            content,
            status: "pending"
          },
          {
            user_id: userId,
            content,
            status: "pending"
          }
        ])
        .then(() => Promise.delay(500))
        .then(() =>
          knex("todos").insert({
            user_id: userId,
            content,
            status: "pending"
          })
        )
    );

    after(() => knex("todos").del());

    it("lists the right number of todos", () =>
      db.todos
        .list({ userId })
        .then(todos => expect(todos.length).to.equal(3)));
  });
});
