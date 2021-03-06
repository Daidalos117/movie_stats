var express = require("express");
var authRouter = require("./auth");
var userRouter = require("./user");
var movieRouter = require("./movie");
var showRouter = require("./show");
var indexRouter = require('./index');

var app = express();

app.use("/", indexRouter);
app.use("/auth/", authRouter.router);
app.use("/user/", userRouter.router)
app.use("/movie/", movieRouter);
app.use("/show/", showRouter);

module.exports = app;
