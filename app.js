const path = require("path");

const express = require("express");
const session = require("express-session");
const csrf = require("csurf");

const db = require("./data/database");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const sessionConfig = require("./config/sessions"); //new name because separate function
//custom middlewares
const authMW = require("./middleware/auth-mw");
const csrfMW = require('./middleware/csrf-token-mw')

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const mongodbSessionStore = sessionConfig.sessionKey(session);

//sessionConfig with nameKey
//mongodbSessionStore as argument
//refactored session
app.use(session(sessionConfig.headerKey(mongodbSessionStore)));
//csrf function after session creation
app.use(csrf());

//auth mw
app.use(authMW);
app.use(csrfMW);

app.use(authRoutes);
app.use(blogRoutes);

app.use(function (error, req, res, next) {
  res.render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
