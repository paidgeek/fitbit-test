var express = require("express");
var router = express.Router();
var connect = require("connect-ensure-login");

router.get("/", connect.ensureLoggedIn("/"), function(req, res, next) {
   res.render("home", {
      user: req.user
   });
});

module.exports = router;
