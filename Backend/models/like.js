const Joi = require("joi");
const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  articleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true
  }
});

const Like = mongoose.model("Like", likesSchema);

function validateLikes(like) {
  const schema = {
    userID: Joi.objectId().required(),
    articleID: Joi.objectId().required()
  };

  return Joi.validate(like, schema);
}

likesSchema.index({ userID: 1, articleID: 1 }, { unique: true });

exports.Like = Like;
exports.validateLikes = validateLikes;
