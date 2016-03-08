var express = require("express");
var passport = require("passport");
var router = express.Router();

router.get("/fitbit", passport.authenticate("fitbit"));

router.get("/fitbit/callback",
   passport.authenticate("fitbit", {
      failureRedirect: "/"
   }),
   function(req, res) {
      res.redirect("/home");
   });

module.exports = router;
