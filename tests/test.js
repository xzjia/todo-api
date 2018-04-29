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
        params.username = "apple";
      });

      afterEach(() => knex("users").del());

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
  const content = "Finish eating apple.";
  const anotherContent = "Finish eating banana.";

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
      db.todos.create({ userId, content }).then(todo => {
        expect(todo).to.include({
          username: "apple",
          content,
          status: "pending"
        });
        expect(todo.id).to.be.a("number");
        expect(todo.createdAt).to.be.a("Date");
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
            user_id: anotherUserId,
            content: anotherContent,
            status: "pending"
          }
        ])
        .then(() => Promise.delay(500))
        .then(() =>
          knex("todos").insert({
            user_id: userId,
            content: anotherContent,
            status: "pending"
          })
        )
    );

    after(() => knex("todos").del());

    it("lists the right number of todos", () => {
      db.todos.list({ userId }).then(todos => {
        expect(todos.length).to.equal(2);
      });
      db.todos.list({ userId: anotherUserId }).then(todos => {
        expect(todos.length).to.equal(1);
      });
    });

    it("lists the right todos", () =>
      db.todos.list({ userId }).then(todos => {
        expect(todos[0]).to.include({
          username: "apple",
          content,
          status: "pending"
        });
        expect(todos[0].id).to.be.a("number");
        expect(todos[0].createdAt).to.be.a("Date");
        expect(todos[1]).to.include({
          username: "apple",
          content: anotherContent,
          status: "pending"
        });
        expect(todos[1].id).to.be.a("number");
        expect(todos[1].createdAt).to.be.a("Date");
      }));
  });

  xdescribe("#update and #delete", () => {
    let todoId;
    before(() =>
      db.todos
        .create({
          userId,
          content: "todo waiting to be finished"
        })
        .then(todo => {
          console.log("******** In before block\n", todo);
          todoId = todo.id;
        })
    );

    after(() => knex("todos").del());

    it("update the given todo status", () => {
      console.log("Before test\n", userId + "\n", todoId);
      db.todos.update({ userId, todoId }).then(todo => {
        expect(todo.status).to.equal("finished");
      });
    });

    it("delete the given todo status", () => {
      console.log("Before test 2\n", userId + "\n", todoId);
      db.todos.delete({ userId, todoId }).then(() =>
        db.todos.list({ userId }).then(todos => {
          expect(todos.length).to.equal(0);
        })
      );
    });
  });
});
