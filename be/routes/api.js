
var express = require("express");
var authRouter = require("./auth");
var userRouter = require("./user");
var movieRouter = require("./movie");
var historyRouter = require("./history");

var app = express();

/*
app.use("/auth/", authRouter);
app.use("/user/", userRouter)
app.use("/movie/", movieRouter);
app.use("/history/", historyRouter);*/

module.exports = app;
