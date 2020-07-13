var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoURL =
  "mongoServer";
const mongoClient = require("mongodb").MongoClient;
const passport = require("passport");
const strategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash");
const authUtils = require("./utils/auth");
const hbs = require("hbs");
let app = express();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var logRouter = require("./routes/log");
const { Strategy } = require("passport");
const { ObjectId } = require("mongodb");
const ObjectID = require("mongodb").ObjectID

//database connections

mongoClient.connect(mongoURL, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    throw err;
  }
  console.log("Connected to Database");
  const userDB = client.db("user-profiles");
  const users = userDB.collection("users");
  const stockDB = client.db("stock");
  const stock = stockDB.collection("stock");
  users.createIndex({ username: 1 }, { unique: true });
  stock.createIndex({ name: 1 }, { unique: true });
  app.locals.users = users;
  app.locals.stock = stock;
});
//passport connections
passport.use(
  new strategy((username, password, done) => {
    username = username.toLowerCase();
    app.locals.users.findOne({ username }, (err, user) => {
      if (err) {
        app.locals.isLoggedIn = false;
        return done(err);
      }

      if (!user) {
        app.locals.isLoggedIn = false;
        return done(null, false);
      }

      if (user.password != authUtils.hashPassword(password)) {
        app.locals.isLoggedIn = false;
        return done(null, false);
      }
      if (user.isAdmin) {
        app.locals.isAdmin = true;
        console.log("admin");
      }else{
        app.locals.isAdmin = false;
        console.log("normal");
      }
        app.locals.isLoggedIn = true;
        return done(null, user);
      
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  done(null, { id });
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
hbs.registerPartial("navbar", __dirname + "/views/partials/navbar");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "session secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  next();
});


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/log", logRouter);

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
