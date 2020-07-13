var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const ObjectId = require("mongodb").ObjectId;
/* GET users listing. */
router.get("/", (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  }

  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);
  users.findOne({ _id }, (err, results) => {
    if (err) {
      throw err;
    }
    // console.log(results.isAdmin);
    res.render("account", { ...results });
  });
});

router.get("/finduser/:username", (req, res, next) => {
  const users = req.app.locals.users;
  const username = req.params.username;
  users.findOne({ username }, (err, results) => {
    if (err || !results) {
      res.render("public-profile", { messages: { error: ["User not found"] } });
    }
    res.render("public-profile", { ...results, username });
  });
});
router.get("/a", (req, res, next) => {
  res.redirect("/")
})
router.post("/removePermisions/:id", (req,res,next) =>{
  const users = req.app.locals.users;
  const id = req.params.id;
  users.updateOne({_id: ObjectId(id)}, {$set: {isAdmin: false}}, (err) => {
    if(err){
      throw err;
    }else{
      res.redirect("/")
    }
  })
})
router.post("/addPermisions/:id", (req,res,next) =>{
  const users = req.app.locals.users;

  const id = req.params.id;
  users.updateOne({_id: ObjectId(id)}, {$set: {isAdmin: true}}, (err) => {
    if(err){
      throw err;
    }else{
      res.redirect("/")
    }
  })
})
router.post("/", (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  }

  const users = req.app.locals.users;
  const { github, twitter, facebook } = req.body;
  const _id = ObjectID(req.session.passport.user);
  users.updateOne({ _id }, { $set: { github, twitter, facebook } }, (err) => {
    if (err) {
      throw err;
    }

    res.redirect("/users");
  });
});
module.exports = router;
