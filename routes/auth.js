const express = require("express");
const router = express.Router();
const authUtils = require("../utils/auth");
const passport = require("passport");
const app = require("../app");

router.get("/login", (req, res, next) => {
  const messages = req.flash();
  res.render("login", { messages });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Wrong username or password",
  }),
  (req, res, next) => {
    res.redirect("/users");
  }
);

router.get("/register", (req, res, next) => {
  const messages = req.flash();
  res.render("register", { messages });
});
router.post("/search", (req, res, next) => {
  const searched = req.body;
  const payload = {
    searchedFor: searched.search,
  };
  console.log(searched);
  res.redirect("../users/finduser/" + payload.searchedFor);
});

router.post("/register", (req, res, next) => {
  const registrationParams = req.body;
  const name = registrationParams.name;
  const users = req.app.locals.users;
  const username = registrationParams.username.toLowerCase();
  const password = authUtils.hashPassword(registrationParams.password);
  const payload = {
    name: name,
    username: username,
    password: password,
    isAdmin: false,
  };

  users.insertOne(payload, (err) => {
    if (err) {
      req.flash("error", "username already exists");
    } else {
      req.flash("success", "account created");
    }
    res.redirect("/auth/register");
  });
});
router.get("/logout", (req, res, next) => {
    req.app.locals.isAdmin = false;
    req.app.locals.isLoggedIn = false;
    req.session.destroy();

  res.redirect("/");
});

module.exports = router;
