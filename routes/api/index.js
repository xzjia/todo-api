const express = require("express");

const router = express.Router();

const userRouter = require("./user");

const userRouterAuth = require("./userauth/");

module.exports = services => {
  router.use("/v1.0/users", userRouter(services));
  router.use("/v1.1/users", userRouterAuth(services));

  return router;
};
