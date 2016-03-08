var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;
var express = require('express');
var passport = require("passport");
var mongoose = require("mongoose");

var User = require("./models.js").User;

var app = express();

mongoose.connect("mongodb://192.168.99.100:27017/food");
var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
   console.log("connected to mongodb");
});

passport.use(new FitbitStrategy({
      clientID: "227NR4",
      clientSecret: "5c126a5e376a076df5bec1a566ac37f2",
      scope: "profile",
      callbackURL: "http://127.0.0.1:8080/Callback"
   },
   function(accessToken, refreshToken, profile, done) {
      User.findOne({
         fitbitId: profile.id
      }, function(err, user) {
         if (err) {
            return console.error(err);
         }

         if (user) {
            console.log("logged in");
            console.log(user);
            done(null, null);
         } else {
            user = User.fromFitbitProfile(profile);

            user.save(function(err, user) {
               if (err) {
                  return console.error(err);
               }

               done(null, null);
            });
         }
      });

      /*
      User.findOrCreate({
         fitbitId: profile.id
      }, function(err, user) {
         return done(err, user);
      });
      */
   }
));

passport.serializeUser(function(user, cb) {
   cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
   cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/', passport.authenticate('fitbit'));

app.get('/callback', passport.authenticate('fitbit', {
      failureRedirect: '/login'
   }),
   function(req, res) {
      res.redirect('/');
   });

app.listen(8080);
