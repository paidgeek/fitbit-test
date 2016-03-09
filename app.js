var express = require("express");
var handlebars = require("express-handlebars");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var Strategy = require("passport-fitbit-oauth2").FitbitOAuth2Strategy;
var ws = require("nodejs-websocket");
var config = require("./configuration");

var User = require("./models/user");
var mongoose = require("mongoose");
mongoose.connect(config.mongodbUrl);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "hbs");

//app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cookieParser());
app.use(session({
   secret: config.sessionSecret,
   resave: true,
   saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

passport.use("fitbit", new Strategy({
   clientID: config.fitbitClientId,
   clientSecret: config.fitbitClientSecret,
   scope: config.fitbitScope,
   callbackURL: config.fitbitCallbackURL
}, function(accessToken, refreshToken, profile, cb) {
   User.findOne({
      fitbitId: profile.id
   }, function(err, user) {
      if (err) {
         return cb(err, null);
      }

      if (!user) {
         profile.refreshToken = refreshToken;
         user = User.fromFitbitProfile(profile);

         user.save(function(err) {
            cb(err, user);
         });
      } else {
         return cb(null, user);
      }
   });
}));

passport.serializeUser(function(user, cb) {
   cb(null, user.id);
});
passport.deserializeUser(function(id, cb) {
   User.findById(id, function(err, user) {
      cb(err, user);
   });
});

app.use("/", require("./routes/login"));
app.use("/home", require("./routes/home"));
app.use("/auth", require("./routes/auth"));
app.use("/logout", require("./routes/logout"));

app.use(function(req, res, next) {
   var err = new Error("Not Found");
   err.status = 404;
   next(err);
});

if (app.get("env") === "development") {
   app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render("error", {
         message: err.message,
         error: err
      });
   });
}

app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render("error", {
      message: err.message,
      error: {}
   });
});

module.exports = app;
