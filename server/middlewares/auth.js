const jwt = require("jsonwebtoken");
const Authentication = require("../models/authenticationModel");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
  console.log("token", req.headers.authorization);
  try {
    jwt.verify(
      req.headers.authorization.replace("Bearer ", ""),
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(500).json({
            status: false,
            error: "Invalid Token",
          });
        } else {
          req.headers = decoded;
          next();
        }
      }
    );
  } catch (err) {
    return res.json({
      status: false,
      type: "loginToContinue",
      error: "Please login to continue",
    });
  }
};

module.exports = authenticateUser;
