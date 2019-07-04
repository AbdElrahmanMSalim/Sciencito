const auth = require("../middleware/auth");
const _ = require("lodash");
const { Article, validateArticle } = require("../models/article");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validateArticle(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let article = new Article(
    _.pick(req.body, ["subject", "body", "category", "userID"]) // todo this userID must be taken from the authToken not body
  );
  await article.save();
  res.send(article);
});

router.get("/current/:articleID", async (req, res) => {
  const article = await Article.find({ _id: req.params.articleID });
  if (!article) return res.status(400).send("Not Found");

  res.send(article);
});

router.get("/:userEmail", async (req, res) => {
  const user = await User.findOne({ email: req.params.userEmail });
  if (!user)
    return res
      .status(400)
      .send(`There is no such user as ${req.params.userEmail}`);

  const articles = await Article.find({ userID: user._id });
  if (!articles) return res.status(400).send("No Articles Found");

  res.send(articles);
});

// for the admin only
router.get("/", async (req, res) => {
  res.send(await Article.find({}));
});

// for the admin only
router.delete("/:articleID", async (req, res) => {
  const article = await Article.findByIdAndRemove(req.params.articleID);
  if (!article) return res.status(400).send("No such Article was found");

  res.send(article);
});

// for the admin only
router.put("/:articleID", async (req, res) => {
  const { error } = validateArticle(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const article = await Article.findByIdAndUpdate(
    req.params.articleID,
    _.pick(req.body, ["subject", "body", "category", "userID"]),
    { new: true }
  );
  if (!article) return res.status(404).send("given articleID not found");

  res.send(article);
});

module.exports = router;
