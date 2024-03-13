const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path");


const app = express();
const server = http.createServer(app);
const io = new Server(server);
require("./app/routes/chat.routes")(io);

const db = require("./app/config/db.config");
db.sequelize.sync();

// app.get("/", (req, res)=>{
//     res.send("Success");
// }); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/view"));

app.get("/", (req, res) => {
  res.render("index");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", require("./app/routes"));

server.listen(4000, () => {
  console.log("Listning on port: 4000");
});