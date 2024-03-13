const { check, param, query } = require("express-validator");

exports.validateLogin = [
  check("email").isEmail().withMessage("email field is required with a valid email!"),
  check("password").notEmpty().withMessage("password field is required!"),
];

exports.validateRegister = [
  check("email").isEmail().withMessage("email field is required with a valid email!"),
  check("name").notEmpty().withMessage("name field is required!"),
  check("password").notEmpty().withMessage("password field is required!"),
];
