const express = require("express");
const users = require("../routes/users");
const articles = require("../routes/aricles");
const comments = require("../routes/comments");
const likes = require("../routes/likes");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/comments", comments);
  app.use("/api/likes", likes);
  app.use("/api/articles", articles);
  app.use(error);
};
