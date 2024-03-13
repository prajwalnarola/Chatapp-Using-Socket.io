const Router = require("express").Router();

const authRoutes = require("./auth.routes");
const chatRoutes = require("./chat.routes");

Router.use("/auth/", authRoutes);

module.exports = Router;


