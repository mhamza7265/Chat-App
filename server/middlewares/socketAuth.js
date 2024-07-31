const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateSocketUser = (socket, next) => {
  try {
    jwt.verify(
      socket.handshake.query.token.replace("Bearer ", ""),
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          return next(new Error("Invalid Token"));
        } else {
          socket.headers = decoded;
          next();
        }
      }
    );
  } catch (err) {
    return next(new Error("Please login to continue"));
  }
};

module.exports = authenticateSocketUser;
