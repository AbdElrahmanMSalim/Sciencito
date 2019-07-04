const Joi = require("joi");
const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  articleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true
  },
  postedDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Comment = mongoose.model("Comment", commentsSchema);

function validateComments(comments) {
  const schema = {
    body: Joi.string().required(),
    userID: Joi.objectId().required(),
    articleID: Joi.objectId().required()
  };

  return Joi.validate(comments, schema);
}

exports.Comment = Comment;
exports.validateComments = validateComments;
