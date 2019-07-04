const { Like, validateLikes } = require("../models/like");
const { Article } = require("../models/article");
const { User } = require("../models/user");
const _ = require("lodash");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

// post a like on an article
router.post("/", async (req, res) => {
  const { error } = validateLikes(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.body.userID);
  if (!user) return res.status(400).send("There is no such user");

  let article = await Article.findById(req.body.articleID);
  if (!article) return res.status(400).send("There is no such article");

  const previousLike = await Like.find(
    _.pick(req.body, ["userID", "articleID"])
  );
  if (previousLike.length !== 0) return res.status(200).send("Already Liked");

  article.numberOfLikes += 1;
  await article.save();

  const like = new Like(_.pick(req.body, ["userID", "articleID"]));
  await like.save();

  res.send(like);
});

// get numberOfLikes, usersWhoLiked an article
router.get("/:articleID", async (req, res) => {
  const { articleID } = req.params;

  const { error } = Joi.validate({ articleID }, { articleID: Joi.objectId() });
  if (error) return res.status(400).send(error.details[0].message);

  const article = await Article.findById(articleID);
  if (!article) return res.status(400).send("There is no such article");

  const likes = await Like.find({ articleID });
  const users = likes.map(like => like.userID);

  res.send({
    numberOfLikes: article.numberOfLikes,
    usersWhoLiked: users
  });
});

// delete a like for an article
router.delete("/:articleID/:likeID", async (req, res) => {
  const { articleID, likeID } = req.params;

  const { error } = Joi.validate(
    { likeID, articleID },
    { likeID: Joi.objectId(), articleID: Joi.objectId() }
  );
  if (error) return res.status(400).send(error.details[0].message);

  let article = await Article.findById(articleID);
  if (!article) return res.status(400).send("There is no such article");

  const like = await Like.findByIdAndRemove(likeID);
  if (!like) return res.status(400).send("There is no such like");

  article.numberOfLikes -= 1;
  await article.save();
  res.send(like);
});

module.exports = router;
