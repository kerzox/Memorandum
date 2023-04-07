var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const options = require("./knexfile");
const knex = require("knex")(options);

var indexRouter = require("./routes/index");
var userRouter = require("./routes/users");
var messagesRouter = require("./routes/messages");
var conRouter = require("./routes/conversation");

var moment = require("moment");

var app = express();


// view engine setup


app.use(
  cors({
    domain: "*",
  })
);

app.use((req, res, next) => {
  req.db = knex;
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

logger.token("res", (req, res) => {
  const headers = {};
  res.getHeaderNames().map((h) => (headers[h] = res.getHeader(h)));
  return JSON.stringify(headers);
});

app.get("/knex", function (req, res, next) {
  req.db
    .raw("SELECT VERSION()")
    .then((version) => console.log(version[0][0]))
    .catch((err) => {
      console.log(err);
      throw err;
    });
  res.send("Version logged successfully");
});

app.use(express.static(path.join(__dirname, "../client/build")));

// app.use("/", indexRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.use("/users", userRouter);
app.use("/messages", messagesRouter);
app.use("/conversation", conRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
