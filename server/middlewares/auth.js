const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
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
