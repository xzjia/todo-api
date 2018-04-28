const express = require("express");

const router = express.Router();

module.exports = services => {
  router.get("/", (req, res) => res.status(200).send("hello"));

  return router;
};
