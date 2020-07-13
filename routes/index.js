var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  }
  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);
  users.findOne({ _id }, (err, results) => {
    if (err) {
      throw err;
    }
    if (results.isAdmin) {
      users.find().toArray((err, accounts) => {
        res.render("admin", { accounts });
      });
    } else {
      res.redirect("/users");
    }
  });
});

module.exports = router;
