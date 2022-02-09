const router = require("express").Router();
//const bcryptjs = require('bcryptjs');
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;

/////// SIGN UP ////////////////////////////////////////////////

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  let errors = [];

  if (!req.body.username) {
    errors.push("You did not include a name!");
  }
  if (!req.body.password) {
    errors.push("You need a password");
  }

  if (errors.length > 0) {
    res.json(errors);
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  User.create({
    username: req.body.username,
    password: hashedPass,
  })
    .then((createdUser) => {
      console.log("User created:", createdUser);
      res.json(createdUser);
    })
    .catch((err) => {
      console.log(err.errors);
      res.json(err);
    });
});

/////// LOGIN////////////////////////////////////////////////
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      console.log(user)
      if (!user) {
        res.render("auth/login", {
          errorMessage: "User is not registered. Try with other username.",
        });
        return;
      } 
      const match = bcrypt.compareSync(password, user.password)
      if (!match) {
        //console.log(`${user} is logged in`)
        return res.json("incorrect password")
      } 
        
      req.session.user = user;
      res.json(`Welcome to our website, ${req.session.user.username}`)
      
    })
    .catch((error) => next(error));
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    console.log("This is the session", req.session);
    res.json("you have logged out");
});

module.exports = router;
