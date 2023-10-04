const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
});
// for hashing the password before saving the document to the database
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // the this here means its for the document that we are sending
});

// we can create other methods also in the schema to manipulate the data soo we access it later when we create a document using the model that use that specific schema
userSchema.methods.getName = function () {
  return this.name;
};
// a use case for it is to use it on generating auth tokens when a login or signup
userSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token;
};
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};
module.exports = mongoose.model("users", userSchema);
