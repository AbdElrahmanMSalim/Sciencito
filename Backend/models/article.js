const Joi = require("joi");
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  body: {
    type: String,
    required: true
    //todo add minimum length of articles
  },
  category: {
    type: String,
    required: true
    //todo it is supposed to be an enum with the categories
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  publishDate: {
    type: Date
  },
  submissionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  numberOfLikes: {
    type: Number,
    default: 0
  }
  //todo add photos to the articles
});

const Article = mongoose.model("Article", articleSchema);

function validateArticle(article) {
  const schema = {
    subject: Joi.string()
      .min(5)
      .max(50)
      .required(),
    body: Joi.string().required(),
    category: Joi.string().required(), // todo .valid(categoires)
    userID: Joi.objectId().required()
  };

  return Joi.validate(article, schema);
}

exports.Article = Article;
exports.validateArticle = validateArticle;
