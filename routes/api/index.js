const express = require("express");

const router = express.Router();

const userRouter = require("./user");

module.exports = services => {
  router.use("/users", userRouter(services));

  return router;
};
