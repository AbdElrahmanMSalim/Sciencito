const { Comment, validateComments } = require("../models/comment");
const { Article } = require("../models/article");
const { User } = require("../models/user");
const _ = require("lodash");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

// post a comment on an article
router.post("/", async (req, res) => {
  const { error } = validateComments(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userID);
  if (!user) return res.status(400).send("There is no such user");

  const article = await Article.findById(req.body.articleID);
  if (!article) return res.status(400).send("There is no such article");

  const comment = new Comment(
    _.pick(req.body, ["body", "userID", "articleID"])
  );
  await comment.save();

  res.send(comment);
});

// get all comments for an article
router.get("/:articleID", async (req, res) => {
  const { articleID } = req.params;

  const { error } = Joi.validate({ articleID }, { articleID: Joi.objectId() });
  if (error) return res.status(400).send(error.details[0].message);

  const article = await Article.findById(articleID);
  if (!article) return res.status(400).send("There is no such article");

  const comments = await Comment.find({ articleID });

  res.send(comments);
});

// delete a comment for an article
router.delete("/:commentID", async (req, res) => {
  const { commentID } = req.params;

  const { error } = Joi.validate({ commentID }, { commentID: Joi.objectId() });
  if (error) return res.status(400).send(error.details[0].message);

  const comment = await Comment.findByIdAndRemove(commentID);
  if (!comment) return res.status(400).send("There is no such comment");

  res.send(comment);
});

// edit a comment
router.put("/:commentID", async (req, res) => {
  const { commentID } = req.params;

  const { error: commentError } = Joi.validate(
    { commentID },
    { commentID: Joi.objectId() }
  );
  if (commentError) return res.status(400).send(error.details[0].message);

  const { error } = validateComments(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userID);
  if (!user) return res.status(400).send("There is no such user");

  const article = await Article.findById(req.body.articleID);
  if (!article) return res.status(400).send("There is no such article");

  const comment = await Comment.findByIdAndUpdate(
    commentID,
    _.pick(req.body, ["body", "userID", "articleID"]),
    {
      new: true
    }
  );
  if (!comment) return res.status(400).send("There is no such comment");

  res.send(comment);
});

module.exports = router;
