const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");

const auth = async (req, res, next) => {
  // check for the header and that the token starts with Bearer
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userID: payload.userID, name: payload.name };
    next();
  } catch (err) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
