const { body, header, check, query, validationResult, } = require('express-validator');

const Router = require("express").Router();

const HelperFunctions = require('../Helpers/JWTFunctions');
const authMiddleware = require("../middlewares/auth");
const authController = require("../controller/auth.controller");
const validator = require("../utils/validator");

Router.get("/refreshtoken", [query('platform').notEmpty()], authController.refreshToken);

Router.post("/register", [HelperFunctions.verifyToken, validator.validateRegister], authController.register);

Router.post("/login", [HelperFunctions.verifyToken, validator.validateLogin], authController.login);

Router.post('/logout', authMiddleware, authController.logout);

module.exports = Router;

