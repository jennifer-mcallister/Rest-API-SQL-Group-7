const { body } = require("express-validator");

exports.registerSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage(
      "You must provide a password that is at least 6 characters long"
    ),
  body("user")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 50 })
    .withMessage(
      "You must provide a username between 5 and 50 characters long"
    ),
];

exports.loginSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password").not().isEmpty().withMessage("You must provide a password"),
];
