var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;
const ObjectId = require("mongodb").ObjectId;
/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  }
  const users = req.app.locals.users;
  const stock = req.app.locals.stock;
  const isAdmin = req.app.locals.isAdmin;
  const _id = ObjectID(req.session.passport.user);
  users.findOne(
    {
      _id,
    },
    (err, results) => {
      if (err) {
        throw err;
      }
      if (results.isAdmin) {
        stock.find().toArray((err, allStock) => {
          res.render("log", {
            allStock
          });
        });
      } else {
        res.redirect("/users");
      }
    }
  );
});
router.get("/add", (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  }
  const users = req.app.locals.users;
  const _id = ObjectID(req.session.passport.user);
  users.findOne(
    {
      _id,
    },
    (err, results) => {
      if (err) {
        throw err;
      }
      if (results.isAdmin) {
        res.render("addStock");
      } else {
        res.redirect("/users");
      }
    }
  );
});
router.post("/manipulateRAAdd/:id", (req, res, next) => {
  const requiredAmount = parseInt(req.body.RAamount);
  if (!isNaN(requiredAmount)) {
    const stock = req.app.locals.stock;
    const _id = req.params.id;
    const edit = {
      requiredAmount: requiredAmount,
    };
    stock.updateOne(
      {
        _id: ObjectId(_id),
      },
      {
        $inc: {
          requiredAmount: requiredAmount,
        },
      },
      (err) => {
        if (err) {
          throw err;
        }
        res.redirect("/log");
      }
    );
  }else{
    res.redirect("/log");
  }
});
router.post("/manipulateRASub/:id", (req, res, next) => {
  let requiredAmount = parseInt(req.body.RAamount);
  if(!isNaN(requiredAmount)){
      requiredAmount = -requiredAmount;
  const stock = req.app.locals.stock;
  const _id = req.params.id;
  const edit = {
    requiredAmount: requiredAmount,
  };
  stock.updateOne(
    {
      _id: ObjectId(_id),
    },
    {
      $inc: {
        requiredAmount: requiredAmount,
      },
    },
    (err) => {
      if (err) {
        throw err;
      }

      res.redirect("/log");
    }
  );
  }else{
    res.redirect("/log");
  }

});

router.post("/manipulateAADD/:id", (req, res, next) => {
  const amount = parseInt(req.body.Aamount);
  if (!isNaN(amount)) {
    const stock = req.app.locals.stock;
    const _id = req.params.id;
    stock.updateOne(
      {
        _id: ObjectId(_id),
      },
      {
        $inc: {
          amount: amount,
        },
      },
      (err) => {
        if (err) {
          throw err;
        }
        res.redirect("/log");
      }
    );
  }else{
    res.redirect("/log");
  }
});

router.post("/manipulateASub/:id", (req, res, next) => {
  let amount = parseInt(req.body.Aamount);
  if(!isNaN(amount)){
  amount = -amount;
  const stock = req.app.locals.stock;
  const _id = req.params.id;
  const edit = {
    amount: amount,
  };
  stock.updateOne(
    {
      _id: ObjectId(_id),
    },
    {
      $inc: {
        amount: amount,
      },
    },
    (err) => {
      if (err) {
        throw err;
      }

      res.redirect("/log");
    }
  );
  }else{
    res.redirect("/log");
  }

});
router.post("/add", (req, res, next) => {
  const addParams = req.body;
  const stock = req.app.locals.stock;
  const name = addParams.name.toUpperCase();
  const requiredAmount = parseInt(addParams.quantity);
  const amount = parseInt(addParams.amount);
  const payload = {
    name: name,
    requiredAmount: requiredAmount,
    amount: amount,
  };
  stock.insertOne(payload, (err) => {
    if (err) {
      req.flash("error", err);
    } else {
      req.flash("success", "Item Added");
    }
    res.redirect("/log");
  });
});
router.post("/nameUpdate/:id", (req, res, next) => {
  const newName = req.body.newName;
  const stock = req.app.locals.stock;
  const _id = req.params.id;
  const edit = {
    name: newName
  }
  console.log(edit)
  if(newName.length > 0){
      stock.updateOne({_id: ObjectId(_id)},{$set: edit}, (err) => {
      if (err) {
        throw err;
      }

      res.redirect("/log");
    }
  )
  }else{
    res.redirect("/log");
  }
})

router.post("/deleteStock/:id", (req, res, next) => {
  const _id = req.params.id;
  const stock = req.app.locals.stock;
  stock.deleteOne({_id: ObjectId(_id)}, (err)=> {
    if(err) {
      console.log(err);
    }
    res.redirect("/log");
  })
})


module.exports = router;
