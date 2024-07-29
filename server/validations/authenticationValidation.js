const { body, validationResult } = require("express-validator");

module.exports = {
  authValidation: [
    body("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Enter a valid Email"),
    body("password")
      .exists()
      .withMessage("Password cannot be empty")
      .isLength({ min: 8 })
      .withMessage("Password should be atleast 8 digit long"),
    body("firstName").exists().withMessage("First name is required"),
    body("lastName").exists().withMessage("Last name is required"),
  ],

  handleAuthErrors: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: false, error: errors.array() });
    }
    next();
  },
};
