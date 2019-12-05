const express = require("express");
const userRouter = require("./users/userRouter");
const server = express();
const morgan = require("morgan");

server.use(logger);
server.use("/api/users", userRouter);
server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
const time = new Date().toLocaleString();

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl} at ${time}`);
  next();
}

module.exports = server;
