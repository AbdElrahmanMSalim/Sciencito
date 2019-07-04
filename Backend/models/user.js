const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 15
  },
  city: {
    type: String,
    minlength: 5,
    maxlength: 50
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true
  },
  //todo add photo
  isAdmin: {
    type: Boolean,
    required: true
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    firstName: Joi.string()
      .min(5)
      .max(50)
      .required(),
    lastName: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    phoneNumber: Joi.string()
      .required()
      .min(5)
      .max(15),
    city: Joi.string()
      .min(5)
      .max(50),
    gender: Joi.string()
      .valid("Male", "Female")
      .required(),
    dateOfBirth: Joi.date().required(),
    isAdmin: Joi.boolean().required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
