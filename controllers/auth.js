const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  /* const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("please provide name, email and password");
  } */
  /* we can stick with the mongoose validators for checking for empty values or do as above ourselves */
  // const { name, email, password } = req.body;

  // hashing the password => we did it in the model with a middleware for much cleaner code
  /*  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const tempUser = { name, email, password: hashedPassword }; */

  // creating the user with the hashed password

  const user = await User.create({ ...req.body });
  /* const token = jwt.sign(
    { userID: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  ); */
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token });
};
const login = async (req, res) => {
  console.log("this is comming from login");
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
